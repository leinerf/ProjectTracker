// create tables
import db from "../index.js"

Object.keys(db).forEach(table => {
    db[table].sync()
})