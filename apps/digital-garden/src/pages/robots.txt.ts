import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = site?.toString().replace(/\/$/, "") || url.origin;

	const body = `# Content-Signal: ai-train=no, search=yes, ai-input=yes
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/schemamap.xml
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
			"Content-Signal": "ai-train=no, search=yes, ai-input=yes",
		},
	});
};
