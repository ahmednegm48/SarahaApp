import {Router} from 'express'
import * as authRouter from "./auth.service.js"

const router = Router()

router.post("/signup",authRouter.signup);
router.post("/login",authRouter.login)

export default router