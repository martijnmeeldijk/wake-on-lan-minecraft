const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var wol = require('wake_on_lan');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {server:"Turn on Server"});
});
app.get('/status', function (req, res) {
    res.render('status', {server:"Turn on Server"});
  });

app.get('/on', function (req, res) {
    wol.wake('D8CB8A3B5820', function(error) {
        if (error) {
            res.render('index', {server:"Error turning on Server"});
        } else {
            res.render('index', {server:"Turning on Server"});
        }
      });
    
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});