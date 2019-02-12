//just type: npm run dev, instead of node app.js and it will automatically 
//run the dev nodemon described in the package.json
const Gpio = require('onoff').Gpio;

//using pin seven but it is GPIO 4, confusing
//out because only sending a signal to the led
//set as var because miht reinitialize below
var LED1 = new Gpio(4, 'out'); 
var LED2 = new Gpio(17, 'out');

//setting hte interval here, saves space below, blink every half second
var blinkInterval1 = setInterval(blinkLED1, 500);
var blinkInterval2 = setInterval(blinkLED2, 250);

//make this async in case want to do other thinks in parallel
async function blinkLED1() {
    try {
        //check to see if led already on
        if (LED1.readSync() === 0) {
            LED1.writeSync(1); //1 means to turn on
        }
        else {
            LED1.writeSync(0); //0 means to turn off
        }
    }
    catch(err) {
        console.error("Error in blinkLED1 function: " + err);
    }
}

//export it
//module.exports.blinkLED1 = blinkLED1();

//another way of writing an async function
const endBlink1 = async () => {
    try {
        //check to see if led already on
        clearInterval(blinkInterval1); //clear setting from above
        LED1.writeSync(0); //0 means to turn off
    }
    catch(err) {
        console.error("Error in endBlink1 function: " + err);
    }
}

//stop everything after 10 seconds
setTimeout(endBlink1, 10000);


//make this async in case want to do other thinks in parallel
async function blinkLED2() {
    try {
        //check to see if led already on
        if (LED2.readSync() === 0) {
            LED2.writeSync(1); //1 means to turn on
        }
        else {
            LED2.writeSync(0); //0 means to turn off
        }
    }
    catch(err) {
        console.log("Error in blinkLED2 function: " + err);
    }
}

//another way of writing an async function
const endBlink2 = async () => {
    try {
        //check to see if led already on
        clearInterval(blinkInterval2); //clear setting from above
        LED2.writeSync(0); //0 means to turn off
    }
    catch(err) {
        console.log("Error in endBlink2 function: " + err);
    }
}

//stop everything after 10 seconds
setTimeout(endBlink2, 10000);