const net = require('net')

let chatServer = net.createServer(),
    clientList = []

chatServer.on('connection', (client) => {
  client.name = `${client.remoteAddress}:${client.remotePort}`
  client.write(`Hi ${client.name}!\n`)
  console.log(`${client.name} joined`)

  clientList.push(client)

  client.on('data', (data) => {
    broadcast(data, client)
  })
  // client.write('Bye!\n')
  client.on('end', () => {
    console.log(`${client.name} quit`)
    clientList.splice(clientList.indexOf(client), 1)
  })
  // client.end()
  client.on('error', (e) => console.log(e))
})

function broadcast (msg, client) {
  let cleanup = []
  for (let i in clientList) {
    if(client !== clientList[i]) {

      if (clientList[i].writable) {
        clientList[i].write(`${client.name} says: ${msg}`)
      } else {
        cleanup.push(clientList[i])
        clientList[i].destroy()
      }
    }
  }
  for (let i in cleanup) {
    clientList.splice(clientList.indexOf(cleanup[i]), 1)
  }
}

chatServer.listen(9000, () => {
  console.log("Chat server started on 9000")
})

// telnet 127.0.0.1 9000
