// Writes one ready-made HTML file per page (so search engines see the text and a proper title), plus sitemap.xml and robots.txt.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname } from 'node:path'
import { render, ROUTES, PRIVATE, href, meta, cutout } from '../dist-ssr/entry-server.js'

const SITE = (process.env.SITE_URL || 'https://christoskoltsis.gr').replace(/\/$/, '')
const INDEX = process.env.SITE_INDEX === 'true'
const BASE = process.env.SITE_BASE || '/'
const origin = new URL(SITE).origin
const abs = (p) => origin + p
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const template = readFileSync('dist/index.html', 'utf8')
// Links to Christos's profiles elsewhere (Google Business Profile, LinkedIn), so Google ties them to the site.
// SITE_SAMEAS is a comma-separated list set in deploy.yml.
const sameAs = (process.env.SITE_SAMEAS || '').split(',').map(s => s.trim()).filter(Boolean)
const home = abs(BASE)
const AREAS = [
  { '@type': 'City', name: 'Έδεσσα' },
  { '@type': 'AdministrativeArea', name: 'Πέλλα' },
  { '@type': 'City', name: 'Θεσσαλονίκη' },
  { '@type': 'AdministrativeArea', name: 'Κεντρική Μακεδονία' },
]
// City-level address only: no street address is published
const address = { '@type': 'PostalAddress', addressLocality: 'Έδεσσα', addressRegion: 'Πέλλα', addressCountry: 'GR' }
const person = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': home + '#christos',
      name: 'Χρήστος Κόλτσης',
      alternateName: ['Christos Koltsis', 'Κόλτσης Χρήστος'],
      jobTitle: 'Ασφαλιστικός & Χρηματοοικονομικός Σύμβουλος',
      worksFor: { '@type': 'Organization', name: 'NN Hellas' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Πανεπιστήμιο Μακεδονίας' },
      telephone: '+30 6989118348',
      email: 'christos.koltsis@nnadvisors.gr',
      address,
      url: home,
      image: abs(cutout),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'InsuranceAgency',
      '@id': home + '#office',
      name: 'Χρήστος Κόλτσης',
      description: 'Ασφαλιστικός και χρηματοοικονομικός σύμβουλος στην Έδεσσα: ασφάλεια υγείας, ζωής, αποταμίευση και σύνταξη, για ιδιώτες και επιχειρήσεις στη Βόρεια Ελλάδα.',
      url: home,
      telephone: '+30 6989118348',
      email: 'christos.koltsis@nnadvisors.gr',
      image: abs(cutout),
      address,
      areaServed: AREAS,
      knowsLanguage: 'el',
      founder: { '@id': home + '#christos' },
      ...(sameAs.length ? { sameAs } : {}),
    },
  ],
}

function head(key) {
  const m = meta(key), url = abs(href(key)), img = abs(BASE + 'og.jpg')
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${INDEX && !PRIVATE.includes(key) ? 'index, follow' : 'noindex, nofollow'}" />`,
    `<meta property="og:type" content="${key.startsWith('arthro-') ? 'article' : 'website'}" />`,
    `<meta property="og:locale" content="el_GR" />`,
    `<meta property="og:site_name" content="Χρήστος Κόλτσης" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    key === 'arxiki' ? `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n')
}

const page = (key, extraHead = '') => template
  .replace('<!--head-->', head(key) + extraHead)
  .replace('<div id="root"></div>', `<div id="root">${render(key)}</div>`)

for (const key of ROUTES) {
  const file = 'dist' + href(key).slice(BASE.length - 1) + 'index.html'
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page(key))
}
writeFileSync('dist/404.html', page('arxiki').replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex" />'))

writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.filter(k => !PRIVATE.includes(k)).map(k => `  <url><loc>${abs(href(k))}</loc></url>`).join('\n')}
</urlset>
`)
writeFileSync('dist/robots.txt', INDEX
  ? `User-agent: *\nAllow: /\n\nSitemap: ${abs(BASE + 'sitemap.xml')}\n`
  : `User-agent: *\nDisallow: /\n`)

rmSync('dist-ssr', { recursive: true, force: true })
console.log(`prerendered ${ROUTES.length} pages for ${SITE} (${INDEX ? 'indexable' : 'noindex'})`)
