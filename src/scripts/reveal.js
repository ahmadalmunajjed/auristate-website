const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Wrap each rendered line of a heading so it can slide up from behind a
 * clipping mask. Words are measured in their own inline-blocks and grouped by
 * offsetTop, so the split follows the real wrap points at any viewport width
 * rather than assuming a fixed line count.
 */
function splitLines(el) {
	const text = el.textContent.trim();
	if (!text) return;

	const words = text.split(/\s+/);
	el.textContent = '';
	const probes = words.map((word) => {
		const span = document.createElement('span');
		span.textContent = word;
		span.style.display = 'inline-block';
		el.append(span, document.createTextNode(' '));
		return span;
	});

	const lines = [];
	let currentTop = null;
	for (const probe of probes) {
		const top = probe.offsetTop;
		if (top !== currentTop) {
			lines.push([]);
			currentTop = top;
		}
		lines[lines.length - 1].push(probe.textContent);
	}

	el.textContent = '';
	lines.forEach((lineWords, i) => {
		const line = document.createElement('span');
		line.className = 'reveal-line';
		const inner = document.createElement('span');
		inner.textContent = lineWords.join(' ');
		inner.style.setProperty('--line-delay', `${i * 90}ms`);
		line.append(inner);
		el.append(line);
	});
}

// Split before observing, so the masks exist before anything can animate. Under
// reduced motion the headings are left as plain text — no masks, no transforms.
if (!REDUCED.matches) {
	document.querySelectorAll('.reveal-text').forEach(splitLines);
}

const observer = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			const el = entry.target;
			el.classList.add('is-visible');
			observer.unobserve(el);

			// Release the compositor layer once the entrance finishes. Leaving
			// will-change on would hold a layer per revealed node for the life of
			// the page.
			el.addEventListener('transitionend', () => el.classList.add('is-settled'), { once: true });
		}
	},
	{ threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
);

document
	.querySelectorAll('.reveal, .reveal-rise, .reveal-left, .reveal-right, .reveal-text')
	.forEach((el) => observer.observe(el));
