const express = require("express");
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//const url = "mongodb+srv://Constantin:123456@cluster0.ehls6.mongodb.net/todoListDB?retryWrites=true&w=majority"; URL vechi
const tasks = [];

//const client = new MongoClient(uri,{ useUnifiedTopology: true } );
try {
  mongoose.connect("mongodb+srv://Constantin:Test123@cluster0.ehls6.mongodb.net/todoListDB?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, () => {
    console.log(tasks + "Beginning");
    //asd
    mongoose.connection.on('connected', () => {
      console.log("Connected Succesfully");
    })

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

    const listSchema = {
      name: String,
      items: [itemsSchema]
    }
    const List = mongoose.model("List", listSchema);


    app.get("/", function(req, res) { //Se apelează la accesarea calei "/"

      Item.find({}, function(err, foundItems) { //Funcție de căutare în colecție
        if (foundItems.length === 0) { //foundItems => Obiectele găsite
          //Dacă baza noastră de date este goală
          Item.insertMany(defaultTasks, (err) => { // Se introduc itemurile diin defaultTasks
            if (err) console.log(err);
            else console.log("Succesfully added defaultTasks to DB");
          });
          res.redirect("/");
        } else { //Altfel, se introduc itemurile găsite
          res.render("list", {
            listTitle: "Today",
            newListTask: foundItems
          });
        }


      });
    });

    app.get("/:customListName", (req, res) => {
      const customListName = _.capitalize(req.params.customListName);
      List.findOne({
        name: customListName
      }, (err, foundList) => {
        if (!err) {
          if (!foundList) { //if foundList is empty create a new List
            const list = new List({
              name: customListName,
              items: defaultTasks
            });
            list.save();
            res.redirect("/" + customListName);
          } else {

            res.render("list", {
              listTitle: foundList.name,
              newListTask: foundList.items
            })
          }
        }

      });
    });

    app.post("/", function(req, res) {
      const taskName = req.body.newTask; //Denumirea task-ului
      const listName = _.capitalize(req.body.list); //Denumirea listei din care face parte
      const task = new Item({
        name: taskName  //Crearea de item nou
      });
      if (listName === "Today") { //Dacă este lista default ->
        task.save(function(err) { //Se salvează in lista de bază
          if (err) console.log(err);
          else console.log("Succesfully saved task to db");
        });
        res.redirect("/");
      } else { //Altfel, introducem în lista corespunzătoare
        List.findOne({ //Funcție de căutare în colecție
          name: listName // Selectează lista cu numele listName
        }, (err, foundList) => {
          foundList.items.push(task); //Introduce în lista selectată
          foundList.save(); //Salvează lista;
          res.redirect("/" + listName); //Redirectionare la pagina corespunzătoare
        })
      }
    });

    app.post("/delete", (req, res) => {
      const checkedItemId = req.body.checkbox; //Stocăm ID-ul elementului ce vrem să fie șters
      const listName = _.capitalize(req.body.listName); //Funcție ce transformă string-ul în string cu prima literă majusculă
      if (listName === "Today") { // Verificăm dacă item este în lista de bază
        Item.findByIdAndRemove({ // Funcție de găsire a obiectului după ID și ulterioara ștergere
          _id: checkedItemId
        }, (err) => {
          if (err) console.log(err);
          else console.log("Succesfully deleted the item with ID :" + checkedItemId);
        });
        res.redirect("/");
      } else {
        List.findOneAndUpdate({ // Dacă nu, căutăm obiectul în lista cu numele corespunzător
          name: listName
        }, {
          $pull: { //Funcție de extragere(ștergere) a obiectului căutat
            items: {
              _id: checkedItemId
            }
          }
        }, (err, foundList) => { // Acesta este callback-ul funcției, obligator
          if (!err) {
            res.redirect("/" + listName);
          }
        })}
    });

    app.get("/about", function(req, res) {
      res.render("about");
    });
  })
} catch (error) {
  console.log("Could not connect");
}

//OR WE CAN USE res.sendFile() to send a  html file; res.sendFile(__dirname + "/index.html")

// That means render a file called list which we will pass that file a variable named kindOfDay and the value is gonna equal to day
// This res.render() is a response, instead of res.send();

app.listen(process.env.PORT || 3000, () => console.log("Server listening on port 3000"));
