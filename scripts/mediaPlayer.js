window.onSpotifyWebPlaybackSDKReady = () => {
    const token = "BQD3-JKQcLfehL67YTNnJ20qJA7SzbrmAQHm-6ANLsFzXNeB2PH02xn6jgR2fy7fwaV6LWFNBuGhd9aeogitjCLT4CGnaX-XNhnBULtQuB2TilIzEMBzbXY2eltqeRbQDJCH33xpHNHG1pSKiZtWbMadviHuw9poc6B6wol9b8yPineu94ktP8i9O_7x4BkrvdcNDdmc9auvFtQ24jheYcmYTDg01vdTiA"; // Replace with your Spotify access token
    const player = new Spotify.Player({
        name: "Jukebox",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
    });

    let deviceId = null;

    // Ready
    player.addListener("ready", ({ device_id }) => {
        deviceId = device_id;
        console.log("Ready with Device ID", device_id);
    });

    // Handle Errors
    player.addListener("initialization_error", ({ message }) => console.error(message));
    player.addListener("authentication_error", ({ message }) => console.error(message));
    player.addListener("account_error", ({ message }) => console.error(message));

    // Play a specific track
    window.playTrack = (trackUri) => {
        if (!deviceId) {
            console.error("Device ID not available");
            return;
        }
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [trackUri] }), // Play the track URI
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Playing track: ${trackUri}`);
                } else {
                    console.error("Playback error:", response.statusText);
                }
            })
            .catch((error) => console.error("Playback fetch error:", error));
    };

    // Button handlers
    document.getElementById("togglePlay").onclick = () => {
        player.togglePlay();
        
        console.log("Toggled playback!");
    };

    player.connect();
};