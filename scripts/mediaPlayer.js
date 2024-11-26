window.onSpotifyWebPlaybackSDKReady = () => {
    const token =
        "BQDztrfzzCha5DGSSytcnebxIlGLdsGJ5Uau2bVRHQriRiFzN_xKmQxblxKSxHznfNof9PWD5gPcPkKGWbl-p5kkvZDGtSyjlyE4cCDrIUJUUo3wA7qC6QNHwyTXfQVNmWgAGaZP2vhjDnneWe4K0YXPP05SaIqA_CsToUSl_9CR4bk2umpXNg4TQgWiyc3-x0r2zn7VsokluqiJ05h3mgD8sGkEm4xIDg";
    const player = new Spotify.Player({
        name: "Jukebox",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
    });


    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    

    // button handlers
    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
        console.log('Toggled playback!');
      };
      

    player.connect();
};
