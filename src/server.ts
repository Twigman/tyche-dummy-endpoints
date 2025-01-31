import { WebSocketServer } from 'ws';
import { updates } from './dummyUpdates';
import { lights } from './dummyInitLights';
import { sensors } from './dummyInitSensor';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const WS_PORT = 8383;
const wsServer = new WebSocketServer({ port: WS_PORT });

const REST_PORT = 8382;
const app = express();

app.use(express.json());

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

app.use(cors());

// REST API

app.get('/api/lights', (req, res) => {
    res.json(lights);
});

app.get('/api/sensors', (req, res) => {
    res.json(sensors);
})

app.listen(REST_PORT, () => {
    console.log(`REST API available on http://localhost:${REST_PORT}`);
})

// WebSocket

wsServer.on('connection', (ws) => {
    console.log('Client connected');

    const sendRandomUpdate = () => {
        if (ws.readyState == WebSocket.OPEN) {
            const updateMsg = getRandomUpdate();

            ws.send(JSON.stringify(updateMsg));
            console.log(`update: ${updateMsg}`);

            // delay between 5 and 10 s
            const delay = Math.random() * 5000 + 5000;
            console.log(`New update in ${delay} s`);

            setTimeout(sendRandomUpdate, delay);
        }
    };

    sendRandomUpdate();

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


const getRandomUpdate = () => {
    const randomIndex = Math.floor(Math.random() * updates.length);
    return updates[randomIndex];
};

console.log(`WebSocket Server running on ws://localhost:${WS_PORT}`);