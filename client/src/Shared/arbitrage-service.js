import App from '../App';
import UtilityService from './utility-service';
const fetch = require('node-fetch');

const bookListUrl = 'https://api.actionnetwork.com/web/v1/books';
const oddsUrl = 'https://api.actionnetwork.com/web/v1/scoreboard/all?bookIds=';
const actionLabsBookOdds = 'https://d3ttxfuywgi7br.cloudfront.net/odds/';
const actionLabsPlayers = 'https://d3ttxfuywgi7br.cloudfront.net/players/projections/all/actionnetwork/default.json'
const actionLabsPropEvents = 'https://d3ttxfuywgi7br.cloudfront.net/events/default.json?leagueId=1,2,3&initialRequest=true&xid=66baf522-6536-496c-bcd1-3405d15b434c'
const actionLabsMarketEvents = 'https://d3ttxfuywgi7br.cloudfront.net/events/default.json?leagueId=1,2,3&initialRequest=true&xid=d7ffcc85-db0a-4d62-b94a-8fedb88a2c39'

const betOnlineOdds = 'https://api.betonline.ag/offering/api/offering/sports/offering-by-today-games'

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

  static getBetOnlineOdds = async function(sport){
    let payload = {};
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
      "body": "{\"Sport\":\"baseball\",\"Period\":0}",
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    }

    payload = {Sport: sport, Period: 0}

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

}


export default ArbitrageService
