const express = require('express')
const path = require('path')
const router = require('./routers/account')
const AccountModel = require('./models/account')
var accountRouter = require('./routers/account')
const app = express()


app.use('/public', express.static(path.join(__dirname, 'public')))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/register', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username
    })
        .then(data => {
            if (data) {
                return res.json('Username exists!')
            }
            else {
                return AccountModel.create({
                    username: username,
                    password: password
                })
            }
        })
        .then(data => {
            res.json('Create Successfully!')
        })
        .catch(err => {
            res.status(500).json('Create Failed!')
        })
})

app.post('/login', (req, res, next) => {

    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            if (data) {
                return res.json('Login Successfully!')
            }
            else {
                res.status(300).json('Login Failed!')
            }
        })
        .catch(err => {
            res.status(500).json('Server Crashed!')
        })

})


app.use('/api/account/', accountRouter)


const PAGE_SIZE = 2

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/user', (req, res, next) => {

    var page = req.query.page // Dang String -- vd: "4"
    if (page){

        // GET PAGE
        page = parseInt(page) 
        if(page < 1){
            page = 1
        }
        var numberSkip = (page - 1) * PAGE_SIZE  // skip 6 phan tu

        AccountModel.find({})
        .skip(numberSkip)
        .limit(PAGE_SIZE)   // 1 page chi co 2 phan tu
        .then(data => {

            AccountModel.countDocuments({}).then((total) => {
                var totalPage = Math.ceil(total / PAGE_SIZE)
                res.json({
                    total: total,
                    totalPage: totalPage,
                    data: data
                })
            })

        })
        .catch(err => {
            res.status(500).json('Server Error!')
        })

    } else{
        // GET ALL
        AccountModel.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(500).json('Server Error!')
            })
    }
})




app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
})