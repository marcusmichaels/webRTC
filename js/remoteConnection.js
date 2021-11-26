const localSDPTextArea = document.getElementById("local-sdp");
const remoteSDPTextArea = document.getElementById("remote-sdp");
const remoteVideoEl = document.querySelector(".video.remote");
let inboundStream = null;

// STEP TWO, create a remote connection, set the local offer to its description, and generate a remote answer
const createRemoteConnection = async (localOffer) => {
  // Use the value in the local SDP textarea box if localOffer isn't found (needs moving to the signalling server)
  localOffer = localOffer || JSON.parse(localSDPTextArea.value);

  // Create a new remote connection object
  rc = new RTCPeerConnection();

  // Print ice candidate's SDP from remote connection
  rc.onicecandidate = (e) => {
    // populate textarea with remote SDP value (overwrites each previous ice candidate)
    remoteSDPTextArea.innerHTML = JSON.stringify(rc.localDescription);
    console.log(`New ice candidate: ${JSON.stringify(rc.localDescription)}`);
  };

  // Add event listeners to data channel
  rc.ondatachannel = (e) => {
    rc.dc = e.channel;
    rc.dc.onopen = () => console.log("Connection opened");
    rc.dc.onclose = (e) => console.log("Connection closed");
    rc.dc.onmessage = (e) => {
      if (e.data === "Bye bye") {
        closeRemoteConnection();
      }
      console.log(`Local msg: ${e.data}`);
    };

    // Send message from remote connection to data channel
    // rc.dc.send("Hello local!");
  };

  // Listen for tracks on the incoming connection
  rc.ontrack = (e) => {
    console.log(`Incoming streams ${e}`);
    if (e.streams && e.streams[0]) {
      remoteVideoEl.srcObject = e.streams[0];
    } else {
      if (!inboundStream) {
        inboundStream = new MediaStream();
        remoteVideoEl.srcObject = inboundStream;
      }
      inboundStream.addTrack(e.track);
    }
  };

  // Set remote description on remote connection with 'localOffer'
  await rc.setRemoteDescription(localOffer);
  console.log("Remote description set");

  // Create remote answer for local description
  const answer = await rc.createAnswer();

  // Set local description on remote connection with 'answer'
  await rc.setLocalDescription(answer);
  console.log("Answer created");
};

const closeRemoteConnection = async () => {
  await rc.dc.send("Bye bye");
  rc.close();
  inboundStream.getTracks().forEach((track) => track.stop());
  inboundStream = null;
};
