import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
  addUsersToGroup,
} from '../controllers/group.controllers';
import { checkGroupByIdMiddleware } from '../middleware/checkById.middleware';
import { Router } from 'express';
import checkToken from '../middleware/checkToken.middleware';

const bodySchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()),
});

const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

const validator = createValidator();
const bodyValidator = validator.body(bodySchema);
const paramsValidator = validator.params(paramsSchema);

const router = Router();

router.route('/groups').all(checkToken).post(bodyValidator, createGroup).get(getGroups);
router.route('/addUsersToGroup').post(checkToken, addUsersToGroup);

router
  .route('/groups/:id')
  .all(paramsValidator, checkToken, checkGroupByIdMiddleware)
  .get(getGroup)
  .delete(deleteGroup)
  .put(bodyValidator, updateGroup);

export default router;
