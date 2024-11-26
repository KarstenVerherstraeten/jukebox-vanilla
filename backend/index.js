import cors from 'cors';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/get-token", async (_, res) => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    const body = new URLSearchParams({
        grant_type: 'client_credentials'
    });

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            body.toString(),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded", // Fixed the header format
                },
                
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/get-playlist", async (_, res) => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const token = tokenResponse.data.access_token;
        const response = await axios.get(
            "https://api.spotify.com/v1/playlists/0muZPQlMO0e0eCcFS3RJyF/tracks",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});