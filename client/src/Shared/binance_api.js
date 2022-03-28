import $ from "jquery";

var weight;
var prices;
var coinsToSave = ['ETHBTC', 'LTCBTC'];

class BinanceService{

  static getExchangeInfo = async function(){
    this.getURL('https://binance.com/api/v1/exchangeInfo').then((r)=>{
      console.log(r);
      this.saveWeight(2);
    });
  }

  static getExchangePrices = async function (){
    this.getURL('https://binance.com/api/v3/ticker/bookTicker').then((r)=>{
      console.log(r);
      this.saveWeight(2);
    });
  }

  static get24HourAverage = async function(market){
    if(market){
      this.getURL('https://binance.com/api/v3/ticker/24hr?symbol='+market).then((r)=>{
        console.log(r);
        window.localStorage.setItem(market, JSON.stringify(r));
        this.saveWeight(1);
      });
    }else{
      this.getURL('https://binance.com/api/v3/ticker/24hr').then((r)=>{
        console.log(r);
        this.saveWeight(40);
      });
    }
  }

  static saveWeight = function(w){
    if(window.localStorage.BinApiWeight){
      var wObj = JSON.parse(window.localStorage.BinApiWeight);
      wObj.hits.push({'date': Date.now(), 'cost': w});
      window.localStorage.BinApiWeight = JSON.stringify(wObj);
    }else{
      window.localStorage.BinApiWeight = JSON.stringify({'hits': [{'date': Date.now(), 'cost': w}]});
    }

    return window.localStorage.BinApiWeight;
  }

  static calcWeight = function(){
    var wObj = JSON.parse(window.localStorage.BinApiWeight);
    var nObj = {'hits': []};
    var now = Date.now();
    var w = 0;

    wObj.hits.map((h)=>{
      if(now - h.date < 86400000){
        nObj.hits.push(h);
        w += h.cost;
      }
    });

    window.localStorage.BinApiWeight = JSON.stringify(nObj);

    return w;
  }

  static getURL = async function(url){
    return new Promise((res, rej) => {
      $.ajax({
        url: url,
        type: 'GET',
        success: (r) => {
          res(r);
        },
        error: (e) =>{
          rej(e);
        }
      });
    });
  }
}

export default BinanceService;
