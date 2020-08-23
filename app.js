const express = require("express");
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

console.log(date);
const app = express();
let tasks = ["Learn EJS", "Create a project", "Find an intership"];
let workTasks = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  let day = date.getDate();

  res.render("list", {
    listTitle: day,
    newListTask: tasks
  });
});
app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work",
    newListTask: workTasks
  });
});

app.post("/", function(req, res) {
  let task = req.body.newTask;

  if (req.body.list === "Work") {
    workTasks.push(task);
    res.redirect("/work");
  } else {
    tasks.push(task);
    res.redirect("/");
  }

});
app.get("/about", function(req, res) {
  res.render("about");
});
//OR WE CAN USE res.sendFile() to send a  html file; res.sendFile(__dirname + "/index.html")

// That means render a file called list which we will pass that file a variable named kindOfDay and the value is gonna equal to day
// This res.render() is a response, instead of res.send();

app.listen(process.env.PORT || 3000, () => console.log("Server listening on port 3000"));
