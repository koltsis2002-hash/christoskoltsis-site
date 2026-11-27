import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { keyFromPath, meta } from './routes'
if (!document.title) document.title = meta(keyFromPath(location.pathname)).title
const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
