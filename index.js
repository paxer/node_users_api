const logger = require('koa-logger')
const router = require('koa-joi-router');
const Koa = require('koa');

const userController = require('./controllers/user_controller')

const public = router();
const app = new Koa();
const API_PORT = process.env.PORT || '3000';

app.use(logger())
app.use(public.middleware());

public.get('/ping', async ctx => { ctx.body = 'pong'; });
public.post('/users', { validate: userController.paramsValidation }, userController.createUser)
public.get('/users/:id', userController.showUser)
public.delete('/users/:id', userController.deleteUser)
public.patch('/users/:id', { validate: { type: 'json' } }, userController.updateUser)

const server = app.listen(API_PORT);

module.exports = {
  server
};