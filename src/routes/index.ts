import express from 'express';
import {AuthController} from '../controllers/authController';
import {UserController} from '../controllers/userController';
import { UserService } from '../service';

export const userRouter = express.Router();

const auth = new AuthController()
const user= new UserController()

userRouter.post("/register", auth.signUp.bind(auth));

userRouter.post("/login", auth.signIn);

userRouter.post("/logout",  auth.signOut);

userRouter.get("/verify/:id", user.verifyEmail.bind(user) );

userRouter.post("/forgotPassword", user.forgotPassword.bind(user) );

userRouter.post("/changePassword/:token", user.changePassword.bind(user) );

