import sample from "../Schema/sample.js";
import moment from "moment";
import lds from "lodash";

// Change just the input data set
// same average works for the array of objects as well

export const getSamples = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const m_name = lds.lowerCase(lds.trim(name, " "));
  const s_name = lds.capitalize(name);
  console.log(m_name, "_fromBackend_");
  try {
    const averageSample = await sample.aggregate([
      {
        $match: {
          _name: m_name,
          createdAt: {
            $gte: moment(startDate).startOf("day").format(),
          },
          updatedAt: {
            $lte: moment(endDate).endOf("day").format(),
          },
        },
      },
      { $unwind: "$body" },
      {
        $group: {
          _id: "$createdAt",
          Aroma: { $avg: "$body.Aroma" },
          Flavour: { $avg: "$body.Flavour" },
          Taste: { $avg: "$body.Taste" },
          Texture: { $avg: "$body.Texture" },
          Aftertaste: { $avg: "$body.Aftertaste" },
          Overall: { $avg: "$body.Overall" },
        },
      },
    ]);
    if (averageSample) {
      // res.status(200).json({ body: averageSample, name: name });
      res.status(200).json({ body: averageSample, name: s_name });
    } else {
      res.status(404).json({ message: "No such samples found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const addSamples = async (req, res) => {
  const { body, _name } = req.body;
  const name = lds.lowerCase(_name);
  // console.log(body, name, "_backend_");
  // console.log(moment(updatedAt).startOf("day").format());
  const filter = {
    _name: name,
    createdAt: {
      $gte: moment().startOf("day").format(),
    },
    updatedAt: {
      $lte: moment().endOf("day").format(),
    },
  };
  try {
    // const foundSample = await sample.findOne(filter);

    // console.log(foundSample);
    await sample
      .findOneAndUpdate(
        filter,
        { $addToSet: { body: body } },
        { $set: { updatedAt: moment().format() } },
        { new: true }
      )
      .then(async (doc) => {
        if (doc) {
          res.status(200).json({ message: "Updated succesfully" });
        } else {
          //   console.log("I came till here");

          const inSample = new sample({
            body,
            _name: name,
            createdAt: moment().format(),
            updatedAt: moment().format(),
          });
          await inSample.save();

          res.status(200).json({ message: "Added successfully" });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

export const exportSamples = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const m_name = lds.lowerCase(lds.trim(name, " "));
  const foundSamples = await sample.findOne({
    _name: m_name,
    createdAt: {
      $gte: moment(startDate).startOf("day").format(),
    },
    updatedAt: {
      $lte: moment(endDate).endOf("day").format(),
    },
  });

  if (foundSamples) {
    res.status(200).json(foundSamples.body);
  } else {
    res.status(500).json({ message: "Unexpected error occured" });
  }
};
