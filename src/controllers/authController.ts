import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import JOI from "joi";
import { transport } from "../config/mail.config";
import { Request, Response } from "express";
import { ForgetPassword } from "../model";
import { config } from "../config/envConfig";
import { UserService } from "../service";


export class AuthController {
  protected forgetPasswordData: ForgetPassword = {};

  async signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {

    const validation = JOI.object().keys({
      username: JOI.string().required().min(3),
      email: JOI.string().required().email(),
      password: JOI.string().required().min(8),
      profile: JOI.object({
        address: JOI.object({
          country: JOI.string().required()
        }).required()
      }).required()
    }).validate(req.body, { abortEarly: true });

    if (validation.error) {
      return res.status(400).json({ errors: validation.error.details });
    }

    try {
      const userService = new UserService()
      const { username, email, password, country } = req.body;

      const existingUser = await userService.isExists(email)
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      req.body.password = hashPassword;
      const userObj: any = await userService.create(req.body)
      const user = { ...userObj._doc };
      delete user.password;

      const info = await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: user.email,
        subject: "Verification ✔",
        html: `<a href="http://localhost:4000/verify/${user._id}">Click here to verify</a>`,
      });

      if (info.rejected.includes(user.email)) {
        userObj.delete()
        return res.status(400).json({ message: "kindly check you provided valid email or not" });
      }

      return res.status(200).json({
        message: `Your account has been created successfully! \n Verification email sent to <b> ${user.email} </b>`,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(req.body);

    try {
      const userService: UserService = new UserService()
      const user: any = await userService.get({ email })
      console.log(user);

      if (!user) {
        return res.status(400).json({ message: "Invalid Email/Password" });
      }

      if (!user.isVerified) {
        return res.status(404).json({
          message:
            "Email not verified !! You haven't verified your email plz do that first",
        });
      }

      const matchPassword = bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid Email/Password" });
      }

      //TOKEN GENERATED
      const token = sign({ email: user.email, id: user._id }, config.SECRET_KEY, {
        expiresIn: "24h",
      });

      const userObj = { ...user._doc };
      delete userObj.password;

      res.cookie("authorization", token, {
        // httpOnly: true,
        // secure: true,
        // sameSite: "strict",
      });
      return res.status(200).json({
        message: "Successfuly Login ",
        user: userObj,
      });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      res.cookie("authorization", "null", { maxAge: 1 });
      res.status(200).json({ message: "Logout Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "something happened" });
    }
  }

}
