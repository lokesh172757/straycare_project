// connect with server
const express = require("express");
const app = express();
const port = 8080;
app.listen(port, () => {
    console.log("server started");

});

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

const path = require("path");
// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));


collections.User.find().then((data) => {
    console.log(data);
});




