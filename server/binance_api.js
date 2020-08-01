var weight;
var prices;
var coinsToSave = ['ETHBTC', 'LTCBTC'];

function getExchangeInfo(){
  getURL('https://binance.com/api/v1/exchangeInfo').then((r)=>{
    console.log(r);
    saveWeight(2);
  });
}

function getExchangePrices(){
  getURL('https://binance.com/api/v3/ticker/bookTicker').then((r)=>{
    console.log(r);
    saveWeight(2);
  });
}

function get24HourAverage(market){
  if(market){
    getURL('https://binance.com/api/v3/ticker/24hr?symbol='+market).then((r)=>{
      console.log(r);
      window.localStorage.setItem(market, JSON.stringify(r));
      saveWeight(1);
    });
  }else{
    getURL('https://binance.com/api/v3/ticker/24hr').then((r)=>{
      console.log(r);
      saveWeight(40);
    });
  }
}

function saveWeight(w){
  if(window.localStorage.BinApiWeight){
    var wObj = JSON.parse(window.localStorage.BinApiWeight);
    wObj.hits.push({'date': Date.now(), 'cost': w});
    window.localStorage.BinApiWeight = JSON.stringify(wObj);
  }else{
    window.localStorage.BinApiWeight = JSON.stringify({'hits': [{'date': Date.now(), 'cost': w}]});
  }

  return window.localStorage.BinApiWeight;
}

function calcWeight(){
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

function getURL(url){
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
