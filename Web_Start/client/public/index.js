var countdown;

var target = new Date(2019, 8, 22, 16);

window.addEventListener('load', (event)=>{
  document.getElementById('count-down').textContent = target - Date.now();
})

function getPost(){
  
}
