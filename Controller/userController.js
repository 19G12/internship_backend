import users from "../Schema/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.SECRET;

export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  const auth = JSON.stringify(req.headers);
  const foundUser = await users.findOne({ email: email });
  if (foundUser) {
    res.status(500).json({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = new users({
      name,
      email,
      password: hash,
    });
    const savedUser = await user.save();
    var token = jwt.sign(savedUser.toJSON(), privateKey);
    return res.status(200).json({ token, user: savedUser });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
console.log(req.body);
  const { email } = req.body;
  const {authorization} = req.headers;
  try {
    const foundUser = await users.findOne({ email: email });
    if (!foundUser) {
    console.log("No users found");
      res.status(500).json({ message: "No user found" });
    } else {
      console.log(foundUser);
      const bool = bcrypt.compare(foundUser.password, authorization);
      if (bool) {
        const token = jwt.sign(
          {
            name: foundUser.name,
            email: foundUser.email,
            _id: foundUser._id,
          },
          privateKey
        );
        res.status(200).json({
          message: "User successfully logged in",
          token,
        });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
