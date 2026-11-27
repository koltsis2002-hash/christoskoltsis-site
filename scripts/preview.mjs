// Packs the hash-routed build into one self-contained HTML file for a claude.ai artifact preview.
import { readFileSync, writeFileSync } from 'node:fs'

const dir = 'dist-preview'
const html = readFileSync(`${dir}/index.html`, 'utf8')
const read = (src) => readFileSync(dir + '/' + src.replace(/^\.?\//, ''), 'utf8')
const css = [...html.matchAll(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/g)].map(m => read(m[1])).join('\n')
const js = [...html.matchAll(/<script type="module"[^>]*src="(\/assets\/[^"]+)"[^>]*><\/script>/g)].map(m => read(m[1])).join('\n')
const fonts = [...html.matchAll(/<link rel="(?:preconnect|stylesheet)" href="https:\/\/fonts\.[^>]*>/g)].map(m => m[0]).join('\n')

writeFileSync(`${dir}/site-preview.html`, `<title>christoskoltsis.gr</title>
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>
`)
console.log('wrote', `${dir}/site-preview.html`, Math.round((css.length + js.length) / 1024) + ' KB')
