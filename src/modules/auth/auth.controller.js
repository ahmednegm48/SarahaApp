import {Router} from 'express'
import * as authRouter from "./auth.service.js"
import { authentication } from '../../common/middleware/authentication.middleware.js';
import { tokenTypeEnum } from '../../common/utils/enums/user.enum.js';

const router = Router()

router.post("/signup",authRouter.signup);
router.post("/login",authRouter.login);
router.post("/refresh",authentication({tokenType: tokenTypeEnum.Refresh}),authRouter.refreshToken);
router.post("/social-login",authRouter.loginWithGoogle);

export default router