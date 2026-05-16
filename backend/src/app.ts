import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose, { mongo } from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

const allowedOrigins = (process.env.ORIGIN_ALLOW || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())

const corsOptions = {
    origin(
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('CORS origin denied'))
    },
    credentials: true,
}

app.use(helmet())
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
    })
)

app.use(cookieParser())

app.use(cors(corsOptions))
// app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '100kb' }))
app.use(json({ limit: '100kb' }))
app.use(
    mongoSanitize({
        replaceWith: '_',
    })
)
app.use(hpp())
app.options('*', cors(corsOptions))
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
