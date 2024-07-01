import express from "express";
import { Login, Register } from "../Controller/userController.js";

const auths = express();

auths.route("/auth").post(Register);
auths.route("/login").post(Login);

export default auths;
