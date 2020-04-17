const logger = require('koa-logger')
const Koa = require('koa');
const app = new Koa();

app.use(logger())
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);