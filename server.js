const http = require('http');
const https = require('https');
const app = require('./app');
const fs = require('fs')
const path = require('path')

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const isHTTP = process.env.NODE_ENV !== 'prod'

// const server = http.createServer(app);

// start http or https server
const server = isHTTP ?
  // http config
  http.createServer(app) :
  // otherwise https config
  https.createServer({
    // options https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
    // https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
    key: fs.readFileSync(path.resolve("/home/ubuntu/live/matouba-portfolio.fr/privkey.pem")),
    cert: fs.readFileSync(path.resolve("/home/ubuntu/live/matouba-portfolio.fr/cert.pem")),
    ca: fs.readFileSync(path.resolve("/home/ubuntu/live/matouba-portfolio.fr/chain.pem"))
  }, app)

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
