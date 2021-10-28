import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { ConnectionOptions } from "tls";
import dotenv from "dotenv";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config({ path: "../.env" });
const PORT = process.env.PORT || 8800;

mongoose
  .connect("mongodb://localhost:27017/netflix", {
    useNewURLParser: true,
    useUnifiedTopology: true,
  } as ConnectionOptions)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));
import authRoute from "./routes/auth";
import userRoute from "./routes/users";
import movieRoute from "./routes/movie";
import listRoute from './routes/lists'
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use('/api/lists/', listRoute)
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
