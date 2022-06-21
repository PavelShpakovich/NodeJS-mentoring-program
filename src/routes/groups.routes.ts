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

const bodySchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()),
});

const paramsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const validator = createValidator();
const bodyValidator = validator.body(bodySchema);
const paramsValidator = validator.params(paramsSchema);

const router = Router();

router.route('/groups').post(bodyValidator, createGroup).get(getGroups);
router.route('/addUsersToGroup').post(addUsersToGroup);

router
  .route('/groups/:id')
  .all(paramsValidator, checkGroupByIdMiddleware)
  .get(getGroup)
  .delete(deleteGroup)
  .put(bodyValidator, updateGroup);

export default router;
