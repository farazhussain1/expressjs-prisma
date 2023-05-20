import bcrypt from "bcrypt";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import JOI from "joi";
import { v4 } from "uuid";
import { transport } from "../config/mail.config";
import { Request, Response } from "express";
// import { ForgetPassword } from "../model";
import { envConfig } from "../config/envConfig";
import { UserService } from "../service";
import path from "path";
import { readFile } from "fs/promises";
import { uploadFile } from "../helpers/formidable";
import { error } from "../helpers/errorHelper";
export class UserController {
  private forgetPasswordData: any;
  private userService: UserService;
  constructor() {
    this.forgetPasswordData = {};
    this.userService = new UserService();
  }

  async getAll(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const user = await this.userService.getAll(search?.toString() ?? "");
      console.log(user);
      return res.status(200).json({ message: "Success", user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async verifyEmail(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const token = req.params.token;
    let email = "";
    verify(token, envConfig.SECRET_KEY, (err, payload: any) => {
      if (err) {
        res.status(400).json({ message: "link is expired, try again!" });
      }
      email = payload.email;
    });
    try {
      const updatedUser = await this.userService.update(email, {
        isVerified: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "user didn't exists" });
      }
      return res.status(200).send("<h1>Success you are verified user now</h1>");
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const validator = JOI.object()
      .keys({
        email: JOI.string().required().email(),
      })
      .validate(req.body);

    if (validator.error) {
      return res.status(400).json({ errors: validator.error.details });
    }
    const email = req.body.email;
    const user = await this.userService.isExists(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    try {
      const uuid = v4();
      this.forgetPasswordData[uuid] = {
        email: email,
        timestamp: Date.now(),
      };

      const token = sign({ uuid }, envConfig.SECRET_KEY, {
        expiresIn: "300s",
      });

      let info = await transport.sendMail({
        from: '"Support 👻" <support@cattlelog.com>',
        to: email,
        subject: "Change Password ✔",
        html: `<a href="${envConfig.API_GATEWAY}/changePassword?token=${token}">Click here to change your password</a>`,
      });

      if (info.rejected.includes(email)) {
        return res.status(400).json({ message: "Invalid Email" });
      }

      res.status(201).json({
        message: "Email sent !! kindly check inbox for password change",
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const token = req.body.token;
      const validator = JOI.object().keys({
        password: JOI.string().required().min(8),
        token: JOI.string().required(),
      }).validate(req.body);

      if (validator.error) {
        return res.status(400).json({ err: validator.error.message });
      }

      console.log(token);

      const { password } = req.body;
      let uuid = "";
      verify(token, envConfig.SECRET_KEY, (err: any, payload: any) => {
        if (err) {
          throw new JsonWebTokenError(err)
        }
        uuid = payload.uuid;
      });


      const data = this.forgetPasswordData[uuid];
      if (!data) {
        return res.status(400).json({ message: "link is expired, try again!" });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await this.userService.update(data.email, { password: hashPassword });
      if (!user) {
        return res.status(400).json({ message: "Password couldn't be updated, Please try again!" });
      }
      return res.status(200).json({ message: "Password Updated successfully" });
    } catch (err: any) {
      console.log(err.constructor.name);

      if (err instanceof JsonWebTokenError) {
        return res.status(400).json({ message: "Invalid Token" })
      }
      return res.status(500).json({ error: err.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.query.token?.toString() ?? "";
      const filepath = path.join(__dirname, "..", "..", "/templates/password.html");
      const data = await readFile(filepath, { encoding: "utf-8" });
      const newdata = data.replace("{{token}}", token);
      return res.send(newdata);
    } catch (error) {
      console.log(error);
    }
  }

  async update(req: Request, res: Response) {
    console.log(req.userId, "here");

    try {
      req.body = await uploadFile(req, "public/profileImg");
    } catch (error) {
      console.log({ error: error });
    }

    const validation = JOI.object()
      .keys({
        username: JOI.string().optional(),
        number: JOI.string().optional(),
        country: JOI.string().optional(),
        image: JOI.optional(),
      })
      .validate(req.body, { abortEarly: true });
    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const user: any = await this.userService.updateProfile(req.userId, req.body)
      if (!user) {
        return res.status(400).json({ message: "invalid User" });
      }

      return res.status(200).json({ message: "User updated!", user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
