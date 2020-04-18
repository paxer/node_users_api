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
  console.log(ctx.params)
  const user = await User.findByPk(Number(ctx.params.id))
  if (!user) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    ctx.user = user;
    ctx.body = user.toJSON()
  }
}

module.exports = { createUser, paramsValidation, showUser }