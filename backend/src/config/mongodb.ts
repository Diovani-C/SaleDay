import mongoose from "mongoose";

export default function createDatabaseConnection(connectionUrl: string) {
  try {
    console.log("[mongoose] starting database connection...");
    mongoose.connect(connectionUrl);

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "[mongoose] connection error:"));
    db.once("open", function () {
      console.log("[mongoose] connected successfully!");
    });
    return db;
  } catch (err) {
    console.error("[mongoose] error:" + err);
  }
}
