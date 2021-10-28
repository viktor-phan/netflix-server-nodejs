import express from "express";
import Movie from "../models/Movie";
import verify from "../verifyToken";
const router = express.Router();

const SECRET_KEY: string = process.env.SECRET_KEY as string;

router.post("/", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.put("/:id", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(201).json(updatedMovie);
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
      await Movie.findByIdAndDelete(req.params.id);
      res.status(201).json("Movie has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.get("/find/:id", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      const movie = await Movie.findById(req.params.id);
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.get("/random", verify, async (req: any, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type == "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/', verify, async(req:any,res)=>{
    if(req.user.isAdmin){
        try {
            const movies = await Movie.find()
            res.status(200).json(movies.reverse())
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You are not authorized...")
    }
})

export default router;
