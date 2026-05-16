import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../errors/forbidden-error'

export const CSRF_COOKIE_NAME = '_csrf'
export const CSRF_HEADER_NAME = 'x-csrf-token'

export function issueCsrfToken(_req: Request, res: Response) {
    const token = crypto.randomBytes(32).toString('hex')

    res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })

    return token
}

export function csrfProtection(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME]
    const headerToken = req.header(CSRF_HEADER_NAME)

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return next(new ForbiddenError('Некорректный CSRF токен'))
    }

    return next()
}
