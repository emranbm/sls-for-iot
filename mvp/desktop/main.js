const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello!\n')
})
 
app.listen(3298)