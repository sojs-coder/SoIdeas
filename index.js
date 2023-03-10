const express = require('express');
const so_db = require("@sojs_coder/sodb");
const morgan = require("morgan")
const app = express();


const ideas = new so_db.Database("SoIdeas");
app.use(express.json());
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./static'))


ideas.addDoc("formatter",{"formatted":"now its true"}).then(()=>{ideas.deleteDoc("formatter")})


app.get('/', (req, res) => {
  res.sendFile(__dirname+'/views/index.html')
});
app.get('/all',(req,res)=>{
  res.sendFile(__dirname+"/views/all.html")
})
app.post("/api/getIdea",(req,res)=>{
  var diff = req.body.diff;
  diff = parseFloat(diff);
  var minMax = [Math.max(0, diff - 0.1), Math.min(diff + 0.1, 1)]
  ideas.dump().then(all=>{
    all = json2array(all).filter(idea =>{
      return (idea.diff >= minMax[0] && idea.diff <= minMax[1])
    });
    res.json({"data":all})
  })
});
app.post("/api/madeIdea",(req,res)=>{
  ideas.getDoc(req.body.made).then(item=>{
    if(item){
      if(item.comp){
        item.comp += 1;
      }else{
        item.comp = 1;
      }
      ideas.addDoc(req.body.made,item).then(()=>{
        res.json({status:200})
      })
    }
  })
})
app.post("/api/getIdeas",(req,res)=>{
  ideas.dump().then(all=>{
    data = json2array(all);
    data.sort((a,b)=>{
      if(a.diff > b.diff){
        return 1
      }else if(a.diff < b.diff){
        return -1;
      }else{
        return 1;
      }
    })
    res.json({data: data})
  })
})

app.listen(3000, () => {
  console.log('server started');
});


function json2array(json){
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
    json[key].key = key
    result.push(json[key]);
  });
  return result;
}