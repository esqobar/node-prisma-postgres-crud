import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

export const registerUser = async (req, res) => {
    const { email, password, name } = req.body

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(user) {
        return res.status(400).json('User already exists!')
    }

    const createdUser = await prisma.user.create({
        data: {
            name, email, password: hashedPassword
        },
    })

    return res.status(201).json({
        user: createdUser
    })
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if(!user) {
        return res.status(404).json('User not found!')
    }

    if(user) {
        const comparePassword = bcrypt.compareSync(password, user.password)

        if (comparePassword) {
            const payload = {
                userId: user.id,
            }
            jwt.sign(
                payload, process.env.JWT_SECRET,{
                    expiresIn: '30d',
                },
                (err, token) => {
                    if(err || !token){
                        return res.status(401).json('Token not found!')
                    }
                    return res.status(200).json({
                        token: token
                    })
                }
            )
        }
    }

}

export const getUser =  async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.userId
        },
    })

    if(!user) {
        return res.status(404).json('User not found!')
    }

    return res.status(200).json({ user })
}

export const getAllUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            articles: true
        },
    })

    return res.status(200).json({ users })
}

export const updateUser = async (req, res) => {
    const { email, name } = req.body
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id },
    })

    if(!user) {
        return res.status(404).json({
            error: 'You do not have permission to delete this user!'})
    }

    if(req.userId === user.id) {
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: {
                name, email
            }
        })
    }

    return res.status(200).json({ user: updatedUser })
}

export const deleteUser = async (req, res) => {
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: { id },
    })

    if(!user) {
        return res.status(404).json({
            error: 'You do not have permission to delete this user!'})
    }

    if(req.userId === user.id) {
        await prisma.article.delete({
            where: { id: req.userId },
        })
    }

    return res.status(200).json('User deleted successfully')
}