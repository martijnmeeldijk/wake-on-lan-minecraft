const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

const server = require('http').Server(app);
var wol = require('wake_on_lan');

var fs = require('fs'); //require filesystem module
var io = require('socket.io')(server); //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
ledRed = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen = new Gpio(17, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue = new Gpio(27, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
redRGB = 255, //set starting value of RED variable to off (0 for common cathode)
greenRGB = 255, //set starting value of GREEN variable to off (0 for common cathode)
blueRGB = 255; //set starting value of BLUE variable to off (0 for common cathode)

//RESET RGB LED
ledRed.digitalWrite(0); // Turn RED LED off
ledGreen.digitalWrite(0); // Turn GREEN LED off
ledBlue.digitalWrite(0); // Turn BLUE LED off

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
  res.render('index', {server:"Turn on Server", time: ""});
});
app.get('/status', function (req, res) {
    res.render('status', {server:"Turn on Server", time: ""});
  });

app.get('/on', function (req, res) {
    wol.wake('D8CB8A3B5820', function(error) {
        if (error) {
            res.render('index', {server:"Error turning on Server", time: ""});
        } else {
            res.render('index', {server:"Turning on Server", time: "This might take a while"});
        }
      });
    
  });

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

io.sockets.on('connection', function (socket) {// Web Socket Connection
  socket.on('rgbLed', function(data) { //get light switch status from client
    console.log(data); //output data from WebSocket connection to console

    //for common anode RGB LED  255 is fully off, and 0 is fully on, so we have to change the value from the client
    redRGB=255-parseInt(data.red);
    greenRGB=255-parseInt(data.green);
    blueRGB=255-parseInt(data.blue);

    console.log("rbg: " + redRGB + ", " + greenRGB + ", " + blueRGB); //output converted to console

    ledRed.pwmWrite(redRGB); //set RED LED to specified value
    ledGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
    ledBlue.pwmWrite(blueRGB); //set BLUE LED to specified value
  });
});

process.on('SIGINT', function () { //on ctrl+c
  ledRed.digitalWrite(1); // Turn RED LED off
  ledGreen.digitalWrite(1); // Turn GREEN LED off
  ledBlue.digitalWrite(1); // Turn BLUE LED off
  process.exit(); //exit completely
});