import { createApiCatalog } from "@jdevalk/astro-seo-graph";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
	const siteUrl = context.site?.toString().replace(/\/$/, "") || context.url.origin;

	const handler = createApiCatalog({
		siteUrl,
		schemaEndpoints: [
			{ path: "/schema/pages.json", schemaType: "WebPage" },
			{ path: "/schema/posts.json", schemaType: "BlogPosting" },
			{ path: "/schema/projects.json", schemaType: "WebPage" },
		],
		schemaMap: { path: "/schemamap.xml" },
	});

	return handler(context);
};
