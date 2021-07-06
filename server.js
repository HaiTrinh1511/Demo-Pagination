const express = require('express')
const path = require('path')
const router = require('./routers/account')
const AccountModel = require('./models/account')
var accountRouter = require('./routers/account')
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


const app = express()

app.use(cookieParser())

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/account/', accountRouter)

// Middleware CORS -> allow different url can access
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


const PAGE_SIZE = 2


app.get('/user', (req, res, next) => {

    var page = req.query.page // Dang String -- vd: "4"
    if (page) {

        // GET PAGE
        page = parseInt(page)
        if (page < 1) {
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

    } else {
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

// -----GET LOGIN-----
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

// -----POST LOGIN-----
app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
    })
        .then(data => {
            if (data) {
                var token = jwt.sign({
                    _id: data._id
                }, 'pw')
                return res.json({
                    message: 'Login Successfully!',
                    token: token
                })
            }
            else {
                return res.json('Login Failed!')
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json('Server Error!')
        })

})


// XAC THUC LOGIN

var checkLogin = (req, res, next) => {
        // Check Login
        try {
            var token = req.cookies.token
            var idUser = jwt.verify(token, 'pw')
            AccountModel.findOne({
                _id: idUser
            })
            .then(data => {
                if(data){
                    req.data = data
                    next()
                }
                else{
                    res.json('You have not permission!')
                }
            })
            .catch(err => {
                
            })
            
        } catch(err) {
            res.status(500).json('Invalid Token!')
        }
}

var checkStudent = (req, res, next) => {
    var role = req.data.role
    if(role >= 0){
        next()
    }
    else{
        res.json('You have not permission!')
    }
}

var checkTeacher = (req, res, next) => {
    var role = req.data.role
    if(role >= 1){
        next()
    }
    else{
        res.json('You have not permission!')
    }
}

var checkManager = (req, res, next) => {
    var role = req.data.role
    if(role >= 2){
        next()
    }
    else{
        res.json('You have not permission!')
    }
}

app.get('/task', checkLogin, checkStudent, (req, res, next) => {

    res.json('ALL TASK')
})

app.get('/student', checkLogin, checkTeacher, (req, res, next) => {
    next()
}, (req, res, next) => {
    res.json('STUDENT')
})

app.get('/teacher', checkLogin, checkManager, (req, res, next) => {
    next()
}, (req, res, next) => {
    res.json('TEACHER')
})

app.get('/manager', checkLogin, checkStudent, checkTeacher, checkManager, (req, res, next) => {
    next()
}, (req, res, next) => {
    res.json('MANAGER')
})


app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
})