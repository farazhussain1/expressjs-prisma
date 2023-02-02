import mongoose, { set } from "mongoose";
import config from "./envConfig";

set('strictQuery', false);

mongoose.connect(config.DB_CONNECTION_STRING, (err) => {
  if (err) {
    console.log(err.message);
  }
  // connection.once("open", () => console.log("Connected"));
  console.log("connected")
});

export default mongoose;