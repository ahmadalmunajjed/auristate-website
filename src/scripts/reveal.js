const observer = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			entry.target.classList.toggle('is-visible', entry.isIntersecting);
		}
	},
	{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
