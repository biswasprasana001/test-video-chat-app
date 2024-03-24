// We're importing the React library, along with the useState, useCallback, and useEffect hooks.
import React, { useState, useCallback, useEffect } from 'react';
// We're importing the useNavigate hook from 'react-router-dom', which allows us to programmatically navigate through our app.
import { useNavigate } from 'react-router-dom';
// We're importing the useSocket custom hook from our context. This hook provides us with the socket instance we need for real-time communication.
import { useSocket } from '../context/socketProvider';

// We're defining a functional component called Lobby.
export default function Lobby() {

    // We're using the useState hook to create state variables for email and room, and their corresponding setter functions.
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');

    // We're getting the socket instance and the navigate function using our custom hooks.
    const socket = useSocket();
    const navigate = useNavigate();

    // We're defining a function called handleSubmit using the useCallback hook. This function will be called when the form is submitted.
    const handleSubmit = useCallback((e) => {
        // We're preventing the default form submission behavior.
        e.preventDefault();
        // We're emitting a 'join' event on the socket, along with the email and room data.
        socket.emit('join', { email, room });
    }, [email, room, socket]);

    // We're defining a function called handleJoinRoom using the useCallback hook. This function will be called when a 'join' event is received on the socket.
    const handleJoinRoom = useCallback((data) => {
        // We're extracting the email and room from the data received.
        const { email, room } = data;
        // We're navigating to the room page.
        navigate(`/room/${room}`);
    }, []);

    // We're using the useEffect hook to add and remove event listeners on the socket.
    useEffect(() => {
        // When the component mounts, we're adding a 'join' event listener on the socket.
        socket.on('join', handleJoinRoom);
        // When the component unmounts, we're removing the 'join' event listener from the socket.
        return () => socket.off('join', handleJoinRoom);
    }, [socket, handleJoinRoom]);

    // The component returns a JSX element.
    return (
        // We're creating a div element.
        <div>
            {/* Inside the div, we're creating a heading and a form. */}
            <h1>Lobby</h1>
            <form onSubmit={handleSubmit}>
                {/* The form contains two labels and inputs for email and room, and a submit button. */}
                <label htmlFor='email'>Email ID</label>
                <input type='email' id='email' value={email} onChange={e => setEmail(e.target.value)} />
                <br />
                <label htmlFor='room'>Room No.</label>
                <input type='text' id='room' value={room} onChange={e => setRoom(e.target.value)} />
                <br />
                <button type='submit'>Join</button>
            </form>
        </div>
    );
}