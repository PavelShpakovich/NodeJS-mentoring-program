import { Router } from 'express';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { login } from '../controllers/login.controller';

const bodySchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().alphanum().required(),
});

const validator = createValidator();

const bodyValidator = validator.body(bodySchema);

const router = Router();

router.post('/login', bodyValidator, login);

export default router;
