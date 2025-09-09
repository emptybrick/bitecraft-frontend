import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router';
import { UserProvider } from './contexts/UserContext.jsx';
import App from './App.jsx';
import "../node_modules/bulma/css/versions/bulma-no-dark-mode.css";
import "./styles/_overrides.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
