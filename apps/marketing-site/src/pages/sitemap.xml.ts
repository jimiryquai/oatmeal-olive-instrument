import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = site?.toString().replace(/\/$/, "") || url.origin;

	// Fetch dynamic content from EmDash collections
	const [pagesResult, postsResult, projectsResult] = await Promise.all([
		getEmDashCollection("pages", { limit: 100 }),
		getEmDashCollection("posts", { limit: 100 }),
		getEmDashCollection("projects", { limit: 100 }),
	]);

	const urls: string[] = [];

	// Add static pages
	urls.push(`${siteUrl}/contact`);
	urls.push(`${siteUrl}/blog`);
	urls.push(`${siteUrl}/work`);

	// Add dynamic pages
	if (pagesResult?.entries) {
		for (const page of pagesResult.entries) {
			const slug = page.id; // entry.id is the slug (URL path representation)
			if (slug === "home") {
				urls.push(`${siteUrl}/`);
			} else if (["about", "pricing", "privacy-policy"].includes(slug)) {
				urls.push(`${siteUrl}/${slug}`);
			} else {
				urls.push(`${siteUrl}/pages/${slug}`);
			}
		}
	}

	// Add blog posts
	if (postsResult?.entries) {
		for (const post of postsResult.entries) {
			urls.push(`${siteUrl}/blog/${post.id}`);
		}
	}

	// Add projects
	if (projectsResult?.entries) {
		for (const project of projectsResult.entries) {
			urls.push(`${siteUrl}/work/${project.id}`);
		}
	}

	// Build sitemap XML
	const xmlUrls = urls
		.map((u) => `  <url><loc>${u}</loc></url>`)
		.join("\n");

	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

	return new Response(sitemapXml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
};
