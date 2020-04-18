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
    // TODO: validate record save success
    const user = await User.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = user.toJSON();
  }
}

module.exports = { createUser, paramsValidation }