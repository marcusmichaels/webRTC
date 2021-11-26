const localSDPTextArea = document.getElementById("local-sdp");
const remoteSDPTextArea = document.getElementById("remote-sdp");

const localVideoEl = document.querySelector(".video.local");

// STEP ONE, create the local connection, data channel, and offer
const createLocalConnection = async () => {
  // Create a new local connection object
  lc = new RTCPeerConnection();

  // Listen for new ice candidate SDPs from local connection
  lc.onicecandidate = (e) => {
    // populate textarea with local SDP value (overwrites each previous ice candidate)
    localSDPTextArea.innerHTML = JSON.stringify(lc.localDescription);
    console.log(`New ice candidate: ${JSON.stringify(lc.localDescription)}`);
  };

  // Handles data channel creation and event listeners
  setUpDataChannel();

  // Handles A/V bits and adds tracks to the local connection
  await setUpLocalStream();

  // Generate local connection's SDP offer
  const localOffer = await lc.createOffer();

  // Set offer to local connection's description
  await lc.setLocalDescription(localOffer);

  console.log("Local connection setup");
};

const setUpDataChannel = () => {
  // Create a data channel from the local connection
  dc = lc.createDataChannel("channel");

  // Monitor when connection opens/closes on data channel
  dc.onopen = (e) => console.log("Connection opened");
  dc.onclose = (e) => console.log("Connection closed");

  // Print incoming messages on data channel
  dc.onmessage = (e) => console.log(`Remote msg: ${e.data}`);

  // Send message from local connection to data channel
  // dc.send("Hello remote!");
};

const setUpLocalStream = async () => {
  // Get user's audio/video and stream it to the local <video>
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // Assign the stream to the public window object and local <video>
  window.localStream = localStream;
  localVideoEl.srcObject = localStream;

  // Add track to local connection
  for (const track of localStream.getTracks()) {
    lc.addTrack(track);
    console.log(`Using video device: ${track.label}`);
  }
};

// STEP TWO is handled in remoteConnection.js

// STEP THREE, add the SDP from the remote connection to our local remote description
const connectLocalToRemoteConnection = async (answer) => {
  // Answer needs to be se on the local connection's remote description, but this can only happen when a remote connection has created their SDP.
  await lc.setRemoteDescription(answer);
};

const handleLocalConnection = () => {
  // This info should be handled by signalling server instead of grabbing it from a textarea
  connectLocalToRemoteConnection(JSON.parse(remoteSDPTextArea.value));
};

const closeLocalConnection = async () => {
  await dc.send("Bye bye");
  lc.close();
  window.localStream.getTracks().forEach((track) => track.stop());
};
