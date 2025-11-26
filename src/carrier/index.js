import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import carrierApp from './carrierapp.jsx';
import reportWebVitals from './reportWebVitals';
import CarrierApp from './carrierapp.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CarrierApp />
  </React.StrictMode>
);

reportWebVitals();
