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

app.post("/callback", async (req, res) => {
    const code = req.body.code; // Authorization code from Spotify
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI; // Ensure this matches the redirect_uri in the frontend

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, refresh_token } = response.data;

        // Send tokens to the frontend or save them securely for playback
        res.json({ access_token, refresh_token });
    } catch (error) {
        console.error("Error exchanging token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to exchange token" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});