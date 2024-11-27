"use strict";

let tracks = []; // Store tracks
let currentTrackIndex = 0; // Current track index

fetch("http://localhost:5001/get-playlist")
    .then((response) => response.json())
    .then((data) => {
        tracks = data.items.map((item) => ({
            name: item.track.name,
            artist: item.track.artists[0].name,
            image: item.track.album.images[0]?.url || "",
            uri: item.track.uri, // Store Spotify URI for playback
        }));
        updateSongDisplay(); // Display the first song
    })
    .catch((error) => console.error("Fetch error:", error));

function updateSongDisplay() {
    if (tracks.length > 0) {
        document.getElementById("albumCover").src = tracks[currentTrackIndex]?.image || "";
        document.getElementById("songName").textContent = tracks[currentTrackIndex]?.name || "Unknown";
        document.getElementById("artist").textContent = `Artist: ${tracks[currentTrackIndex]?.artist || "Unknown"}`;
    }
}

document.getElementById("next").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    updateSongDisplay();
    playCurrentTrack(); // Play the newly selected song
});

document.getElementById("previous").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    updateSongDisplay();
    playCurrentTrack(); // Play the newly selected song
});

// Function to communicate the current track URI to the playback SDK
function playCurrentTrack() {
    const currentTrack = tracks[currentTrackIndex];
    if (window.playTrack) {
        window.playTrack(currentTrack.uri); // Call the playback function defined in `mediaPlayer.js`
    }
}