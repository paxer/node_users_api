const logger = require('koa-logger')
const router = require('koa-joi-router');
const Koa = require('koa');

const userController = require('./controllers/user_controller')

const r = router();
const app = new Koa();
const API_PORT = process.env.PORT || '3000';

app.use(logger())
app.use(r.middleware());

r.get('/ping', async ctx => { ctx.body = 'pong'; });
r.post('/users', { validate: userController.paramsValidation }, userController.createUser)
r.get('/users/:id', userController.showUser)
r.delete('/users/:id', userController.deleteUser)
r.patch('/users/:id', { validate: { type: 'json' } }, userController.updateUser)

const server = app.listen(API_PORT);

module.exports = {
  server
};