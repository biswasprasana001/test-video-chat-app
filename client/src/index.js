// We're importing the React library, which is used for building user interfaces.
import React from 'react';
// We're importing the ReactDOM library, which provides DOM-specific methods that can be used at the top level of a web app.
import ReactDOM from 'react-dom/client';
// We're importing the BrowserRouter from 'react-router-dom', which is used for routing in our React app.
import { BrowserRouter } from 'react-router-dom';
// We're importing the CSS for our app.
import './index.css';
// We're importing the main App component of our application.
import App from './App';
// We're importing a function that reports performance metrics of our app.
import reportWebVitals from './reportWebVitals';
// We're importing the SocketProvider from our context. This is a context provider for our socket connections.
import { SocketProvider } from './context/socketProvider';

// We're getting a reference to the root DOM node in our HTML.
const root = ReactDOM.createRoot(document.getElementById('root'));
// We're rendering our app inside this root DOM node.
root.render(
  // React.StrictMode is a wrapper component which checks our app's components for potential problems.
  <React.StrictMode>
    {/* BrowserRouter is a router implementation that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL. */}
    <BrowserRouter>
      {/* /SocketProvider provides a socket instance to all the components in our app. */}
      <SocketProvider>
        {/* App is the root component of our app. */}
        <App />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// We're calling the function that reports web vitals, which are metrics of our app's performance.
reportWebVitals();