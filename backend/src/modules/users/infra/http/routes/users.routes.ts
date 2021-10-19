import { Router } from 'express';

import { container } from 'tsyringe';


import multer from 'multer';
import uploadConfig from '@config/upload';


import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const userAvatarController = new UserAvatarController();
const usersController = new UsersController();
const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;
