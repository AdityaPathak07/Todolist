const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
//To add module
//To add styles.css folder
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
//To add ejs template, folder name views has ejs files
app.set("view engine", "ejs");


mongoose.connect("mongodb+srv://admin-Aditya:aditya0710@cluster0.xesbt.mongodb.net/todolistDB", {
useUnifiedTopology: true,
useNewUrlParser: true,
});
//Item Schema
const itemSchema = {
  name: String
};

const Items = mongoose.model("item", itemSchema);

const item1 = new Items({
  name: "To Make Money"
});
const item2 = new Items({
  name: "To Travel World"
});
const item3 = new Items({
  name: "To invest in Stocks"
});

const defaultItems = [item1, item2, item3];

//New Schema

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("list", listSchema);

app.get("/", function(req,res){
//to render ejs file
Items.find({}, function(err, foundItems){
  if (foundItems == 0)
  {
    Items.insertMany(defaultItems, function(err){
      if (err)
      console.log(err);
      else
      console.log("Successfully Inserted Items");
    });
    res.redirect("/");
  }
  else{
    res.render("list",{listTitle: "Today", newListItems: foundItems});
  }
 });
});

 app.post("/", function(req,res){

   const itemName = req.body.newitem;
    const listName = req.body.list;

   const newItem = new Items({
     name: itemName
   });

  if(listName === "Today"){
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundItems){
        foundItems.items.push(newItem);
        foundItems.save();
        res.redirect("/" + listName);
    });
  }

});

//TO delete

app.post("/delete", function(req,res){
  const checkedItems = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Items.findByIdAndRemove(checkedItems, function(err){
      if(!err){
        res.redirect("/");
          console.log("Successfully Deleted Checked Items");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItems
    }}}, function(err, foundItems){
      if(!err)
      res.redirect("/" + listName);
    })
  };
});

//Custom List
app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
List.findOne({name: customListName}, function(err, foundItems){
  if (!err){
    if (!foundItems){
      //Create a new List
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    }
    else{
    //Show an existing list
   res.render("list", {listTitle: foundItems.name, newListItems: foundItems.items});
    }
  }
});
});

app.post("/work", function(req,res){
  let work = req.body.newitem;
  workItems.push(work);
  res.redirect("/work");
})
//ABOUT

app.get('/favicon.ico', (req, res) => res.status(204).end());


app.listen(process.env.PORT || 3000, function(){
  console.log("Port 3000 is running");
})
