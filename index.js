
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const spawn = require("child_process").spawn;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = 3000;

app.get("/", (req, res) => {
  //   res.send("Hello Parth");
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;

  const question = query.question;


  const childPython = spawn("python", ["./GenerateTopQuestions.py", question]);
  childPython.stdout.on("data", function (data) {


    var data_str = data.toString();
    var arr = data_str.split("'], ['");

    // console.log(arr.length);
    var l = arr.length;

    arr[0] = arr[0].slice(3);
    // console.log(arr[0]);

    arr[l - 1] = arr[l - 1].slice(0, -5);
    // console.log(arr[l - 1]);

    var str_arr = [];

    for (let i = 0; i < l; i++) {
      let arr_next_split = [];
      arr_next_split = arr[i].split("', '");
      str_arr.push(arr_next_split);
    }
    // console.log(str_arr);
    // arr = []

    // for(let i=0;i<length(data_str)

    res.json(str_arr);
  });
  childPython.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });


});

app.listen(3000, () => {
  console.log("Listening on port no. " + PORT);
});