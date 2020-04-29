const os = require('os')
const cluster = require('cluster')
const app = require('./app')
const numOfCpus = os.cpus.length
if (cluster.isMaster) {
  console.log(`Master worker with pid ${process.pid} started successfully`)
  for (let i = 0; i < numOfCpus; i++) {
    cluster.fork()
  }
} else {
  console.log(`Master worker with pid ${process.pid} started successfully`)
}
