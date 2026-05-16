import { unlink } from 'fs/promises'
import { constants } from 'http2'
import sharp from 'sharp'
import { Express, NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024
const ALLOWED_IMAGE_FORMATS = new Set(['png', 'jpeg', 'jpg', 'gif'])

async function removeUploadedFile(file?: Express.Multer.File) {
    if (file?.path) {
        await unlink(file.path).catch(() => undefined)
    }
}

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    try {
        if (req.file.size <= MIN_FILE_SIZE) {
            await removeUploadedFile(req.file)
            return next(new BadRequestError('Файл слишком маленький'))
        }

        const metadata = await sharp(req.file.path).metadata()

        if (
            !metadata.format ||
            !ALLOWED_IMAGE_FORMATS.has(metadata.format) ||
            !metadata.width ||
            !metadata.height
        ) {
            await removeUploadedFile(req.file)
            return next(new BadRequestError('Некорректное изображение'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname,
        })
    } catch (error) {
        await removeUploadedFile(req.file)
        return next(new BadRequestError('Некорректное изображение'))
    }
}
