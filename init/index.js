const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONG_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6637af950df677c72431520a",
    }));
    await Listing.insertMany(initData.data);

    console.log("DB SAVE on DATA");
  } catch (err) {
    console.log(err);
  }
};

initDB();
