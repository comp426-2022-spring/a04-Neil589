const express = require('express');
const minimist = require('minimist');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const args = minimist(process.argv.slice(2));
args['port'];
const port = args.port ||process.env.port|| 5000;

// const logging = (req, res, next)=>{
//     console.log(req.body.number)
//     next()
// }


const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

function coinFlip() {
    return Math.random() < 0.5 ? 'heads' : 'tails'
  }


  function coinFlips(flips) {
    if (!(flips>0)){flips = 1};
    const result = [];
    for (let i=0;i<flips;i++){
      result.push(Math.random() < 0.5 ? 'heads' : 'tails')
    }
    return result;
  }


  function countFlips(array) {
    const result = {tails: 0, heads: 0}; 
    array.forEach(element => {
      if (element === "heads"){
        result.heads++} else if (element === "tails"){
        result.tails++} else {
          return "Error"
        };
    });
    return result;
  }


  function flipACoin(_call) {
    if (_call !== "heads" && _call !=="tails"){
      console.log("Error: no input. Usage: node guess-flip --call=[heads|tails]")
      return
    }
    const record = {call: _call, flip:"", result:""}
    record.flip = coinFlip();
    record.result = _call === record.flip ? "win" : "lose";
    return record;
  }
  



app.get('/app/', (req, res) => {
    res.statusCode=200;
    res.statusMessage='OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage)});

app.get('/app/flips/:number',(req, res) => {
    res.status(200).json({'raw': coinFlips(req.params.number), 'summary': countFlips(coinFlips(req.params.number))});  
    res.type("text/plain")
});


app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin("heads"));
});

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin("tails"));
});


app.get('/app/flip', (req, res) => {
    res.status(200).json({'flip':coinFlip()});
    // res.type("text/plain")
});


app.use(function (req, res) {
    res.status(404).end('Endpoint does not exist');
    res.type("text/plain")
});
