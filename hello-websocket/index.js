const express = require('express');
const WebSocket = require('ws');

const PORT = process.argv.length > 2 ? process.argv[2] : 8080;


const server = express().use((req, res) => res.send('Hello world'))
    .listen(PORT, () => console.info(`Listening on ${PORT}`));

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    ws.send('Connected.');

    ws.on('message', data => ws.send(data));

    ws.on('error', err => console.error(err));
});
