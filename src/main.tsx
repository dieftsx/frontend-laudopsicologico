import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "./components/theme-provider"
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)