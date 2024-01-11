const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer")
const upload = multer({ dest: "uploads/" });
const path = require('path');

app.use(bodyParser.json());
bodyParser.urlencoded({extended: true})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

const fs = require("fs");
const xml2js = require("xml2js");

fs.mkdir(path.join(__dirname, 'uploads'), () => {});
fs.mkdir(path.join(__dirname, 'public'), () => {});

const parser = new xml2js.Parser();

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/upload", upload.single('Xmlfile'), async (req, res) => {

  let fileName = './uploads/' + req.file.filename;
  let xmlData = fs.readFileSync(fileName, 'utf-8');

  parser.parseString(xmlData, function (err, result) {
    if(!err) {
      fs.writeFileSync("./public/Output.json", JSON.stringify(result));
    }
  });

  fs.rm(fileName, () => {});

  res.render('download');
});

app.get('/download', (req, res) => {
  let filePath = path.join(__dirname + '/public/Output.json');
  res.download(filePath, () => {
    fs.rm('./public/Output.json', () => {});
  });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
