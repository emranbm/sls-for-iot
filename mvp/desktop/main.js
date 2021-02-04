const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World\n')
})
 
app.listen(3298)