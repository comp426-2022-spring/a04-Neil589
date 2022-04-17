const express = require('express');
// const minimist = require('minimist');
const app = express();
const database = require('./database.js')
const morgan = require('morgan')
const fs = require('fs')


// Require minimist module
const args = require('minimist')(process.argv.slice(2))
// See what is stored in the object produced by minimist
console.log(args)
// Store help text 
const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)
// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// const args = minimist(process.argv.slice(2));
args['port'];
const port = args.port ||process.env.port|| 5000;
// const logging = (req, res, next)=>{
//     console.log(req.body.number)
//     next()
// }
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});



app.use( (req, res, next) => {
    // Your middleware goes here.
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }

    console.log(logdata);
    const db_prep = db.prepare('INSERT INTO accesslog (remoteaddr,remoteuser,time,method,url,protocol,httpversion,status,referer,useragent) VALUES (?,?,?,?,?,?,?,?,?,?)')
    const db_run = db_prep.run(logdata.remoteaddr,logdata.remoteuser, logdata.time, logdata.method,logdata.url,logdata.protocol,logdata.httpversion, logdata.satus,logdata.referer, logdata.useragent)
    next();

    })

    //endpoints
    if(args.debug) {
      //add accesslog records in db
      app.get('/app/log/access/', (req, res) => {
          const db_prep = db.prepare("SELECT * FROM accesslog").all()
          res.status(200).json(db_prep)
      });
      //error reponse
      app.get('/app/error', (req, res) => {
          throw new Error("Error test successful.")
      });}

      if(args.log == "false"){
        console.log(
          "No log file created"
        )
      }
      else{
        // Use morgan for logging to files
        // Create a write stream to append (flags: 'a') to a file
        const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' })
        // Set up the access logging middleware
        app.use(morgan('combined', { stream: WRITESTREAM}))
      }

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
