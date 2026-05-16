import path from 'path'
import BadRequestError from '../errors/bad-request-error'

export function assertSafeRelativeFileName(fileName: string) {
    if (
        !fileName ||
        fileName.includes('..') ||
        fileName.includes('/') ||
        fileName.includes('\\') ||
        path.isAbsolute(fileName)
    ) {
        throw new BadRequestError('Некорректное имя файла')
    }

    return fileName
}

export function resolveInside(baseDir: string, fileName: string) {
    const safeFileName = assertSafeRelativeFileName(fileName)
    const resolvedBase = path.resolve(baseDir)
    const resolvedFile = path.resolve(resolvedBase, safeFileName)

    if (!resolvedFile.startsWith(`${resolvedBase}${path.sep}`)) {
        throw new BadRequestError('Некорректный путь файла')
    }

    return resolvedFile
}
