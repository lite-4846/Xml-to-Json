const express = require("express");
const app = express();
const multer = require("multer")
const upload = multer({ dest: "uploads/" });
const path = require('path');
const AutoSheet = require('auto-sheet')

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

app.post('/uploadxls', upload.single('xls'), (req, res) => {

  let fileName = './uploads/' + req.file.filename;
  
  
  AutoSheet.run({
    fromFile: fileName,
    toFile: './public/Output.csv'
  })

  fs.rm(fileName, () => {})

  res.render('downloadxl');

})

app.post("/upload", upload.array('files', 2), async (req, res) => {

  let fileName = './uploads/' + req.files[0].filename;
  if(req.body.check === 'xml') {
    let xmlData = fs.readFileSync(fileName, 'utf-8');
    parser.parseString(xmlData, function (err, result) {
      if(!err) {
        fs.writeFileSync("./public/Output.json", JSON.stringify(result));
      }
    });
  }
  else {
    AutoSheet.run({
      fromFile: fileName,
      toFile: './public/Output.csv'
    })
  }

  fs.rm(fileName, () => {});

  res.render('download');
});

app.get('/download', (req, res) => {

  let fPath = fs.readdirSync(__dirname + '/public');
  res.download(path.join(__dirname + '/public/', fPath[0]), () => {
    fs.rm(`./public/${fPath[0]}`, () => {})
  });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
