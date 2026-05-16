import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
    getCsrfToken,
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { csrfProtection } from '../middlewares/csrf'

const authRouter = Router()
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
})

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', auth, updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.get('/csrf-token', getCsrfToken)
authRouter.post('/login', authLimiter, login)
authRouter.post('/token', csrfProtection, refreshAccessToken)
authRouter.post('/logout', csrfProtection, logout)
authRouter.post('/register', authLimiter, register)

export default authRouter
