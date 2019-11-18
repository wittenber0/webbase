
function getBinanceInfo(){
  $.get('/getBinanceInfo', (data)=>{
    console.log(data);
  })
}
