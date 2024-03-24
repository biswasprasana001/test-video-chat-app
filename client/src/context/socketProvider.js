// We're importing some tools from the 'react' library. These tools help us manage and share data in our app.
import { createContext, useContext, useMemo } from 'react';

// We're also importing the 'io' function from 'socket.io-client'. This function allows us to establish a connection to a server.
import { io } from 'socket.io-client';

// We're creating a new context for our socket. This is like a global variable that any part of our app can access.
const socketContext = createContext(null);

// This is a custom hook that lets us easily grab the current socket from anywhere in our app.
export const useSocket = () => {
    // We're using the 'useContext' hook from React to access our socket context.
    const socket = useContext(socketContext);
    // We return the socket so that whoever uses this hook gets the socket.
    return socket;
}

// This is a component that provides the socket to all components inside of it.
export const SocketProvider = (props) => {
    // We're using the 'useMemo' hook to create our socket only once and then store it.
    // This way, we don't create a new socket every time our component re-renders.
    const socket = useMemo(() => io('http://localhost:4000'), [])

    // We're returning a special kind of component called a Provider.
    // This Provider takes the socket we created and makes it available to all components inside of it.
    return (
        <socketContext.Provider value={socket}>
            {props.children}
        </socketContext.Provider>
    )
}