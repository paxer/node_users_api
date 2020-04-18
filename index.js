const logger = require('koa-logger')
const router = require('koa-joi-router');

const userController = require('./controllers/user_controller')

const Koa = require('koa');
const public = router();
const app = new Koa();

const API_PORT = process.env.PORT || '3000';

app.use(logger())
app.use(public.middleware());

public.get('/ping', async ctx => { ctx.body = 'pong'; });
public.post('/users', { validate: userController.paramsValidation }, userController.createUser)
// public.param('users', async (id, ctx, next) => {
//   const user = await findUser(id);
//   if (!user) return ctx.status = 404;
//   ctx.user = user;
//   await next();
// });
public.get('/users/:id', userController.showUser)


const server = app.listen(API_PORT);

module.exports = {
  server
};