const { resolve } = require('path')
require('dotenv').config({ path: resolve('../.env') })

const RAM = require('random-access-memory')
const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const DHT = require('hyperdht')

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const morgan = require('morgan')
const cors = require('cors')

app.use(morgan(process.env.NODE_ENV == "production" ? "common" : "dev"));
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    res.json({ app: "P2P chat app using Holepunch 🚀" })
})

const connect = async () => {
    const core = new Hypercore((filename) => {
        return new RAM()
    })
    const db = new Hyperbee(core)
    await db.ready()
    console.log('✅ Database Connected!')
    return db
}

const cas = (prev, next) => {
    console.log("prev: ", prev.value)
    console.log("next: ", next.value)
    return true
}

const main = async () => {
    const db = await connect()
    const usernames = db.sub("usernames")
    const node = new DHT()

    const keyPair = DHT.keyPair()
    const { publicKey } = keyPair
    const remotePublicKey = publicKey.toString('hex')
    app.get('/pubkey', async (req, res) => {
        const { api_key } = req.headers
        if (api_key !== process.env.API_KEY) return res.status(401).json({ error: "Unauthorized" })
        res.json({ publicKey: remotePublicKey })
    })

    const server = node.createServer()
    await server.listen(keyPair)

    console.log(
        "🚧 Starting ",
        process.env.NODE_ENV == "production" ? "production" : "development",
        "Environment"
    );

    app.listen(PORT, "0.0.0.0", () => {
        console.log("🚀 App listening on port", PORT);
    });

    server.on('connection', (socket) => {
        socket.on('data', async (buffer) => {
            const jsonData = JSON.parse(buffer.toString())
            const { action, data } = jsonData

            // add username to database (initial communication)
            if (action === 'add_username') {
                const pubKey = socket.remotePublicKey.toString('hex')
                const { username } = data
                if (!username) return
                console.log(username, pubKey)
                usernames.put(username, pubKey, cas)
            }

            // connect to peer (peer discovery)
            if (action === 'peer_discovery') {
                const { username } = data
                if (!username) return
                const { value } = await usernames.get(username)
                const pubKey = value.toString()
                console.log(pubKey)
                socket.write(JSON.stringify({ action: 'connect', data: { pubKey } }))
            }
        })
    })
}

main()

