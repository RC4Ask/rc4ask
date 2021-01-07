require('dotenv-safe').config()
const express = require("express")
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const initMongo = require('./config/mongo')
const app = express()
const path = require('path')

// Setup express server port from ENV, default: 5000
app.set('port', process.env.PORT || 5000)

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)

// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// Initialize all other stuff
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(cors())
app.use(helmet())
app.use(compression())
app.listen(app.get('port'))
app.use(require('./routes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "https://rc4ask.herokuapp.com"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });
}

// Init MongoDB
initMongo()
