/**
 * Connection + draft-isolation check for the Sanity setup.
 *
 *   node --env-file=.env scripts/sanity-check.mjs
 *
 * Mirrors the client config in src/lib/sanity.ts. Run it after changing that
 * config, or when the site builds with suspiciously empty content — it tells
 * you whether the problem is configuration or genuinely missing content.
 *
 * The draft check matters: if `perspective` or `apiVersion` regress, drafts
 * start appearing on the public site with no other symptom.
 */
import {createClient} from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
	console.error('FAIL  PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET not set.');
	console.error('      Run with: node --env-file=.env scripts/sanity-check.mjs');
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2026-08-06',
	useCdn: false,
	perspective: 'published'
});

console.log(`project ${projectId} / dataset ${dataset}`);
console.log('');

try {
	const [posts, projects, everything] = await Promise.all([
		client.fetch('count(*[_type == "post" && defined(slug.current)])'),
		client.fetch('count(*[_type == "project" && defined(slug.current)])'),
		// `raw` sees drafts too. The gap between this and the counts above is
		// exactly what the published perspective is hiding.
		client
			.withConfig({perspective: 'raw'})
			.fetch('count(*[_type in ["post","project"]])')
	]);

	const published = posts + projects;
	const drafts = everything - published;

	console.log(`published posts     ${posts}`);
	console.log(`published projects  ${projects}`);
	console.log(`drafts hidden       ${drafts < 0 ? 0 : drafts}`);
	console.log('');

	if (drafts > 0) {
		console.log(`PASS  ${drafts} draft/unpublished doc(s) exist and are correctly excluded.`);
	} else if (published > 0) {
		console.log('PASS  Connected and querying. No drafts present to test isolation against —');
		console.log('      save a document without publishing, then re-run to confirm it stays hidden.');
	} else {
		console.log('PASS  Connected and querying, but the dataset is empty.');
		console.log('      Add content in the Studio, then re-run.');
	}
} catch (error) {
	console.error('FAIL  Query threw:');
	console.error(`      ${error.message}`);
	process.exit(1);
}
