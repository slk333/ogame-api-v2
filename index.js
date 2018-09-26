var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/main", {
  useNewUrlParser: true
})
var request = require("request")
var parseString = require('xml2js').parseString;

var playerSchema = new mongoose.Schema({
  playerId: Number,
  name: String,
  alliance: String,

})

var Player = mongoose.model("Player", playerSchema)
Player.deleteMany({}, function(error) {})


function clearAndUpdateDatabase() {
  // The function returns the product of p1 and p2

  var playersArray = [{}];
  request('https://s153-fr.ogame.gameforge.com/api/players.xml', function(error, response, body) {
    //  console.log(error);  
    //  console.log(response)  
    //  console.log(response.statusCode)
    //  console.log(body);


    parseString(body, function(err, result) {
      var players = result["players"]["player"]
      players.forEach(function(player) {
        playersArray.push({
          playerId: player["$"]["id"],
          name: player["$"]["name"]
        })
      })
      Player.create(playersArray, function(error) {
        Player.find({}, function(error, player) {
          if (error) {
            console.log("error retrieving player")
            console.log(error)
          } else {
            console.log(player)
          }
        })
      })
    });
  });
}




/*
var panthere = new Player({
  name:"Marshall",
  alliance:"FURY",
  rank:"1"
  
})
*/

/*
panthere.save(function(error,player){
if (error){
console.log("was not able to save")
console.log(error)
} else{
console.log("saved the new player into the database!")
}

})
*/

/* 

var array = [{name:"Panthère"}];
var i;
for (i = 1; i < 10; i++) { 
    array.push({
      rank:(Math.floor(Math.random() * 10000))
    });
}
Player.deleteMany({},function(error){})

Player.create(array,function(error){
  
  Player.find({},function(error,player){
if(error){
console.log("error retrieving player")
console.log(error)
}
else{
console.log(player)
}
})
  
})
*/




app.get('/', function(req, res) {
  res.send('Is this thing on?');
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});