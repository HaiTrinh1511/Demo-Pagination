var jwt = require('jsonwebtoken')
var data = {username: 'TrinhHai'}


// jwt.sign(data, 'TrinhHai', {expiresIn: 30}, function(err, data){
//     console.log('data', data)
// })

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRyaW5oSGFpIiwiaWF0IjoxNjI1MTQ2NzQ1LCJleHAiOjE2MjUxNDY3NzV9.KbaeaKszpxm21rSsXhmwk8qY2ErOYwlclj_ApJ1BOf0'

var result = jwt.verify(token, 'TrinhHai')

console.log(result)