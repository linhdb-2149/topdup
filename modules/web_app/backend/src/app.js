import bodyParser from 'body-parser'
import express from 'express'
import { Server } from 'http'
import routes from './routes'
const cors = require('cors')
const winston = require('winston')
const morgan = require('morgan')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.colorize()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}


// import hpp from 'hpp'
// import xXssProtection from 'x-xss-protection'
require('dotenv').config()
const app = express()
const port = process.env.PORT || '5000'
app.use(cors())
app.options('*', cors())  // enable pre-flight
// Add extra config to solve CROS prob.
// TODO: check if its safe!!!
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json())

// Using the logger and its configured transports,
// to save the logs created by Morgan
morgan.token('error', (req, res) => {
  console.log(res.headers)
  const jsonResponse = res.jsonResponse || {}
  return jsonResponse.message
})

const customizedToken = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens.error(req, res), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}

app.use(morgan(customizedToken, {
  skip: (req, res) => res.statusCode === 200,
  stream: { write: (message) => logger.error(message) }
}))

app.use(morgan(customizedToken, {
  skip: (req, res) => res.statusCode !== 200,
  stream: { write: (message) => logger.info(message) }
}))

export const server = Server(app)

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(hpp())
// app.use(xXssProtection());
// app.use(logger(':method :status :url :date[iso] :response-time', { stream: accessLogStream }));


app.use('/', routes)
/* ----------  Errors  ---------- */
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const jsonResponse = { message: 'API Not Found' }
  res.jsonResponse = jsonResponse
  res.status(404).json(jsonResponse)
  next(res)
})

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  const jsonResponse = { message: err }
  res.jsonResponse = jsonResponse
  res.status(err.status || 500).json(jsonResponse)
})

/**
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    const jsonResponse = { message: err }
    res.jsonResponse = jsonResponse
    res.status(err.status || 500).json(jsonResponse)
  })
}

/**
 * production error handler
 * no stacktraces leaked to user
 */
app.use((err, req, res) => {
  const jsonResponse = { message: err }
  res.status(err.status || 500).json(jsonResponse)
  res.jsonResponse = jsonResponse
})

process.on('unhandledRejection', error => {
  // Will print 'unhandledRejection err is not defined'
  console.log('unhandledRejection', error)
})
server.listen(port)

exports.app = app
exports.server = server
exports.logger = logger
