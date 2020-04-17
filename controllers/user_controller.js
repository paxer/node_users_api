const router = require('koa-joi-router');
const Joi = router.Joi;

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
    ctx.status = 201;
    ctx.body = {};
    //ctx.res.json(req.body); 
  }
}

module.exports = { createUser, paramsValidation }