const RAM = require('random-access-memory')
const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const DHT = require('hyperdht')

const connect = async () => {
    const core = new Hypercore((filename) => {
        return new RAM()
    })
    const db = new Hyperbee(core)
    await db.ready()
    console.log('✅ Database Connected!')
    return db
}

const main = async () => {
    const db = await connect()
    const usernames = db.sub("usernames")
    const node = new DHT()

    const keyPair = DHT.keyPair()
    const { publicKey } = keyPair
    const remotePublicKey = publicKey.toString('hex')

    const server = node.createServer()
    await server.listen(keyPair)

    console.log(
        "🚧 Starting ",
        process.env.NODE_ENV == "production" ? "production" : "development",
        "Environment"
    );
    console.log("\n🔑 Public Key")
    console.log(remotePublicKey)


    server.on('connection', (socket) => {
        socket.on('data', async (buffer) => {
            const jsonData = JSON.parse(buffer.toString())
            const { action, data } = jsonData

            // add username to database (initial communication)
            if (action === 'add_username') {
                const pubKey = socket.remotePublicKey.toString('hex')
                const { username } = data
                if (!username) return
                console.log('\n✅ User added to database')
                console.log('👤 Username:', username)
                console.log('🔑 Public Key:', pubKey)
                usernames.put(username, pubKey)
            }

            // connect to peer (peer discovery)
            if (action === 'peer_discovery') {
                const { username } = data
                if (!username) return
                const { value } = await usernames.get(username)
                const pubKey = value.toString()
                socket.write(JSON.stringify({ action: 'connect', data: { pubKey } }))
            }
        })
    })
}

main()

