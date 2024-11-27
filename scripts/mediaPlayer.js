window.onSpotifyWebPlaybackSDKReady = () => {
    const token = "BQDy9iXlAFkLlFDHy_xny6-sprZ_4kcvq27B4ufTb3b0pXLQC5EJ4emBuQz3zRpNjoN5KDPuXE1bmfvz1lpdFybDTs-ivFTQ3pUlysD1yR4CjWipF4DXVwuP02D8JhDBBBG7hseWwWGVw59Fm19-q2GRNsyVPtflWTC7vSnK4kPRCv_AuiAGsYOhDyj6rNaMdr0Ji7WyHgs73SRK2TLmWG5gMcMKjGQTAw"; // Replace with your Spotify access token
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