const db = require("../data/config")

const add = (newUser) => {
    return db("users")
        .insert(newUser)
}

const find = () => {
    return db("users")
        .select("id", "username")
}

const findBy = (filter) => {
    return db("users")
        .select("id", "username", "password")
        .where(filter)
}

const findById = (id) => {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first()
}

module.exports = {
    add,
    find,
    findBy,
    findById
}