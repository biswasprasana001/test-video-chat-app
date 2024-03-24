// We're importing the CSS for our App component.
import './App.css';
// We're importing the Route and Routes components from 'react-router-dom', which are used for routing in our React app.
import { Route, Routes } from 'react-router-dom';
// We're importing the Lobby and Room components from our screens directory.
import Lobby from './screens/Lobby';
import Room from './screens/Room';

// We're defining a functional component called App.
function App() {
  // The component returns a JSX element.
  return (
    // We're creating a div element.
    <div>
      {/* Inside the div, we're defining our routes using the Routes component. */}
      <Routes>
        {/* We're defining a route for the path '/' (the homepage of our app). When users navigate to this path, they will see the Lobby component. */}
        <Route path="/" element={< Lobby />} />
        {/* We're defining a route for the path '/room/:roomId'. The ':roomId' part is a URL parameter that will match any string. When users navigate to this path, they will see the Room component. */}
        <Route path="/room/:roomId" element={< Room />} />
      </Routes>
    </div>
  );
}

// We're exporting the App component as the default export of this module.
export default App;