var http = require('http')
var config = require('config')
var secret = require('secret')
var console = require('console')
var apikey = secret.get('key')
//apikey=gNbkS6mK8tgZFYCZVku03ELcRHO2
module.exports.function = function findPlayer (PlayerName) {
  var options = {format: 'json'};
  var response = http.getUrl(config.get('url') + '/playerFinder?name='+PlayerName+'&apikey=' + apikey, options)["data"];
  var length=response.length;
  if (length==0){
    return []
  }
  var playerdetails=[]; 
  
  for (let i = 0; i < length; i++){
    var item = response[i];
    var pid = String(item["pid"]);
    var response1 = http.getUrl(config.get('url')+'/playerStats?pid='+pid+'&apikey='+apikey,options);
    var T20bowl={};
    var ODIbowl={};
    var Testbowl={};
    var T20bat={};
    var ODIbat={};
    var Testbat={};
    if("bowling" in response1["data"]){
      if("T20Is" in response1["data"]["bowling"]){
        var T20bowl={
          "FiveW": response1["data"]["bowling"]["T20Is"]["5w"],
          "FourW": response1["data"]["bowling"]["T20Is"]["4w"],
          "SR": response1["data"]["bowling"]["T20Is"]["SR"],
          "Econ": response1["data"]["bowling"]["T20Is"]["Econ"],
          "Ave": response1["data"]["bowling"]["T20Is"]["Ave"],
          "Wkts": response1["data"]["bowling"]["T20Is"]["Wkts"],
          "Runs":response1["data"]["bowling"]["T20Is"]["Runs"],
          "Balls": response1["data"]["bowling"]["T20Is"]["Balls"],
          "Mat": response1["data"]["bowling"]["T20Is"]["Mat"],
        };
      }
      if("ODIs" in response1["data"]["bowling"]){
        var ODIbowl={
          "FiveW": response1["data"]["bowling"]["ODIs"]["5w"],
          "FourW": response1["data"]["bowling"]["ODIs"]["4w"],
          "SR": response1["data"]["bowling"]["ODIs"]["SR"],
          "Econ": response1["data"]["bowling"]["ODIs"]["Econ"],
          "Ave": response1["data"]["bowling"]["ODIs"]["Ave"],
          "Wkts": response1["data"]["bowling"]["ODIs"]["Wkts"],
          "Runs":response1["data"]["bowling"]["ODIs"]["Runs"],
          "Balls": response1["data"]["bowling"]["ODIs"]["Balls"],
          "Mat": response1["data"]["bowling"]["ODIs"]["Mat"],
        };
      }
      if("tests" in response1["data"]["bowling"]){
        var Testbowl={
          "FiveW": response1["data"]["bowling"]["tests"]["5w"],
          "FourW": response1["data"]["bowling"]["tests"]["4w"],
          "SR": response1["data"]["bowling"]["tests"]["SR"],
          "Econ": response1["data"]["bowling"]["tests"]["Econ"],
          "Ave": response1["data"]["bowling"]["tests"]["Ave"],
          "Wkts": response1["data"]["bowling"]["tests"]["Wkts"],
          "Runs":response1["data"]["bowling"]["tests"]["Runs"],
          "Balls": response1["data"]["bowling"]["tests"]["Balls"],
          "Mat": response1["data"]["bowling"]["tests"]["Mat"],
        };
      }
    }
     if("batting" in response1["data"]){
      if("T20Is" in response1["data"]["batting"]){
        var T20bat={
          "Fifties": response1["data"]["batting"]["T20Is"]["50"],
          "Hundreds": response1["data"]["batting"]["T20Is"]["100"],
          "Sixes": response1["data"]["batting"]["T20Is"]["6s"],
          "Fours": response1["data"]["batting"]["T20Is"]["4s"],
          "SR": response1["data"]["batting"]["T20Is"]["SR"],
          "Ave": response1["data"]["batting"]["T20Is"]["Ave"],
          "HS": response1["data"]["batting"]["T20Is"]["HS"],
          "Runs":response1["data"]["batting"]["T20Is"]["Runs"],
          "NO": response1["data"]["batting"]["T20Is"]["NO"],
          "Mat": response1["data"]["batting"]["T20Is"]["Mat"],
        };
      }
      if("ODIs" in response1["data"]["batting"]){
        var ODIbat={
          "Fifties": response1["data"]["batting"]["ODIs"]["50"],
          "Hundreds": response1["data"]["batting"]["ODIs"]["100"],
          "Sixes": response1["data"]["batting"]["ODIs"]["6s"],
          "Fours": response1["data"]["batting"]["ODIs"]["4s"],
          "SR": response1["data"]["batting"]["ODIs"]["SR"],
          "Ave": response1["data"]["batting"]["ODIs"]["Ave"],
          "HS": response1["data"]["batting"]["ODIs"]["HS"],
          "Runs":response1["data"]["batting"]["ODIs"]["Runs"],
          "NO": response1["data"]["batting"]["ODIs"]["NO"],
          "Mat": response1["data"]["batting"]["ODIs"]["Mat"],
        };
      }
      if("tests" in response1["data"]["batting"]){
        var Testbat={
          "Fifties": response1["data"]["batting"]["tests"]["50"],
          "Hundreds": response1["data"]["batting"]["tests"]["100"],
          "Sixes": response1["data"]["batting"]["tests"]["6s"],
          "Fours": response1["data"]["batting"]["tests"]["4s"],
          "SR": response1["data"]["batting"]["tests"]["SR"],
          "Ave": response1["data"]["batting"]["tests"]["Ave"],
          "HS": response1["data"]["batting"]["tests"]["HS"],
          "Runs":response1["data"]["batting"]["tests"]["Runs"],
          "NO": response1["data"]["batting"]["tests"]["NO"],
          "Mat": response1["data"]["batting"]["tests"]["Mat"],
        };
      }
    }
    playerdetails.push({
      "Profile":response1["profile"],
      "ImageUrl":response1["imageURL"],
      "BattingStyle":response1["battingStyle"],
      "BowlingStyle":response1["bowlingStyle"],
      "Age":response1["currentAge"],
      "Name":response1["fullName"],
      "PlayerCountry":response1["country"],
      "PlayingRole":response1["playingRole"],
      "Bowling":{"T20I":T20bowl,"ODI":ODIbowl,"Test":Testbowl} ,
      "Batting":{"T20I":T20bat,"ODI":ODIbat,"Test":Testbat},
    });
  }
  return playerdetails;
}
