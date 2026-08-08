// Single source of truth for homepage content. Client-supplied except where
// marked PLACEHOLDER.

export interface NavItem {
	label: string;
	href: string;
	/** Renders as a dropdown in the header. The footer ignores it and stays flat. */
	children?: { label: string; href: string }[];
}

// Most of these are in-page anchors into the homepage sections, so they are
// coupled to the `id` on each section's root element. `#projects` self-hides
// while nothing is published in Sanity, so an empty Projects list leaves that
// menu item scrolling nowhere. Renaming an id does the same, just as quietly.
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
	// Mirrors PROJECT_TYPES in src/lib/sanity.ts and studio/schemaTypes/project.ts.
	{
		label: 'Projects',
		href: '/#projects',
		children: [
			{ label: 'All Projects', href: '/projects' },
			{ label: 'Tourism & Hospitality', href: '/projects#tourism-hospitality' },
			{ label: 'Residential', href: '/projects#residential' },
			{ label: 'Education', href: '/projects#education' },
			{ label: 'Commercial & Leisure', href: '/projects#commercial-leisure' },
			{ label: 'Retail & Entertainment', href: '/projects#retail-entertainment' },
			{ label: 'Commercial', href: '/projects#commercial' }
		]
	},
	{ label: 'Our Services', href: '/#services' },
	// Keeps the 'News' label but points at the real index. The homepage section
	// still exists at #news and still calls itself News.
	{ label: 'News', href: '/blog' },
	{ label: 'Contact Us', href: '/#contact' }
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
		{ label: 'Get in Touch', href: '/#contact', primary: false }
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

// Projects and blog posts are no longer here — they live in Sanity and are
// fetched at build time. See src/lib/sanity.ts for the queries and types, and
// studio/schemaTypes/ for the shape the client edits.
//
// The three real projects (365, Hameh, THE MARK) were migrated with their
// images by studio/scripts/seed-projects.mjs. The 'TEMP FOURTH' placeholder was
// dropped rather than migrated: it existed only to push the carousel past three
// so its arrows would render, and shipping a project called TEMP FOURTH was
// never the intent. With three real projects the carousel is a centred row with
// no arrows; publishing a real fourth brings them back.

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

// `email` is client-confirmed and is where the contact form delivers. `phone`
// and `address` are still PLACEHOLDER, and the number feeds both WhatsApp links.
export const contact = {
	email: 'Info@auristate.com',
	phone: '+963 960 702 163',
	address: 'Kafarsousa, Damascus, Syria'
};

export const contactSection = {
	eyebrow: 'Contact Us',
	title: 'Start a Conversation',
	lead: 'Tell us about your project or investment interest and our team will come back to you.',
	/** Prefixes the mailto subject, so enquiries are filterable in the inbox. */
	subjectPrefix: 'Website enquiry'
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
export const footerTagline = 'INVESTING IN VISION';
