import express from "express";
import cors from "cors";
import Mongo from "./Database/mongoose.js";
import auths from "./Router/userRoute.js";
import Data from "./Router/sampleRoute.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("./public"));

Mongo();

app.use("/", auths);
app.use("/form", Data);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
