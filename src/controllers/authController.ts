import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import JOI, { object } from "joi";
import { transport } from "../config/mail.config";
import { Request, Response } from "express";
import { ForgetPassword } from "../model";
import { envConfig } from "../config/envConfig";
import { UserService } from "../service";
import { error } from "../helpers/errorHelper";


export class AuthController {
  protected forgetPasswordData: ForgetPassword = {};

  async signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {

    const validation = JOI.object().keys({
      username: JOI.string().required().min(3),
      email: JOI.string().required().email(),
      password: JOI.string().required().min(8),
      country: JOI.string().required()
    }).validate(req.body, { abortEarly: false });

    validation.error?.details.forEach(element => {
      console.log(element.message);
    })

    if (validation.error) {
      return error("validationError", validation, res)
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
      const user = await userService.create(req.body)

      const userObj = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "country": req.body.country,
        "is_verified": user.isVerified,
        "created_at": user.created_at,
        "updated_at": user.updated_at
      }

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
        userService.delete(email)
        return res.status(400).json({ message: "kindly check you provided valid email or not" });
      }

      return res.status(200).json({
        message: `Your account has been created successfully! \n Verification email sent to <b> ${user.email} </b>`,
        user: userObj,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    const validation = JOI.object().keys({
      email: JOI.string().required().email(),
      password: JOI.string().required().min(8)
    }).validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res)
    }

    try {
      const { email, password } = req.body;
      const userService: UserService = new UserService()
      const user = await userService.get(req.body)

      if (!user) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      if (!user.isVerified) {
        return res.status(404).json({ message: "Email not verified! You haven't verified your email." });
      }

      const matchPassword = bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      const token = sign({ email: user.email, id: user.id }, envConfig.SECRET_KEY, {
        expiresIn: "24h",
      });

      const userObj = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "country": user.Profile?.country,
        "is_verified": user.isVerified,
        "created_at": user.created_at,
        "updated_at": user.updated_at
      }

      res.cookie("authorization", token, {
        //  httpOnly: true, 
        //  secure: true, 
        //  sameSite: "strict" 
      });

      return res.status(200).json({
        message: "Successfuly Login ",
        user: userObj,
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
