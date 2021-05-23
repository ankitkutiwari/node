const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const {
  json
} = require('body-parser');
const {
  finished
} = require('stream');
// const bodyParser = require("body-parser");

//JSON PARSING
// app.use(bodyParser.json());
app.use(express.json())

//UrlEncoded Data Parsing
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.static(path.join(__dirname, 'vendor')));
app.use(express.static(path.join(__dirname, 'master')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));



app.get('/', function (req, res) {
  var temp;
  var i;
  var global;
  var value
  var val = []

  fs.readFile('./reactionstore.json', 'utf-8', (err, jsonString) => {
    jsonString = jsonString.trim();
    temp = JSON.parse(jsonString);

    i = Math.floor(Math.random() * (temp.length))

    global = temp[i]

    value = JSON.stringify(temp[i]);

    res.render("reaction.pug", {
      "datas": temp[i]
    });

    fs.readFile('./recentsearches.json', 'utf-8', (err, jsonString) => {

      if (jsonString == "{}") {
        jsonString = value
        val = "[" + jsonString + "]"
      } else {
        jsonString = jsonString.trim();
        val = JSON.parse(jsonString);
        val.push(global)

        if (val.length == 7) {
          val.shift();
        }

        val = JSON.stringify(val)
      }

         fs.writeFile('./recentsearches.json', val, (err, finished) => {
            console.log("all set")
         });
    });
 });
});

app.get('/balance', function (req, res) {
  var temp = req.query
  var result
  var value;
  fs.readFile('./recentsearches.json', 'utf-8', (err, jsonString) => {
    value = JSON.parse(jsonString)

    if ((temp.S == value[5].a) && (temp.SO == value[5].b) && (temp.AV == value[5].c) && (temp.MR == value[5].d)) {
        result="Correct"     
    } else {
        result="Wrong"     
    }

   res.render("output.pug", {
      "datas": value,
      "Result": result
   });

  });

});







//add the router
app.listen(process.env.port || 5000);

console.log('Running at Port 5000');