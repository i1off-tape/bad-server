import { Router } from 'express'
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

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', auth, updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.get('/csrf-token', getCsrfToken)
authRouter.post('/login', login)
authRouter.post('/token', csrfProtection, refreshAccessToken)
authRouter.post('/logout', csrfProtection, logout)
authRouter.post('/register', register)

export default authRouter
