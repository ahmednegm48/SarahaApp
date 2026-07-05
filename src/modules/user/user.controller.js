import {Router} from 'express'
import * as userService from './user.service.js'
import { authentication } from '../../common/middleware/authentication.middleware.js';
import { tokenTypeEnum } from '../../common/utils/enums/user.enum.js';

const router = Router()

router.get('/profile', authentication({tokenType: tokenTypeEnum.Access}), userService.getProfile);

export default router