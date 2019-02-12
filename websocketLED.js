const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Gpio = require('onoff').Gpio;

//using pin seven but it is GPIO 4, confusing
//out because only sending a signal to the led
//set as var because miht reinitialize below
var LED1 = new Gpio(4, 'out'); 
//both is for up and down button press holds
//in this example I want to do button pushes
var pushButton1 = new Gpio(17, 'in', 'both');



//routes
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//connections
//or... ('connection', function (socket) {
//executed when a client connects
io.on('connection', (socket) => {
    console.log('new socket connection from server');
    //get curent status of led
    //have to do this synchronously, because need info before proceeding
    //LED1.read() is asynchroous
    var currentStatusLed = LED1.readSync();
    //send status of the led to all connected clients
    //socket.emit only sends it to the newly connected client
    //io.emit sends to all clients
    //readSync gets current status of LED
    socket.emit('buttonled', {buttonstatus: currentStatusLed});
    console.log('LED read: ', currentStatusLed);
    
    //when the button is pushed, emit new status
    //this reads both push and let go
    //always changes from 1 to 0
    //hold button, send 1
    //release button, sends 0
    pushButton1.watch(function (err, value) {
        if (err) {
            console.error('There was an error with the pushButton1', err);
            return;
        }
        //if no error
        //turn off or on depending on button hold
        LED1.writeSync(value); 
        socket.emit('buttonled', {buttonstatus: LED1.readSync()});
    });
    
    //when the client changes the toggle button
    socket.on('buttonled', (data) => {
        //set the value from the client
        //check to ensure that the value is not the same, don'tneed to change
        console.log('button change from client called via on: ', data)
        LED1.writeSync(data);
        //send new status to all clients
        io.emit('buttonled', {buttonstatus: LED1.readSync()});
    });
    
    //when a client disconnects
    socket.on('disconnect', () => {
        console.log('client disconnected from server');
    });
    
});


//make this async in case want to do other thinks in parallel
//run this when close the window, resets state of pins
//this can't be async, all of the processes have to go in order
function unexportOnClose() {
    try {
        LED1.writeSync(0); //turn off led
        console.log('led turned off...');
        LED1.unexport(); //free gpio pin, var set above
        console.log('led GPIO pin cleared...');
        pushButton1.unexport(); //free all resources, var set above
        console.log('button GPIO pin cleared...');
        console.log('cleaninig up...closing server...');
        //close the http server connection
        http.close();
        console.log('server closed...');
        process.exit(0); //should end all async functions, prevents errors        
    }
    catch(err) {
        console.error("Error in unexportOnClose function: ", err);
    }
}
//when ctrl c to exit, clears all of the resources
process.on('SIGINT', unexportOnClose);


//call server on port 8080, local host
http.listen(8080, () => {
    console.log('http started on port 8080');
});
