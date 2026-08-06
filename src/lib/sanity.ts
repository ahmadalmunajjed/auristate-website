import {createClient} from '@sanity/client';
// Named export, not the default — the default is deprecated in @sanity/image-url v2.
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url';
import {defineQuery} from 'groq';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

// Fail loudly at build time. Without this the client constructs fine and every
// query returns nothing, so the site builds "successfully" with an empty blog
// and no projects — which looks like a content problem, not a config one.
if (!projectId || !dataset) {
	throw new Error(
		'Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET. Copy .env.example to .env locally, ' +
			'and set both as build environment variables in the Cloudflare Pages dashboard.'
	);
}

export const client = createClient({
	projectId,
	dataset,
	// Pinned, not "today" — a floating version silently changes query behaviour.
	// Must stay >= 2025-02-19: before that the client's default perspective is
	// `raw`, which returns drafts.
	apiVersion: '2026-08-06',
	// Every page is generated at build time, triggered by a publish webhook. The
	// CDN can serve a stale response for a short window after publishing, which
	// would make a rebuild ship the content it was fired to pick up.
	useCdn: false,
	// Explicit, not inherited. This is the guard that keeps unpublished drafts
	// off the live site.
	perspective: 'published'
});

const builder = createImageUrlBuilder(client);

/** Build a Sanity CDN URL. Respects the hotspot/crop set in the Studio. */
export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

/**
 * Mirrors PROJECT_TYPES in studio/schemaTypes/project.ts. The Studio stores the
 * slug (which doubles as the /projects anchor id); this maps it back to display
 * text. Two packages, so the two lists have to be kept in step by hand — adding
 * a type means editing both.
 */
export const PROJECT_TYPES = [
	{value: 'hospitality', label: 'Hospitality / Venue'},
	{value: 'residential', label: 'Residential'},
	{value: 'luxury-villas', label: 'Luxury Villas Compound'}
] as const;

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number]['value'];

const TYPE_LABELS: Record<string, string> = Object.fromEntries(
	PROJECT_TYPES.map((entry) => [entry.value, entry.label])
);

/** Falls back to the raw value so an unknown type renders as itself, never blank. */
export function projectTypeLabel(value: string): string {
	return TYPE_LABELS[value] ?? value;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SanityImage {
	_type: 'image';
	asset: {_ref: string; _type: 'reference'};
	alt?: string;
	hotspot?: {x: number; y: number; height: number; width: number};
	crop?: {top: number; bottom: number; left: number; right: number};
}

/** Portable Text, passed straight through to <PortableText value={...} />. */
export type PortableTextValue = unknown[];

export interface PostSummary {
	_id: string;
	title: string;
	slug: string;
	date: string;
	excerpt: string;
	cover: SanityImage;
}

export interface Post extends PostSummary {
	body?: PortableTextValue;
	seoDescription?: string;
}

export interface ProjectSummary {
	_id: string;
	name: string;
	slug: string;
	projectType: ProjectTypeValue | string;
	location?: string;
	area?: string;
	summary?: string;
	/** gallery[0] — there is no separate cover field. */
	cover: SanityImage;
}

export interface Project extends ProjectSummary {
	description?: PortableTextValue;
	gallery: SanityImage[];
	faqs?: {_key: string; question: string; answer: string}[];
}

// ---------------------------------------------------------------------------
// Queries
//
// Every list filters `defined(slug.current)`. A document missing a slug would
// otherwise produce a getStaticPaths entry of `undefined`, which either fails
// the build or silently collides with another route.
// ---------------------------------------------------------------------------

const POST_FIELDS = `
	_id,
	title,
	"slug": slug.current,
	date,
	excerpt,
	"cover": coverImage
`;

const PROJECT_FIELDS = `
	_id,
	name,
	"slug": slug.current,
	projectType,
	location,
	area,
	summary,
	"cover": gallery[0]
`;

export const ALL_POSTS_QUERY = defineQuery(`
	*[_type == "post" && defined(slug.current)] | order(date desc) {${POST_FIELDS}}
`);

export const LATEST_POST_QUERY = defineQuery(`
	*[_type == "post" && defined(slug.current)] | order(date desc)[0] {${POST_FIELDS}}
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
	*[_type == "post" && slug.current == $slug][0] {${POST_FIELDS}, body, seoDescription}
`);

export const POST_SLUGS_QUERY = defineQuery(`
	*[_type == "post" && defined(slug.current)]{"slug": slug.current}
`);

// `order(orderRank)` is the drag order set in the Studio. It is load-bearing:
// the homepage carousel opens on it, and with one project the first becomes the
// full-width feature.
export const ALL_PROJECTS_QUERY = defineQuery(`
	*[_type == "project" && defined(slug.current)] | order(orderRank) {${PROJECT_FIELDS}}
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
	*[_type == "project" && slug.current == $slug][0] {
		${PROJECT_FIELDS},
		description,
		gallery,
		faqs[]{_key, question, answer}
	}
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
	*[_type == "project" && defined(slug.current)]{"slug": slug.current}
`);

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

export const getAllPosts = () => client.fetch<PostSummary[]>(ALL_POSTS_QUERY);
export const getLatestPost = () => client.fetch<PostSummary | null>(LATEST_POST_QUERY);
export const getPost = (slug: string) => client.fetch<Post | null>(POST_BY_SLUG_QUERY, {slug});
export const getAllProjects = () => client.fetch<ProjectSummary[]>(ALL_PROJECTS_QUERY);
export const getProject = (slug: string) =>
	client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, {slug});
