const router = require('koa-joi-router');
const Joi = router.Joi;
const User = require('../models').User

const paramsValidation = {
  body: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  },
  continueOnError: true,
  type: 'json'
}

async function createUser(ctx) {
  if (ctx.invalid) {
    ctx.status = 400;
    ctx.body = ctx.invalid
  } else {
    const user = await User.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = user.toJSON();
  }
}

async function showUser(ctx) {
  const user = await User.findByPk(Number(ctx.params.id))
  if (!user) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    ctx.body = user.toJSON()
  }
}

async function deleteUser(ctx) {
  const user = await User.findByPk(Number(ctx.params.id))
  if (!user) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    await user.destroy()
    ctx.body = {}
  }
}

async function updateUser(ctx) {
  console.log(ctx.request.body)
  const user = await User.findByPk(Number(ctx.params.id))
  if (!user) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    if (ctx.request.body.name) {
      user.name = ctx.request.body.name
    }
    if (ctx.request.body.email) {
      user.email = ctx.request.body.email
    }
    await user.save()
    ctx.body = user.toJSON();
  }
}

async function getUsers(ctx) {
  const users = await User.findAll();
  ctx.body = users.map(u => u.toJSON());
}

module.exports = { createUser, paramsValidation, showUser, deleteUser, updateUser, getUsers }