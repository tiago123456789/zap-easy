const io = require("socket.io-client");
const axios = require("axios")

const CLIENT_ID = '77c5a19a-e20e-4a09-b107-6dd5bc3f7bbe'
const CLIENT_SECRET = 'cbf387ad-7494-4ecf-ac65-de50df297742'
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