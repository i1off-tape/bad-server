import { rename } from 'fs/promises'
import { basename } from 'path'
import { resolveInside } from './safeUploadPath'

export default async function movingFile(
    imagePath: string,
    from: string,
    to: string
) {
    const fileName = basename(imagePath)
    const imagePathTemp = resolveInside(from, fileName)
    const imagePathPermanent = resolveInside(to, fileName)

    await rename(imagePathTemp, imagePathPermanent)
}
