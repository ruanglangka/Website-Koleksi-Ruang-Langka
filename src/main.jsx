import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

// HashRouter dipakai supaya routing tetap berfungsi di GitHub Pages
// (GitHub Pages adalah static hosting, tidak mendukung server-side rewrite
// untuk BrowserRouter pada refresh halaman / direct link).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
)
