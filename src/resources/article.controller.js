import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()
export const createArticle = async (req, res) => {
    const { title, content } = req.body
    const article  = await prisma.article.create({
        include: {
            author: true
        },
        data: {
            title: title,
            content: content,
            authorId: req.userId
        }
    })
    res.status(201).json({ article })
}

export const getArticle = async (req, res) => {
    const { id } = req.params
    const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: {
            author: true,
        },
    })
    if(!article) {
        return res.status(404).json({
            error: 'Article not found'
        })
    }

    return res.status(200).json({article})
}

export const getAllArticles = async (req, res) => {
    const articles = await prisma.article.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: false,
                    password: false,
                }
            }
        },
    })
    return res.status(200).json({ articles })
}

export const updateArticle = async (req, res) => {
    const { id } = req.params
    const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: {
            author: true,
        },
    })
    if(!article) {
        return res.status(404).json({
            error: 'Article not found'
        })
    }

    //checking if the current authenticated user is the author of this article
    if (article.authorId !== req.userId){
        return res.status(403).json({
            error:'You do not have permission to update this article!'
        })
    }
    const updatedArticle = await prisma.article.update({
        where: { id: parseInt(id) },
        data: {
            title: req.body.title,
            content: req.body.content,
        },
        include: {
            author: true
        }
    })
    return res.status(200).json({
        article: updatedArticle
    })
}

export const deleteArticle = async(req, res) => {
    const { id } = req.params
    const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: {
            author: true,
        },
    })
    if(!article) {
        return res.status(404).json({
            error: 'Article not found'
        })
    }

    //checking if the current authenticated user is the author of this article
    if (article.authorId !== req.userId){
        return res.status(403).json({
            error:'You do not have permission to delete this article!'
        })
    }
    await prisma.article.delete({
        where: { id: parseInt(id) },
    })
    return res.json('Article deleted successfully')
}