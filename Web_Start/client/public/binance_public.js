
function getBinanceInfo(){
  $.get('https://binance.com/api/v1/exchangeInfo', (data)=>{
    console.log(data);
  })
}
