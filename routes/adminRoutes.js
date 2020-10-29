const express = require('express')
//const dataModule = require('../modules/mysqlDataModal')

const adminRouter = express.Router()
adminRouter.use((req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        //next()
        res.redirect('/')
    }
})

module.exports = adminRouter