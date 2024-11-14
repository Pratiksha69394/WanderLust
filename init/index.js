const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderLust";
main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66ccaec07746a2b74ccdd104"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();