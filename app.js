const express = require("express");
const multer = require("multer");

const path = require("path");
const AutoSheet = require("auto-sheet");
const xml2json = require("./utils/xml2json");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, './uploads');
  },
  filename: function (req, file, callback) {
      callback(null, file.originalname);
  }
});

const upload = multer({
  storage : storage
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const fs = require("fs");

fs.mkdir(path.join(__dirname, "uploads"), () => {});
fs.mkdir(path.join(__dirname, "public"), () => {});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.array("files", 10), (req, res) => {

  // let fileName = './uploads/' + req.files[0].filename;
  let fileName = "./uploads/" + "sample.xml";

  if (req.body.check === "xml") {
    let xmlData = fs.readFileSync(fileName, "utf-8");
    fs.writeFileSync("./public/output.json", JSON.stringify(xml2json(xmlData)));
  } else {
    AutoSheet.run({
      fromFile: fileName,
      toFile: "./public/Output.csv",
    });
  }

  for (let file of req.files) {
    fs.rm("./uploads/" + file.originalname, () => {});
  }

  res.render("download");
});

app.get("/download", (req, res) => {
  let fPath = fs.readdirSync(__dirname + "/public");
  res.download(path.join(__dirname + "/public/", fPath[0]), () => {
    fs.rm(`./public/${fPath[0]}`, () => {});
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
