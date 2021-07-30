var http = require('http')
var config = require('config')
var secret = require('secret')
var console = require('console')
var apikey = secret.get('key1');
//var apikey=0n9sZpvqeUeIyzUVCQTOI7hz1uetdxeYbCkt0IeD9O7whOKL7XycmGZN09zm
module.exports.function = function FindMatch (LocalTeamName, VisitorTeamName, Country, League) {

  var options = {format: 'json'};
  var response = http.getUrl(config.get('url1')+'/fixtures?api_token='+apikey+"&include=visitorteam,localteam,runs,venue,league", options)["data"];
  var length=response.length;
  if (length==0){
    return []
  }
  length=6;         //limiting api hits
  var matchscores=[];  // all match details, which are to be returned after matching with user inputs
  
  for (let i = 0; i < length; i++) {
    var item = response[i];

    var localteam_details=item["localteam"];
    var visitorteam_details=item["visitorteam"];
    var localteamruns={};
    var visitorteamruns={};
    if(item["runs"].length>=1){
      if(item["runs"].length>1){
        if(item["runs"][0]["inning"]==1){
          var localteamruns=item["runs"][0];
          var visitorteamruns=item["runs"][1];
        }
        else{
          var localteamruns=item["runs"][1];
          var visitorteamruns=item["runs"][0];
        }
      }
      else if(item["runs"].length==1){
        var localteamruns=item["runs"][0];
      }
      if(item["visitorteam"]["id"]==localteamruns["team_id"]){
        var localteam_details=item["visitorteam"];
        var visitorteam_details=item["localteam"];
      }
    }

    var toss_winner_id=item["toss_won_team_id"];
    if (toss_winner_id==localteam_details["id"])
      var toss_winner=localteam_details["name"];
    else
      var toss_winner=visitorteam_details["name"];

    if(Country){
      var country_id=item["venue"]["country_id"];
      var country=http.getUrl(config.get('url1')+'/countries/'+country_id+'?api_token='+apikey, options)["data"]["name"];
        console.debug(Country);
      var CountryName=Country.country.name;
    }

    var leaguename=item["league"]["name"]

    if (((!LocalTeamName || String(localteam_details["name"]).toUpperCase() == String(LocalTeamName).toUpperCase()) 
      &&(!VisitorTeamName || String(visitorteam_details["name"]).toUpperCase() == String(VisitorTeamName).toUpperCase())) || 
      ((!VisitorTeamName || String(localteam_details["name"]).toUpperCase() == String(VisitorTeamName).toUpperCase()) 
      &&(!LocalTeamName || String(visitorteam_details["name"]).toUpperCase() == String(LocalTeamName).toUpperCase())))
      {
        if((!CountryName || String(country).toUpperCase() == String(CountryName).toUpperCase()) 
        && (!League || String(leaguename).toUpperCase() == String(League).toUpperCase())){

          if (localteamruns)
            var localteamdetails={
              "Name": localteam_details["name"],
              "ImageUrl": localteam_details["image_path"],
              "Runs": localteamruns["score"],
              "Wickets": localteamruns["wickets"],
              "Overs": localteamruns["overs"],
              }
          else
            var localteamdetails={
              "Name": localteam_details["name"],
              "ImageUrl": localteam_details["image_path"],
              }

          if (visitorteamruns)
            var visitorteamdetails={
              "Name": visitorteam_details["name"],
              "ImageUrl": visitorteam_details["image_path"],
              "Runs": visitorteamruns["score"],              
              "Wickets": visitorteamruns["wickets"],
              "Overs": visitorteamruns["overs"],
              }
          else
            var visitorteamdetails={
              "Name": visitorteam_details["name"],
              "ImageUrl": visitorteam_details["image_path"],
              }

        matchscores.push({
          "LocalTeamDetails": localteamdetails,
          "VisitorTeamDetails": visitorteamdetails,
          "Type": item["type"],
          "League": leaguename,
          "Round": item["round"],
          "Live": item["live"],
          "Note": item["note"],
          "TossWonTeam": toss_winner,
        });
      }
    }
  }
  // console.log(matchscores);
  return matchscores;
}