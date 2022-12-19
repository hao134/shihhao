require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI).catch((err) => console.log(err));
console.log("Successfully connected to database");

//Define keeperSchema
const keeperSchema = {
  title: String,
  content: String,
};

const Keeper = mongoose.model("Keeper", keeperSchema);

app.post("/posts", (req, res) => {
  Keeper.create({
    title: req.body.title,
    content: req.body.content,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.get("/posts", (req, res) => {
  Keeper.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

app.delete("/delete/:id", (req, res) => {
  const deleteId = req.params.id;
  Keeper.findByIdAndDelete({ _id: deleteId })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 3001, function () {
  console.log("express server is running on port 3001");
});
