import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./styles/global.css"


const rootElement = document.getElementById('root')

if(rootElement) {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
else {
  console.error("Elemento root não encontrado")
}

reportWebVitals();
