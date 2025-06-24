//connect with database
const mongoose = require("mongoose");
main().then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/straycare");
}
// requiring models
const collections = require("./schemas");

const sample = new collections.User({
    name: "lokesh",
    phone: "9548172757",
    email: "lokeshthakur8954@gmail.com",
    password: "Lokesh@2588",
    role: "admin",
    preferredLang: "english",
    phoneOtp: "000",
    bio: "hi",
    address: "aligarh",
    location: {
        type: "Point",
        coordinates: [77.1025, 28.7041] // Delhi [lng, lat]
    }
});

sample.save().then((data) => {
    console.log(data);
});