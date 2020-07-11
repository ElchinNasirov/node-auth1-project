const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

// Adds new user(s)
router.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (user) {
            res.status(409).json({ message: "That usarname is not available" })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
        })
        res.json(newUser)
    }
    catch (err) {
        next(err)
    }
})

// Login a registered user
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (!user) {
            return res.status(401).json({ message: "Invalid username" })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" })
        }

        req.session.user = user

        res.json({ message: `Welcome ${user.username}` })
    }
    catch (err) {
        next(err)
    }
})

// Retrieves list of user(s)
router.get("/users", restrict(), async (req, res, next) => {
    try {
        const users = await Users.find()
        res.json(users)
    }
    catch (err) {
        next(err)
    }
})

// Logs out a logged in user
router.get("/logout", async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err)
            }
            else {
                res.status(204).end()
            }
        })
    }
    catch (err) {
        next(err)
    }
})


module.exports = router