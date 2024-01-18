const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const fs = require("fs");

const xml2json = (data) => {
  let ans;
  parser.parseString(data, function (err, result) {
    if (!err) {
      ans = result;
    }
  });

  let output = walk(ans);

  return output;
};

const walk = (obj) => {
  let output = {};
  let value = obj;

  if (fs.existsSync('./uploads/' + value)) {
    let xmlData = fs.readFileSync('./uploads/' + value, "utf-8");
    return xml2json(xmlData);
  } 

  if(typeof obj === 'string') return obj;

  for (let key in obj) {
    if (typeof obj[key] === "object") {
      output[key] = walk(obj[key]);
    } else if (Array.isArray(obj)) {

      if(obj.length == 1) return obj[0];
      output = [];
      obj.forEach((item) => {
        output.push(walk(item));
      });
    }
  }

  return output;
};

module.exports = xml2json;
