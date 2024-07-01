import express from 'express'
import morgan from 'morgan'
import colors from 'colors'
import UserRoutes from './routes/user.routes.js'
import ArticleRoutes from './routes/article.routes.js'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/articles', ArticleRoutes)

const PORT = 8888
app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`.bold.green)
})