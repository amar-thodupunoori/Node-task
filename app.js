//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UsersDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phno: String
});

const User = mongoose.model("User", userSchema);

///////////////////////////////////Requests Targetting all Users////////////////////////

app.route("/users")

.get(function(req, res){
  User.find(function(err, foundUsers){
    if (!err) {
      res.send(foundUsers);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newUser = new User({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    phno: req.body.phno
  });
  newUser.save(function(err){
    if (!err){
      res.send("Successfully added a new User.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  User.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all users.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific User////////////////////////

app.route("/users/:userName")

.get(function(req, res){

  User.findOne({name: req.params.userName}, function(err, foundUser){
    if (foundUser) {
      res.send(foundUser);
    } else {
      res.send("No users matching that name was found.");
    }
  });
})

.put(function(req, res){
  User.findOne({name: req.params.userName}, function(err, foundUser){
    if (foundUser) {
      User.findByIdAndUpdate(foundUser._id,{name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phno: req.body.phno},function(err){
          if(err){
            res.send(err);
          }else{
            res.send("Successfully edited the user.");
          }
        });
    } else {
      res.send("No users matching that name was found.");
    }
  });
})
.delete(function(req, res){
  // var name = req.params.userName;
  // var id1;
  // console.log(name);
  User.findOne({name: req.params.userName}, function(err, foundUser){
    if (foundUser) {
      // console.log(foundUser.id);
      // res.send(foundUser);
      // id1 = ;
      User.findByIdAndRemove(foundUser._id, function (err, docs) {
        // console.log(foundUser._id);
        if (err){
            res.send(err)
        }
        else{
            res.send("Successfully deleted the user.");
        }
    });
      // console.log(id1);
    } else {
      res.send("No users matching that name was found.");
    }
  }); 
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
