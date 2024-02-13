const express = require("express");
const multer = require("multer");
const path = require("path");
const xml2json = require("./utils/xml2json");
const XLSX = require("xlsx");
const purifier = require('./utils/purifier');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const fs = require("fs");

fs.mkdir(path.join(__dirname, "uploads"), () => {});
fs.mkdir(path.join(__dirname, "public"), () => {});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/bushchat", upload.array("files", 1), (req, res) => {
  let fileName = "./uploads/" + req.files[0].filename;

  let jsonData = fs.readFileSync(fileName, "utf-8");
  fs.writeFileSync("./public/output.json", JSON.stringify(purifier(jsonData)));

  for (let file of req.files) {
    fs.rm("./uploads/" + file.originalname, () => {});
  }
  res.render("download");
});

app.post("/upload", upload.array("files", 10), (req, res) => {
  let fileName = "./uploads/" + req.files[0].filename;

  if (req.body.check === "xml") {
    let xmlData = fs.readFileSync(fileName, "utf-8");
    fs.writeFileSync("./public/output.json", JSON.stringify(xml2json(xmlData)));
  } 
  else {
    let workbook = XLSX.readFile(fileName);
    let sheetsInExcel = workbook.Sheets;
    let data = "";

    let sheets = Object.keys(sheetsInExcel);

    sheets.forEach((key) => {
      let sheet = sheetsInExcel[key];
      let cells = Object.keys(sheet);
      let i = 1;
      cells.forEach((cell) => {
        if (cell[0] != "!") {
          let temp = cell.substring(1);
          if (temp != i) {
            data += "\n";
            i++;
          }
          data += sheet[cell]["v"] + ";";
        }
      });
    });

    fs.writeFileSync("./public/output.csv", data);
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

// listening on port 3000

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
