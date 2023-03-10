document.querySelectorAll(".newIdea").forEach(elem=>{
  elem.addEventListener("click",(e)=>{
    generateIdea()
  })
});
document.addEventListener("click",(e)=>{
  if(e.target.id == "es" || e.target.id == "ha"){
    var hashmap_add = {
      "es":-3,
      "ha":3
    }
    diff = document.getElementById("diff").value;
    diff = parseInt(diff);
    diff += hashmap_add[e.target.id];
    document.getElementById("diff").value = diff;
    generateIdea()
  }
})
function generateIdea(){
  diff = document.getElementById("diff").value/100;
  postData("/api/getIdea", {diff:diff}).then((data)=>{
    data = data.data;
    var length = data.length;
    var picked = data[Math.floor(Math.random() * length)];
    if(picked){createCard(picked.key,picked.des,picked.comp,picked.diff)}
  })
}

function createCard(title,des,comp,diff){
  if(isNaN(comp)){
    comp = 0;
  }
  document.querySelectorAll(".card-container")[0].innerHTML =   `
        <div class="card">
          <h5 class="title">${title}</h5>
          <p><a class = "btn btn-primary make_button" data-make = "${title}" href = "//replit.com/new" target = "_blank">Make This</a></p><p><i>(${comp} Completed)</i><br>${des}</p>
        </div>
        <p><button class = " btn btn-green" style = "margin: 3px;" id  = "es">Easier</button><button class = "btn btn-red" style = "margin: 3px" id = "ha">Harder</button></p>
`
document.querySelectorAll(".make_button").forEach(elem=>{
  
  elem.addEventListener("click",(e)=>{
    var made = e.target.getAttribute("data-make");
    postData("/api/madeIdea",{made: made})
  })
})
}


async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}