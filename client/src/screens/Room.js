// We're importing the React library, along with the useState, useCallback, and useEffect hooks.
import React, { useCallback, useEffect, useState } from 'react'
// We're importing the useSocket custom hook from our context. This hook provides us with the socket instance we need for real-time communication.
import { useSocket } from '../context/socketProvider'

// We're defining a functional component called Room.
const Room = () => {
    // We're getting the socket instance using our custom hook.
    const socket = useSocket();
    // We're using the useState hook to create a state variable for remoteSocketId, and its corresponding setter function.
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    // We're defining a function called handleUserJoined using the useCallback hook. This function will be called when a 'user:joined' event is received on the socket.
    const handleUserJoined = useCallback(({email, id}) => {
        // We're logging the email and room ID of the user who joined.
        console.log(`Email ${email} joined room ${id}`);
        // We're setting the remoteSocketId state variable to the ID of the user who joined.
        setRemoteSocketId(id);
    }, [])

    // We're using the useEffect hook to add and remove event listeners on the socket.
    useEffect(() => {
        // When the component mounts, we're adding a 'user:joined' event listener on the socket.
        socket.on('user:joined', handleUserJoined);
        // When the component unmounts, we're removing the 'user:joined' event listener from the socket.
        return () => socket.off('user:joined', handleUserJoined);
    }, [socket, handleUserJoined])

    // The component returns a JSX element.
    return (
        // We're creating a div element.
        <div>
            // Inside the div, we're creating a heading and a paragraph.
            <h1>Room</h1>
            // The paragraph displays a message based on whether remoteSocketId is truthy or falsy.
            <h4>{remoteSocketId ? 'Someone is in the room' : 'No one is in the room'}</h4>
        </div>
    )
}

// We're exporting the Room component as the default export of this module.
export default Room