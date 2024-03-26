/* 
 * This class represents a service for establishing a peer-to-peer connection
 * using the WebRTC protocol. It uses the RTCPeerConnection object to set up
 * the connection.
 */
class PeerService {
    // Constructor for the PeerService class.
    constructor() {
        // Check if a peer connection object already exists, and if not,
        // create a new one.
        if (!this.peer) {
            // Create a new RTCPeerConnection object with a list of ICE servers.
            // ICE (Interactive Connectivity Establishment) servers are used
            // to establish a connection between the peers.
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        // List of STUN servers to use for ICE.
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478'
                        ]
                    }
                ]
            });
        }
    }

    async getAnswer (offer) {
        // Check if a peer connection object exists.
        if(this.peer) {
            // Set the remote description of the peer connection to the offer.
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            // Create an answer from the peer connection.
            const answer = await this.peer.createAnswer();
            // Set the local description of the peer connection to the answer.
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            // Return the answer.
            return answer;
        }
    }

    async setLocalDescription (ans) {
        // Check if a peer connection object exists.
        if(this.peer) {
            // Set the remote description of the peer connection to the answer.
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    /*
     * Get an offer from the peer connection. This method will create an
     * offer, set the local description of the peer connection to that offer,
     * and return the offer.
     */
    async getOffer() {
        // Check if a peer connection object exists.
        if(this.peer) {
            // Create an offer from the peer connection.
            const offer = await this.peer.createOffer();
            // Set the local description of the peer connection to the offer.
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            // Return the offer.
            return offer;
        }
    }
}

// Export a single instance of the PeerService class.
export default new PeerService();