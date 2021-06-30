const express = require('express')
var router = express.Router()
const AccountModel = require('../models/account')


// GET -> Lay du lieu tu database
router.get('/', (req, res, next) => {
    AccountModel.find({ })
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).json('Server Error!')
    })
})

router.get('/:id', (req, res, next) => {
    var id = req.params.id
    AccountModel.findById(id)
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(500).json('Server Error!')
    })
})


// POST -> Them moi du lieu vao database
router.post('/', (req, res, next) => {

    var username = req.body.username
    var password = req.body.password

    AccountModel.create({
        username: username,
        password: password
    })
    .then( data => {
        res.json('Create Account Successfully!')
    })
    .catch( err => {
        res.status(500).json('Server Error!')
    })
})

// PUT -> Update du lieu trong database
router.put('/:id', (req, res, next) => {

    var id = req.params.id
    var newPassword = req.body.newPassword

    AccountModel.findByIdAndUpdate(id, {
        password: newPassword
    })
    .then( data => {
        res.json('Update Successfully!')
    })
    .catch( err => {
        res.status(500).json('Server Error!')
    })
})

// DELETE -> Xoa du lieu trong database
router.delete('/:id', (req, res, next) => {
    var id = req.params.id
    AccountModel.deleteOne({
        _id: id
    })
    .then( data => {
        res.json('Delete Successfully!')
    })
    .catch( err => {
        res.status(500).json('Server Error!')
    })
})


module.exports = router