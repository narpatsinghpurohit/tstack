import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';
import './lang/i18';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <ToastContainer
        autoClose={2000}
        position="top-right"
        className="toast-container"
        toastClassName="dark-toast"
      />
      <Routes>
        {
          Object.keys(routes).map(route => {
            const currentRoute = routes[route];
            const Component = currentRoute.component;
            return (
              <Route
                key={currentRoute.path}
                path={currentRoute.path}
                element={<Component location={location} navigate={navigate} />}
              />
            );
          })
        }
      </Routes>
    </div>
  );
}

export default App;
