const purifier = (data) => {

  let ans = JSON.parse(data);
  let temp = [];
  let output = [];
  

  temp.push(helper1(ans[0][0]));
  temp.push(helper2(ans[0][1]));
  
//   console.log(temp);
  
  output.push(temp);
  return output;
};

function helper1(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && prop == "X") {
        obj["X"] = { col_0: {} };
    }
    
    return obj;
  }
}

const helper2 = (arr) => {
  let ans = []; 
  for(let val in arr) {
    let temp = [];
    temp.push(arr[val][0]);
    ans.push(temp);
  }
  
  return ans;
}

module.exports = purifier;
