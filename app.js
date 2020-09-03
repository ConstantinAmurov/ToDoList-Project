const express = require("express");
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const url = "mongodb://localhost:27017/todoListDB";
//const client = new MongoClient(uri,{ useUnifiedTopology: true } );
try {
  mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, () => {

    const itemsSchema = {
      name: String
    };
    const Item = mongoose.model("Item", itemsSchema);


    const task_1 = new Item({
      name: "Welcome to your To Do List"
    });
    const task_2 = new Item({
      name: "Hit the + button to add a new task"
    });
    const task_3 = new Item({
      name: " <---- Hit this to delete a task"
    });
    const defaultTasks = [task_1, task_2, task_3];
    Item.insertMany(defaultTasks, (err) => {
      if (err) console.log(err);
      else console.log("Succesfully added defaultTasks to DB");
    }
    );

  });


} catch (error) {
  console.log("Could not connect");
}

app.get("/", function(req, res) {

  let day = date.getDate();

  res.render("list", {
    listTitle: "Today",
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
