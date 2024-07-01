import mongoose from "mongoose";

const Mongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error);
  }
};

export default Mongo;
