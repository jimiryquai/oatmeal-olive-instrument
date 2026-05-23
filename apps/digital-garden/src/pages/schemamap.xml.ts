import { createSchemaMap } from "@jdevalk/astro-seo-graph";
import { getEmDashCollection } from "emdash";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
	const siteUrl = context.site?.toString().replace(/\/$/, "") || context.url.origin;

	const [pages, posts, projects] = await Promise.all([
		getEmDashCollection("pages", { limit: 1 }),
		getEmDashCollection("posts", { limit: 1 }),
		getEmDashCollection("projects", { limit: 1 }),
	]);

	const getLatestDate = (entries: any[]) => {
		if (entries && entries.length > 0 && entries[0].data.updatedAt) {
			return new Date(entries[0].data.updatedAt);
		}
		return new Date();
	};

	const pagesDate = getLatestDate(pages.entries);
	const postsDate = getLatestDate(posts.entries);
	const projectsDate = getLatestDate(projects.entries);

	const handler = createSchemaMap({
		siteUrl,
		entries: [
			{ path: "/schema/pages.json", lastModified: pagesDate },
			{ path: "/schema/posts.json", lastModified: postsDate },
			{ path: "/schema/projects.json", lastModified: projectsDate },
		],
	});

	return handler(context);
};
