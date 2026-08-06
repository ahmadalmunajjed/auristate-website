// Single source of truth for homepage content. Client-supplied except where
// marked PLACEHOLDER.

export interface NavItem {
	label: string;
	href: string;
	/** Renders as a dropdown in the header. The footer ignores it and stays flat. */
	children?: { label: string; href: string }[];
}

// Most of these are in-page anchors into the homepage sections, so they are
// coupled to the `id` on each section's root element. Two of those sections
// self-hide — `#projects` renders only while `projects` is non-empty and
// `#news` only while `posts` is — so emptying either array leaves its menu
// item scrolling nowhere. Renaming an id does the same, just as quietly.
// Root-relative, not bare `#about`: the footer renders this same array and
// will ship on pages other than `/`.
// `About Us` keeps its own href — the trigger is still a working link to the
// About section, so the menu never becomes the only way through.
export const nav: NavItem[] = [
	{
		label: 'About Us',
		href: '/#about',
		children: [
			{ label: 'Who We Are', href: '/#about' },
			{ label: 'Mission and Vision', href: '/#vision-mission' }
		]
	},
	// The three children are the `tag` values on `projects` below, shortened for
	// menu width ('Luxury Villas Compound' → 'Luxury Villas'), so the menu never
	// advertises a type with nothing in it. Nothing derives this — a project with
	// a new tag needs a new entry here. The trigger still points at the homepage
	// section; only the types leave for `/projects`, which does not exist yet and
	// 404s until built, along with the anchors these expect it to expose.
	{
		label: 'Projects',
		href: '/#projects',
		children: [
			{ label: 'Hospitality', href: '/projects#hospitality' },
			{ label: 'Residential', href: '/projects#residential' },
			{ label: 'Luxury Villas', href: '/projects#luxury-villas' }
		]
	},
	{ label: 'Our Services', href: '/#services' },
	{ label: 'News', href: '/#news' },
	{ label: 'Contact Us', href: '/contact' }
];

export const hero = {
	// Caps here rather than via `uppercase`, so the copy on screen is the copy in
	// this file. The hero sizes it to hold on one line at every viewport — a
	// longer headline does not wrap there, it shrinks.
	title: 'INVESTING IN VISION',
	body: 'Auristate Tourism Investment builds world-class destinations that embody elegance, opportunity, and cultural connection.',
	background: '/images/hero/hero-bg.svg',
	// null falls back to the poster alone — the hero never emits a <video> with
	// a dead source. AGENTS.md explains why the 480p source needs the tuning.
	showreel: '/videos/hero.mp4' as string | null,
	poster: '/images/hero/placeholder.png',
	showreelRate: 0.75,
	showreelStart: 2.4,
	ctas: [
		{ label: 'Explore Our Projects', href: '/projects', primary: true },
		{ label: 'Get in Touch', href: '/contact', primary: false }
	]
};

// Client copy. `lead` is the standfirst under the heading, `paragraphs` the two
// body columns, and `statement` the closing line — a fragment by design, so it
// renders as its own display line rather than as a third paragraph.
export const about = {
	eyebrow: 'About Us',
	title: 'Who We Are',
	lead: 'A Syrian joint-stock company specialized in real estate and tourism investments, founded in 2025.',
	paragraphs: [
		'By combining deep local expertise with a renewed global vision, we develop innovative projects that reflect authentic Syrian identity, while leveraging the latest global trends in design, construction, and building technologies.',
		'Our team brings together accumulated experience in the local market, supported by a wide international network.'
	],
	statement: 'To establish high-end touristic destinations.'
};

export interface Project {
	name: string;
	/** Renders as the pill above the name. */
	tag: string;
	/** 16:9 or wider crops best. */
	image: string;
	/** '/projects/<slug>' once project pages exist. */
	href: string;
	/** Optional second line under the name. Renders in every layout. */
	summary?: string;
}

// `tag` values are inferred from the renders, not given by the client — THE
// MARK's gatehouse signage reads "luxury villas compound". Correct if wrong.
export const projects: Project[] = [
	{
		name: '365',
		tag: 'Hospitality / Venue',
		image: '/images/projects/365-photo.jpg',
		href: '/projects'
	},
	{
		name: 'Hameh',
		tag: 'Residential',
		image: '/images/projects/hameh.jpg',
		href: '/projects'
	},
	{
		name: 'THE MARK',
		tag: 'Luxury Villas Compound',
		image: '/images/projects/the-mark.jpg',
		href: '/projects'
	},
	// PLACEHOLDER — not a real development. It exists so the carousel crosses the
	// three-project threshold and renders its arrows; its image is 365's, reused.
	// Kept deliberately unshippable-looking: replace it with a real project or
	// delete it, and the section falls back to the static three-card coverflow.
	// Its `tag` has no entry in the Projects dropdown above, by design.
	{
		name: 'TEMP FOURTH',
		tag: 'Temporary',
		image: '/images/projects/365-photo.jpg',
		href: '/projects'
	}
];

export interface Post {
	title: string;
	/** Preview description shown on the card. */
	excerpt: string;
	/** 16:9 or wider crops best. */
	image: string;
	/** '/news/<slug>' once post pages exist. */
	href: string;
	/** Optional — omit on evergreen posts so they never look stale. */
	date?: string;
}

// Renders nothing while empty. The homepage previews posts[0] only; the rest
// are for /news. A real site photo is ready at /images/blog/post.jpeg.
export const posts: Post[] = [{title:'Site Progress Update 1: Structural Works Advance',excerpt:'Our engineering team reviews the latest milestone on site, with the primary structure now complete and finishing works scheduled to begin.',image:'/images/blog/post.jpeg',href:'/news',date:'Jul 2026'},{title:'Site Progress Update 2: Structural Works Advance',excerpt:'Our engineering team reviews the latest milestone on site, with the primary structure now complete and finishing works scheduled to begin.',image:'/images/blog/post.jpeg',href:'/news',date:'Jul 2026'},{title:'Site Progress Update 3: Structural Works Advance',excerpt:'Our engineering team reviews the latest milestone on site, with the primary structure now complete and finishing works scheduled to begin.',image:'/images/blog/post.jpeg',href:'/news',date:'Jul 2026'}];

export interface Service {
	title: string;
	blurb: string;
	/** Decorative, cropped to 4:3. Omit and the step renders as text alone. */
	image?: string;
}

// Client copy. The four are a sequence, not parallel offerings, so the section
// numbers them as a process.
export const services: Service[] = [
	{
		title: 'Study & Planning',
		blurb: 'Feasibility study, market analysis, and defining the initial vision.',
		image: '/images/services/study-planning.jpeg'
	},
	{
		title: 'Design & Development',
		blurb:
			"Exclusive architectural and interior designs, with 3D renderings that let you see your project before it's built.",
		image: '/images/services/design-development.jpeg'
	},
	{
		title: 'Execution & Supervision',
		blurb:
			'Project management and strict engineering supervision, connecting you with a trusted network of specialized contractors and suppliers.',
		image: '/images/services/execution-supervision.jpeg'
	},
	{
		title: 'Delivery & Operation',
		blurb:
			'Complete project handover with world-class quality, adhering to the agreed timeline and budget.',
		image: '/images/services/delivery-operation.jpeg'
	}
];

// Client copy. Vision and mission as one continuous statement rather than a
// labelled pair — the two paragraphs read as vision, then how it's realised.
export const visionMission = [
	'Auristate’s vision is to contribute to building a more prosperous future for Syria’s real estate and tourism investment sectors through the development of pioneering projects that reflect the nation’s identity while adhering to the highest international standards.',
	'The company brings this vision to life through its commitment to developing high-quality investment opportunities and sustainable projects that create added value for investors and communities, support economic growth, and strengthen Syria’s position as a promising destination for investment and tourism.'
];

export const contact = {
	email: 'Info@auristate.com',
	phone: '+963 960 702 163',
	address: 'Kafarsousa, Damascus, Syria'
};

// The footer renders these as icons only, so `label` never appears on screen —
// it is the link's accessible name. `icon` picks the glyph in SocialIcon.astro,
// which types its path table as Record<SocialIconName, …> — so adding a network
// to this union is a type error there until its path lands.
export type SocialIconName = 'linkedin' | 'instagram' | 'facebook' | 'whatsapp';


// LinkedIn, Instagram, and Facebook are PLACEHOLDER — no profile URLs supplied,
// so all three point nowhere. WhatsApp is real: wa.me wants the number as bare
// digits, and it is derived from `contact.phone` above so the two cannot drift.
export const social: { label: string; href: string; icon: SocialIconName }[] = [
	{ label: 'LinkedIn', href: '#', icon: 'linkedin' },
	{ label: 'Instagram', href: '#', icon: 'instagram' },
	{ label: 'Facebook', href: '#', icon: 'facebook' },
	{
		label: 'WhatsApp',
		href: `https://wa.me/${contact.phone.replace(/\D/g, '')}`,
		icon: 'whatsapp'
	}
];

// PLACEHOLDER
export const footerTagline = 'Tourism & real estate investment across Syria.';
