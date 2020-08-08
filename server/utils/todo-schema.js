const Joi = require("joi");

const todoSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().min(1).required(),
  completed: Joi.boolean(),
});
exports.validateTodo = (todo) => todoSchema.validate(todo);
