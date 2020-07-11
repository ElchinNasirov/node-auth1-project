const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const db = require("./data/config")
const KnexSessionStore = require("connect-session-knex")(session)
const usersRouter = require("./users/users-router")

const server = express()

server.use(cors)
server.use(helmet)
server.use(express.json())

server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "This is a secret",
    store: new KnexSessionStore({
        knex: db,
        createtable: true
    })
}))

server.use("/api", usersRouter)

module.exports = server