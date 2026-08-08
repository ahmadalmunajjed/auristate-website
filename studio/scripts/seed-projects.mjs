/**
 * One-shot import of the three real projects that used to live hardcoded in
 * the site's src/data/site.ts, along with their existing images.
 *
 *   cd studio
 *   node --env-file=../.env scripts/seed-projects.mjs
 *
 * Lives in studio/ rather than the site because it needs `lexorank` (a
 * dependency of the ordering plugin) to generate valid orderRank values. The
 * site has no business depending on that.
 *
 * IDEMPOTENT: looks each project up by slug first and skips ones that already
 * exist. Running it twice will not create duplicates.
 *
 * Deliberately seeds ONLY data we actually have — name, type, and the real
 * photo. `location`, `area`, `description` and `faqs` are left empty for the
 * client to fill in with real information rather than inventing any.
 */
import {createClient} from '@sanity/client'
import {LexoRank} from 'lexorank'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const imagesDir = join(here, '..', '..', 'public', 'images', 'projects')

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('FAIL  PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET not set.')
  process.exit(1)
}

if (!token) {
  console.error('FAIL  SANITY_WRITE_TOKEN not set.')
  console.error('      Create one at sanity.io/manage -> API -> Tokens (Editor), add it to .env,')
  console.error('      then run:  node --env-file=../.env scripts/seed-projects.mjs')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-06',
  useCdn: false,
  token,
})

/**
 * `projectType` values are the schema's list values, which double as the
 * /projects anchor ids. They are not display text.
 */
const PROJECTS = [
  {name: '365', slug: '365', projectType: 'tourism-hospitality', file: '365-photo.jpg'},
  {name: 'Hameh', slug: 'hameh', projectType: 'residential', file: 'hameh.jpg'},
  {name: 'THE MARK', slug: 'the-mark', projectType: 'residential', file: 'the-mark.jpg'},
]

let rank = LexoRank.middle()
let created = 0
let skipped = 0

for (const entry of PROJECTS) {
  const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{_id}`, {
    slug: entry.slug,
  })

  if (existing?._id) {
    console.log(`skip    ${entry.name} — already exists (${existing._id})`)
    skipped++
    rank = rank.genNext()
    continue
  }

  const buffer = await readFile(join(imagesDir, entry.file))
  const asset = await client.assets.upload('image', buffer, {filename: entry.file})

  // No explicit _id — Sanity assigns one. Slug-derived IDs would encode content
  // into an implementation identifier, which breaks as soon as a slug changes.
  const doc = await client.create({
    _type: 'project',
    name: entry.name,
    slug: {_type: 'slug', current: entry.slug},
    projectType: entry.projectType,
    orderRank: rank.toString(),
    gallery: [
      {
        _type: 'image',
        _key: `${entry.slug}-cover`,
        asset: {_type: 'reference', _ref: asset._id},
      },
    ],
  })

  console.log(`created ${entry.name} — ${doc._id}`)
  created++
  rank = rank.genNext()
}

console.log('')
console.log(`Done. ${created} created, ${skipped} skipped.`)
if (created > 0) {
  console.log('These are published (not drafts), so the site will pick them up on next build.')
  console.log('Location, square meters, description and questions are empty — fill them in the Studio.')
}
