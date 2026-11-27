import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { currentKey, meta } from './routes'
if (!document.title) document.title = meta(currentKey()).title
const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
