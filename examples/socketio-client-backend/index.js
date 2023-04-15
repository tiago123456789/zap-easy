const io = require("socket.io-client");
const axios = require("axios")

const CLIENT_ID = '77948d87-67a9-4c32-9d33-ccc200cfee61'
const CLIENT_SECRET = '5a8060eb-a17a-4d4a-b101-f312d34d7ebd'
const URL = 'http://localhost:3000/auth/login'

async function run() {
    const { data } = await axios.post(URL, {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET
    })

    const accessToken = data.accessToken;

    const socket = io("http://localhost:3000", {
        transports: ['websocket'],
        extraHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    socket.on("new_message", (data) => {
        console.log(data)
    })

    socket.on("connect", () => console.log("Connected the server successfully"))
    socket.on("disconnect", (data) => console.log(data))
    socket.on('connect_error', err => console.log(err))
    socket.on('connect_failed', err => console.log(err))
    socket.on('disconnect', err => console.log(err))
}


run()