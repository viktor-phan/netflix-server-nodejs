import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

import User from "../models/User";
import { format } from "path/posix";

const SECRET_KEY: string = process.env.SECRET_KEY as string;
router.get("/", (req, res) => {
  res.json("Auth routes");
});
//REGISTER
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString(),
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user: any = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong password or username");

    const pass = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
    const originalPassword = pass.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password &&
      res.status(401).json("Wrong password or username");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
