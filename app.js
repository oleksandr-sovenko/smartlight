// Require the framework and instantiate it
const fastify       = require('fastify')({ logger: true }),
      fastifyStatic = require('fastify-static'),
      path          = require('path'),
      { GPIO }      = require('node-sandboxpi');

var relays = {
   0: { pin: 3 , timer: null },
   1: { pin: 12, timer: null },
   2: { pin: 13, timer: null },
   3: { pin: 14, timer: null },
};

var sensors = {
   0: { pin: 15, },
   1: { pin: 16 , },
   2: { pin: 1, },
   3: { pin: 11, },
};

leds = {
   green:  { pin: 4 },
   yellow: { pin: 5 }
}

// Initialize relays
for (var index in relays) {
   var relay = relays[index];

   GPIO.mode(relay.pin, GPIO.OUTPUT);
   GPIO.write(relay.pin, GPIO.HIGH);
}

// Fix
// GPIO.mode(5, GPIO.OUTPUT);
// GPIO.write(5, GPIO.LOW);

// Initialize RIP-sensors
for (var index in sensors) {
   var sensor = sensors[index];

   // console.log(sensor);

   GPIO.mode(sensor.pin, GPIO.INPUT);
}

// Initialize LEDs
// for (var index in leds) {
//    var led = leds[index];

//    GPIO.mode(led.pin, GPIO.OUTPUT);
//    GPIO.write(led.pin, GPIO.LOW);
// }

// Blink LED Green
// setInterval(function() {
//    var led = GPIO.read(leds.green.pin);

//    if (led === GPIO.HIGH)
//       GPIO.write(leds.green.pin, GPIO.LOW);
//    else
//       GPIO.write(leds.green.pin, GPIO.HIGH);
// }, 1000);

// Buttons
// GPIO.mode(16, GPIO.INPUT); // Reset

// Main timer
setInterval(function() {
   // state16 = GPIO.read(16);

   // if (state16 === GPIO.HIGH)
   //    GPIO.write(15, GPIO.HIGH);
   // else
   //    GPIO.write(15, GPIO.LOW);

   // Detect motion
   for (var index in sensors) {
      var sensor = sensors[index],
          state  = GPIO.read(sensor.pin);

      console.log(`sensor(${sensor.pin}): ${state}`);

      if (state == GPIO.HIGH && relays[index].timer === null) {
         GPIO.write(relays[index].pin, GPIO.LOW); // Relay On

         relays[index].timer = setTimeout(function(index) {
            relays[index].timer = null;
            GPIO.write(relays[index].pin, GPIO.HIGH); // Relay Off
         }, 10 * 1000, index);
      }
   }

   console.log(``);
}, 1000);


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  //prefix: '/public/', // optional: default '/'
})

// Declare a route
//fastify.get('/', async (request, reply) => {
//  return { hello: 'world' }
//})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(80, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
