# Simple 1-way WebRTC stream

This is an example of connecting a host stream to viewer either on the same computer, or on the same network.

### To try this out *locally* on a browser on the same computer, follow these steps:

- Get started by visiting `index.html` and opening "Be a host" and "Be a viewer" in two seperate windows
- On the **host**, click `Generate a local offer` and allow your mic/cam
- Copy the generated SDP into **viewer**'s left text box and click `Generate a remote answer`
- Copy that generated SDP back into the **host**'s right text box and `Connect!`
- Voila! Now the stream on your **host** should be playing on the **viewer**'s page

### To try this out *locally* on seperate devices on the same network, follow these steps:

- Get started by spinning up a server in the root directory of this project (I use `python3 -m http.server`)
- Visit `index.html` locally and click "Be a host"
- On another device (on the same network), visit your local server (should be the server's device IP address with the port number)
- Hopefully you can see the `index.html` homepage. Now click "Be a viewer"
- Figure out a way to share data between your two devices (I slacked the SDPs to myself)
- On the **host** device, click `Generate a local offer` and allow your mic/cam
- Copy the generated SDP into **viewer** device's left text box and click `Generate a remote answer`
- Copy that generated SDP back into the **host** device's right text box and `Connect!`
- Assuming everything went swimmingly, it should all be working

### To try this out securely over the internets
- Visit marcusmichaels.github.io/webRTC on two devices
- Make one a **host** and one a **viewer**
- Follow the SDP sharing steps above and you're good to go

This is an implementation with no database or signalling server. Ideally, the manual handshakes you just did would be done automagically, but for the sake of education, this is a nice example of how each party talks to each other.

Next step – DIY baby monitor.
