import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import inquirer from 'inquirer'
import DHT from 'hyperdht'

clear()
console.log(
    chalk.blueBright(
        figlet.textSync('P2P Chat App', { font: 'Ghost' })
    )
)

const inquire = async () => {
    const questions = [
        {
            name: 'serverPubKey',
            type: 'input',
            message: "Enter server's public key: ",
            validate: function (value) {
                if (value.length) {
                    return true
                } else {
                    return 'Please enter server public key.'
                }
            }
        },
        {
            name: 'username',
            type: 'input',
            message: "Enter your username: ",
            validate: function (value) {
                if (value.length) {
                    return true
                } else {
                    return 'Please enter your username.'
                }
            }
        },
        {
            name: 'connectToPeer',
            type: 'confirm',
            message: 'Do you want to connect to a peer?',
        }
    ]

    const ans = await inquirer.prompt(questions)
    return ans
}

const inputMessage = async (username) => {
    const ans = await inquirer.prompt([
        {
            name: 'message',
            type: 'input',
            message: `Enter your message for ${username}: `,
            validate: function (value) {
                if (value.length) {
                    return true
                } else {
                    return 'Please enter your message.'
                }
            }
        }
    ])
    const { message } = ans
    const data = JSON.stringify({ action: 'chat', data: { message } })
    return data
}

const connect = async (serverPubKey, username, peerUsername) => {
    const node = new DHT()
    const server = node.createServer()
    await server.listen(node.defaultKeyPair)

    server.on('connection', (socket) => {
        let toUsername = null
        socket.on('data', async (buffer) => {
            const jsonData = JSON.parse(buffer.toString())
            const { action, data } = jsonData

            if (action === 'chat_connected') {
                const { username } = data
                if (!username) {
                    console.log(`\n❌ Couldn't connect chat to ${username}`)
                }
                toUsername = username
                console.log(`\n💬 Chat connected to ${username}\n`)
            }

            if (action === 'chat') {
                const { message } = data
                if (!message) return
                console.log(`Reply from ${toUsername}: ${message}`)
                const input = await inputMessage(toUsername)
                socket.write(input)
            }
        })
    })

    serverPubKey = Buffer.from(serverPubKey, 'hex')
    const encryptedSocket = node.connect(serverPubKey)

    encryptedSocket.on('open', () => {
        const data = JSON.stringify({ action: 'add_username', data: { username } })
        encryptedSocket.write(data)

        if (peerUsername) {
            const peerData = JSON.stringify({ action: 'peer_discovery', data: { username: peerUsername } })
            encryptedSocket.write(peerData)
        }
    })

    encryptedSocket.on('data', (buffer) => {
        const jsonData = JSON.parse(buffer.toString())
        const { action, data } = jsonData

        if (action === 'connect') {
            const { pubKey } = data
            if (!pubKey) return
            const peerSocket = node.connect(Buffer.from(pubKey, 'hex'))
            peerSocket.on('open', async () => {
                console.log(`\n💬 Chat connected to ${peerUsername}\n`)
                const data = JSON.stringify({ action: 'chat_connected', data: { username } })
                peerSocket.write(data)

                const message = await inputMessage(peerUsername)
                peerSocket.write(message)
            })

            peerSocket.on('data', async (buffer) => {
                const jsonData = JSON.parse(buffer.toString())
                const { action, data } = jsonData


                if (action === 'chat') {
                    const { message } = data
                    if (!message) return
                    console.log(`Reply from ${peerUsername}: ${message}`)
                    const input = await inputMessage(peerUsername)
                    peerSocket.write(input)
                }
            })
        }
    })
}

const main = async () => {
    const ans = await inquire()
    const { serverPubKey, username, connectToPeer } = ans
    let peerUsername = null
    if (connectToPeer) {
        const ans = await inquirer.prompt([
            {
                name: 'peerUsername',
                type: 'input',
                message: "Enter peer's username you want to connect to: ",
                validate: function (value) {
                    if (value.length) {
                        return true
                    } else {
                        return 'Please enter peer username.'
                    }
                }
            },
        ])
        peerUsername = ans.peerUsername
    }

    connect(serverPubKey, username, peerUsername)
}

main()