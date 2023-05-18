import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import JOI, { any, number, object } from "joi";
import { transport } from "../config/mail.config";
import { Request, Response } from "express";
import { ForgetPassword } from "../model";
import { envConfig } from "../config/envConfig";
import { UserService } from "../service";
import { error } from "../helpers/errorHelper";

export class AuthController {
  protected forgetPasswordData: ForgetPassword = {};

  async signUp(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    console.log("router", req.body);

    const validation = JOI.object()
      .keys({
        username: JOI.string().required().min(3),
        email: JOI.string().required().email(),
        password: JOI.string().required().min(8),
        country: JOI.string().required(),
        number: JOI.string().required(),
      })
      .validate(req.body, { abortEarly: false });

    validation.error?.details.forEach((element) => {
      console.log(element.message);
    });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const userService = new UserService();
      const { username, email, password, country, number } = req.body;

      const existingUser = await userService.isExists(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const existingNumber = await userService.isExists(number);
      if (existingNumber) {
        return res.status(400).json({ message: "Number Already In use" });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      req.body.password = hashPassword;
      const user = await userService.create(req.body);

      const token = sign({ email: user.email }, envConfig.SECRET_KEY, {
        expiresIn: "24h",
      });

      const info = await transport.sendMail({
        from: '"Support 👻" <support@cattlelog.com>',
        to: user.email,
        subject: "Verification ✔",
        html: `<a href="${envConfig.API_GATEWAY}/verify/${token}">Click here to verify</a>`,
      });

      if (info.rejected.includes(user.email)) {
        userService.delete(email);
        return res
          .status(400)
          .json({ message: "kindly check you provided valid email or not" });
      }

      return res.status(200).json({
        message: `Your account has been created successfully! \n Verification email sent to <b> ${user.email} </b>`,
        user,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    console.log(req.body);
    const validation = JOI.object()
      .keys({
        email: JOI.string().required().email(),
        password: JOI.string().required().min(8),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const { email, password } = req.body;
      const userService: UserService = new UserService();
      const user: any = await userService.get(req.body);

      if (!user) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      if (!user.isVerified) {
        return res.status(404).json({
          message: "Email not verified! You haven't verified your email.",
        });
      }

      const matchPassword = bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      const token = sign(
        { email: user.email, id: user.id },
        envConfig.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("authorization", token, {
        //  httpOnly: true,
        //  secure: true,
        //  sameSite: "strict"
      });

      user["country"] = user.Profile?.country;
      delete user.Profile;
      delete user.password;
      return res.status(200).json({
        message: "Successfuly Login ",
        user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      res.cookie("authorization", "null", { maxAge: 1 });
      res.status(200).json({ message: "Logout Successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
