import 'babel-polyfill';
import Koa from 'koa';

var app = new Koa();

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
