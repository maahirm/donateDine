//jshint esversion:6
//IMPORT  MODULES
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _=require("lodash");
const { time } = require("console");
const date = require(__dirname + "/date.js");
const app = express();
//USING MODULES
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-vidit:test123@cluster0.zugoove.mongodb.net/inventoryDB",{useNewUrlParser:true, useUnifiedTopology: true})


//Mongoose db
const inventorySchema = {
    foodName: String,
    foodQuantity: Number,
    foodPrice: Number
  };

  const MySchema = new mongoose.Schema({
    username: String,
    hashmapField: {
      type: Map,
      of: Number,
    },
  });

const userDonate = mongoose.model("userDonate",MySchema);
const fooditem = mongoose.model("fooditem",inventorySchema);



// "/" route get and post
app.get("/",function(req,res){
    res.render("home")
})

app.get("/inventory",function(req,res){
    // res.render("inventory",{fooditem:fooditem})
    fooditem.find({})
      .then((fooditems) => {
        res.render("inventory", {
          fooditems: fooditems,
        });
      })
      .catch((error) => {
        console.log(error);
      });
})



app.get("/donate", function(req, res) {
  let fooditems;
  let userDonates;

  Promise.all([
    fooditem.find({}),
    userDonate.find({})
  ])
  .then(([fooditemsarr, userDonatesarr]) => {
    fooditems = fooditemsarr;
    userDonates = userDonatesarr;

    res.render("donate", {
      fooditems: fooditems,
      userDonates: userDonates
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).send("Error retrieving data");
  });
});



app.post("/donate", function(req, res) {
  const UserName = req.body.Name;
  const hashmapString = req.body.hashmap;
  let mapping;

  if (hashmapString) {
    try {
      mapping = JSON.parse(hashmapString);
    } catch (error) {
      console.log("Error parsing hashmap JSON:", error);
      return res.status(400).send("Invalid hashmap data");
    }
  }

  const user = new userDonate({
    username:UserName,
    hashmapField:mapping
  });
  user.save()
  for (let key in mapping) {
    // console.log(mapping[key]);
    let newQuantity;
    fooditem.findOne({ foodName: key })
      .then(item => {
        newQuantity = item.foodQuantity - mapping[key];
        // console.log(newQuantity);
  
        return fooditem.findOneAndUpdate(
          { foodName: key },
          { $set: { foodQuantity: newQuantity } },
          { new: true }
        );
      })
  }
  res.render("orderplaced",{mapping:mapping,UserName:UserName});
  
  
});



app.get("/contact",function(req,res){
  res.render("contact")  
})
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const newContact = new Contact({
    name,
    email,
    message
  });

  newContact.save()
  res.redirect("/")
});
app.get("/addInventory",function(req,res){
  res.render("addInventory.ejs")
})
app.post("/addInventory",function(req,res){
  const foodName = req.body.foodName;
  const foodQuantity = req.body.foodQuantity;
  const foodPrice = req.body.foodPrice;

  const foodItem = new fooditem({
    foodName,
    foodQuantity,
    foodPrice
    });
    foodItem.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
      });
})


app.post("/",function(req,res){

})









const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});