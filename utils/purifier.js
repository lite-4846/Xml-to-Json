const purifier = (data) => {

  let ans = JSON.parse(data);
  let temp = [];
  let output = [];

  temp.push(helper(ans[0][0]));
  temp.push(helper(ans[0][1]));
  
  console.log(temp);
  
  output.push(temp);
  return output;
};

function helper(obj) {
  if (typeof obj == "object") {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && prop == "X") {
        obj["X"] = { col_0: {} };
      }
    }
    return obj;
  }
  let ans = [];
  for (let val in obj) {
    ans.push(val[0]);
  }
  return ans;
}

module.exports = purifier;
