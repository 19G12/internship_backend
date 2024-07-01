import express from "express";
import {
  addSamples,
  exportSamples,
  getSamples,
} from "../Controller/sampleController.js";

const Data = express();

Data.route("/dashboard").post(addSamples);
Data.route("/data").post(getSamples);
Data.route("/excel").post(exportSamples);

export default Data;
