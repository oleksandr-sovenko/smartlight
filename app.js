// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const fastifyStatic = require('fastify-static')
const path = require('path')
const { GPIO } = require('node-sandboxpi');


GPIO.mode(30, GPIO.OUTPUT);
setInterval(function() {
   var state = GPIO.read(30);
 
   if (state === GPIO.HIGH)
      GPIO.write(30, GPIO.LOW);
   else
      GPIO.write(30, GPIO.HIGH);
}, 2000);

GPIO.mode(7, GPIO.INPUT);
setInterval(function() {
   var state = GPIO.read(7);
 
   //if (state === GPIO.HIGH)
   //   GPIO.write(30, GPIO.LOW);
   //else
   //   GPIO.write(30, GPIO.HIGH);
   console.log(`GPIO7: ${state}`);
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
