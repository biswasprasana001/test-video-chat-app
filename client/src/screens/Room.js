import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/socketProvider'
import ReactPlayer from 'react-player/lazy'
import peer from '../service/peer'

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room ${id}`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const offer = await peer.getOffer();
        socket.emit('call:user', { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [socket, remoteSocketId])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        console.log(`Incoming call from ${from} with offer ${offer}`);
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans });
    }, [socket]);

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(({ from, ans }) => {
        console.log(`Call accepted from ${from} with answer ${ans}`);
        sendStreams();
    }, [sendStreams]);

    const handleNegotionNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needeed', { offer, to: remoteSocketId });
    }, [socket, remoteSocketId]);

    const handleNegoNeedIncoming = useCallback(async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans });
    }, [socket, remoteSocketId]);

    const handleNegoNeedFinal = useCallback(({ ans }) => {
        peer.setLocalDescription(ans);
    }, [socket, remoteSocketId]);

    useEffect(() => {
        peer.peer.addEventListener('negotionneeded', handleNegotionNeeded)
        return () => {
            peer.peer.removeEventListener('negotionneeded', handleNegotionNeeded)
        }
    }, [handleNegotionNeeded])

    useEffect(() => {
        peer.peer.addEventListener('track', async ({ streams: [remoteStream] }) => {
            setRemoteStream(remoteStream[0]);
        })
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined);
        socket.on('incoming:call', handleIncomingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('peer:nego:needeed', handleNegoNeedIncoming);
        socket.on('peer:nego:final', handleNegoNeedFinal);
        return () => {
            socket.off('user:joined', handleUserJoined);
            socket.off('incoming:call', handleIncomingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needeed', handleNegoNeedIncoming);
            socket.off('peer:nego:final', handleNegoNeedFinal);
        };

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

    return (
        <div>
            <h1>Room</h1>
            <h4>{remoteSocketId ? 'Someone is in the room' : 'No one is in the room'}</h4>
            {/* {myStream && <button onClick={sendStreams}>Send Streams</button>} */}
            {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
            {
                myStream && <ReactPlayer url={myStream} playing={true} width={"25%"} height={"25%"} />
            }
            {
                remoteStream && <ReactPlayer url={remoteStream} playing={true} width={"25%"} height={"25%"} />
            }
        </div>
    )
}

export default Room