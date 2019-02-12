//just type: npm run dev, instead of node app.js and it will automatically 
//run the dev nodemon described in the package.json
const Gpio = require('onoff').Gpio;

//using pin seven but it is GPIO 4, confusing
//out because only sending a signal to the led
//set as var because miht reinitialize below
var LED1 = new Gpio(4, 'out'); 
var pushButton1 = new Gpio(17, 'in', 'both'); //both is for up and down button press


//the value is automatically taken from teh state of the GPIO pin, usually off
//it only works when button pressed
pushButton1.watch(function (err, value) {
    if (err) {
        console.error('There was an error with the pushButton1', err);
        return;
    }
    //if no error
    LED1.writeSync(value); //turn off or on depending on button hold
});


//make this async in case want to do other thinks in parallel
//run this when close the window, resets state of pins
async function unexportOnClose() {
    try {
        LED1.writeSync(0); //turn off led
        LED1.unexport(); //free gpio pin, var set above
        pushButton1.unexport(); //free all resources, var set above        
    }
    catch(err) {
        console.error("Error in unexportOnClose function: ", err);
    }
}

process.on('SIGINT', unexportOnClose); //when ctrl c to exit, clears all of hte resources