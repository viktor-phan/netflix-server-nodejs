import express from "express";
import List from "../models/List";
import verify from "../verifyToken";
const router = express.Router();

const SECRET_KEY: string = process.env.SECRET_KEY as string;

router.post("/", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const saveList = await newList.save();
      res.status(201).json(saveList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.delete("/:id", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("List has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

router.get("/", verify, async (req: any, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;

  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          {
            $match: { type: typeQuery, genre: genreQuery },
          },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          {
            $match: { type: typeQuery },
          },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
