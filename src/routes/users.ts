import express from "express";
import User from "../models/User";
import CryptoJS from "crypto-js";
import verify from "../verifyToken";
const router = express.Router();

const SECRET_KEY: string = process.env.SECRET_KEY as string;
router.put("/:id", verify, async (req: any, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can only update your account");
  }
});

router.delete("/:id", verify, async (req: any, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can only delete your account");
  }
});
router.get("/find/:id", async (req: any, res) => {
  try {
    const user: any = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/", verify, async (req: any, res) => {
  const query = req.query.new;
  if (req.user.isAdmin as any) {
    try {
      const users = query
        ? await User.find().sort({ id: -1 }).limit(10)
        : await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not authorized...");
  }
});

router.get("/stats", async (req: any, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear(2021) - 1);
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
