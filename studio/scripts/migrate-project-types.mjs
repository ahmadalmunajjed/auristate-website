/**
 * One-shot patch for the three projects seeded before the project-type
 * taxonomy changed from {hospitality, residential, luxury-villas} to the
 * current six-value PROJECT_TYPES in schemaTypes/project.ts.
 *
 *   cd studio
 *   node --env-file=../.env scripts/migrate-project-types.mjs
 *
 * IDEMPOTENT: only patches docs whose projectType still matches an old value.
 */
import {createClient} from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('FAIL  PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET not set.')
  process.exit(1)
}

if (!token) {
  console.error('FAIL  SANITY_WRITE_TOKEN not set.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-06',
  useCdn: false,
  token,
})

const RENAMES = {
  hospitality: 'tourism-hospitality',
  'luxury-villas': 'residential',
}

const docs = await client.fetch(
  `*[_type == "project" && projectType in $old]{_id, name, projectType}`,
  {old: Object.keys(RENAMES)},
)

if (docs.length === 0) {
  console.log('Nothing to migrate — no docs on an old projectType value.')
  process.exit(0)
}

for (const doc of docs) {
  const next = RENAMES[doc.projectType]
  await client.patch(doc._id).set({projectType: next}).commit()
  console.log(`patched ${doc.name} — ${doc.projectType} -> ${next}`)
}

console.log('')
console.log(`Done. ${docs.length} patched.`)
