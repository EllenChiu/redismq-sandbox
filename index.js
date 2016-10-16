import 'babel-polyfill';
import Koa from 'koa';

import RedisSMQ from "rsmq";
import RSMQWorker from "rsmq-worker";

const rsmq = new RedisSMQ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});

var app = new Koa();
var channelName = 'myqueue';
var worker = new RSMQWorker(channelName);

worker.on("message", function(msg, next, id) {
  console.log("Message id : " + id);
  console.log(msg);
  next()
});

worker.on('error', function(err, msg) {
  console.log("ERROR", err, msg.id);
});
worker.on('exceeded', function(msg) {
  console.log("EXCEEDED", msg.id);
});
worker.on('timeout', function(msg) {
  console.log("TIMEOUT", msg.id, msg.rc);
});

worker.start();

function send(qname, message) {
  console.log('=== send ===');
  return rsmq.sendMessage({
    qname: qname,
    message: message
  }, function(error, resp) {
    if (error) return console.error(error);
    if (resp) return console.log("ID:", resp);
  });
}

send(channelName, '098765 test');


app.use(async(ctx, next) => {
  // call the next middleware below
  await next();
});

app.use(async(ctx, next) => {
  // call the next middleware below
  await next();
});

app.use(async(ctx) => {
  // no more next();
  // head back up the stack
  ctx.body = 'Hello world';
});

console.log('http://localhost:3000');
app.listen(3000);
