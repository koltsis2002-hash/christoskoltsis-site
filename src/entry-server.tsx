import { renderToString } from 'react-dom/server'
import App from './App'
export { ROUTES, href, meta } from './routes'
export { default as cutout } from './cutout.webp'
export const render = (key: string) => renderToString(<App initial={key} />)
