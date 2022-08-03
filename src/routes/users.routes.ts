import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controllers';
import { checkUserByIdMiddleware } from '../middleware/checkById.middleware';
import { Router } from 'express';
import checkToken from '../middleware/checkToken.middleware';

const bodySchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required(),
});

const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

const validator = createValidator();
const bodyValidator = validator.body(bodySchema);
const paramsValidator = validator.params(paramsSchema);

const router = Router();

router.route('/users').all(checkToken).post(bodyValidator, createUser).get(getUsers);

router
  .route('/users/:id')
  .all(paramsValidator, checkUserByIdMiddleware)
  .get(getUser)
  .delete(checkToken, deleteUser)
  .put(bodyValidator, checkToken, updateUser);

export default router;
