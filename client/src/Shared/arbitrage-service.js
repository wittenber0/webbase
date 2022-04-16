import App from '../App';
import UtilityService from './utility-service';
const fetch = require('node-fetch');

//arbitrage
const bookListUrl = 'https://api.actionnetwork.com/web/v1/books';
const oddsUrl = 'https://api.actionnetwork.com/web/v1/scoreboard/all?bookIds=';
const actionLabsBookOdds = 'https://d3ttxfuywgi7br.cloudfront.net/odds/';
const actionLabsPlayers = 'https://d3ttxfuywgi7br.cloudfront.net/players/projections/all/actionnetwork/default.json'
const actionLabsPropEvents = 'https://d3ttxfuywgi7br.cloudfront.net/events/default.json?leagueId=1,2,3&initialRequest=true&xid=66baf522-6536-496c-bcd1-3405d15b434c'
const actionLabsMarketEvents = 'https://d3ttxfuywgi7br.cloudfront.net/events/default.json?leagueId=1,2,3&initialRequest=true&xid=d7ffcc85-db0a-4d62-b94a-8fedb88a2c39'

//betOnline
const betOnlineOdds = 'https://api.betonline.ag/offering/api/offering/sports/offering-by-today-games'

//pinnacle
const pinnacleMatchUps = 'https://guest.api.arcadia.pinnacle.com/0.1/sports/'
const pinnacleSports = 'https://guest.api.arcadia.pinnacle.com/0.1/sports'
const pinnacleMarkets = 'https://guest.api.arcadia.pinnacle.com/0.1/sports/'
const pinnacleGameDetails = 'https://guest.api.arcadia.pinnacle.com/0.1/matchups/1551220294/related'
const pinnacleGameLines = 'https://guest.api.arcadia.pinnacle.com/0.1/matchups/1551220294/markets/related/straight'

class ArbitrageService{

  static getAllBooks = async function(){
    return UtilityService.get(bookListUrl);
  }

  static getAllOddsForDate = async function(d, selectedBooks){
    let dateString;
    if(d == undefined){
      d = new Date();
    }
    dateString = d.getFullYear().toString();
    dateString += (d.getMonth() +1).toString().padStart(2, '0') ;
    dateString += d.getDate().toString().padStart(2, '0');
    return UtilityService.get(oddsUrl + selectedBooks.join() + '&date='+dateString);
  }

  static getAtionLabsBookOdds = async function(bookId){
    return UtilityService.get(actionLabsBookOdds + bookId +'/default.json');
  }

  static getActionLabsPlayers = async function(){
    return UtilityService.get(actionLabsPlayers);
  }

  static getActionLabsPropEvents = async function(){
    return UtilityService.get(actionLabsPropEvents);
  }

  static getActionLabsMarketEvents = async function(){
    return UtilityService.get(actionLabsMarketEvents);
  }

  static getPinnacleMatchUps = async function(sportId){
    let options = {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-api-key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
        "x-device-uuid": "ad3e5664-f67a62d5-3de6d5cd-15c70fa6"
      },
      "referrer": "https://www.pinnacle.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    }

    return UtilityService.get(pinnacleMatchUps + sportId + '/matchups?withSpecials=false', options);
  }

  static getPinnacleMarkets = async function(sportId){
    let options = {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-api-key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
        "x-device-uuid": "ad3e5664-f67a62d5-3de6d5cd-15c70fa6"
      },
      "referrer": "https://www.pinnacle.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    }
    return UtilityService.get(pinnacleMarkets + sportId + '/markets/straight?primaryOnly=false&withSpecials=false', options);
  }

  static getBetOnlineOdds = async function(sport){
    let options = {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "access-control-allow-headers": "Content-Type",
        "access-control-allow-methods": "GET, POST",
        "access-control-allow-origin": "https://api.betonline.ag/offering/api/offering/sports/offering-by-today-games",
        "actual-time": "1648563709976",
        "content-type": "application/json",
        "contests": "na",
        "gmt-offset": "-4",
        "gsetting": "bolnasite",
        "iso-time": "2022-03-29T14:21:49.976Z",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "utc-offset": "240",
        "utc-time": "Tue, 29 Mar 2022 14:21:49 GMT"
      },
      "referrer": "https://www.betonline.ag/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"Sport\":\""+sport+"\",\"Period\":0}",
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    }

    return await fetch("https://api.betonline.ag/offering/api/offering/sports/offering-by-today-games", options)
    .then(res=>{
      return(res.json());
    }).then((json)=> {
      return(json)
    }).catch(()=>{
      return(false);
    });;
  }

  static getBovadaOdds = async function(sport){
    return UtilityService.get("https://www.bovada.lv/services/sports/event/coupon/events/A/description/"+sport+"?marketFilterId=def&preMatchOnly=true&lang=en");
  }

  static updateMyBooks = async function(myBooks){
    let userId = App.user().user_id;
    return UtilityService.post('/users/'+userId+'/arbitrage/myBooks', {user: userId, myBooks: myBooks});
  }

}


export default ArbitrageService
