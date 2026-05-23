import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import icon from "astro-iconset";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	output: "server",
	adapter: cloudflare({ inspectorPort: 9229 }),
	server: {
		port: 4321,
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	vite: {
		plugins: [tailwind()],
		server: {
			watch: {
				ignored: ["**/.wrangler/**"],
			},
		},
		ssr: {
			noExternal: [],
			optimizeDeps: {
				// Pre-bundle so it isn't discovered mid-render, which would trigger
				// a Vite dep re-optimization and break in-flight worker imports
				// under the Cloudflare dev runner (workerd).
				include: [
					"astro-iconset/components",
					"emdash/middleware",
					"emdash/middleware/redirect",
					"emdash/middleware/setup",
					"emdash/middleware/auth",
					"emdash/middleware/request-context",
					"emdash/media/local-runtime",
					"@emdash-cms/cloudflare/db/d1",
					"@emdash-cms/cloudflare/storage/r2",
					"emdash/ui",
					"emdash/runtime",
					"emdash/routes/PluginRegistry",
					"astro/zod",
				],
			},
		},
	},
	integrations: [
		react(),

		icon({
			// Only ship the Phosphor icons actually referenced in templates,
			// not the full @iconify-json/ph set (which adds megabytes to the
			// deployed worker bundle).
			include: {
				ph: [
					"chart-bar",
					"check-circle",
					"clock",
					"cloud",
					"code",
					"currency-dollar",
					"envelope",
					"globe",
					"heart",
					"lifebuoy",
					"lightning",
					"lock",
					"shield-check",
					"sparkle",
					"star",
					"users-three",
				],
			},
		}),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			sandboxRunner: sandbox(),
			mcp: true,
			plugins: [
				{
					id: "marketing-blocks",
					version: "0.1.0",
					// Absolute file:// URL so the virtual emdash/plugins module
					// can resolve this at build time (relative paths fail because
					// the virtual module has no on-disk location to anchor them).
					entrypoint: new URL("./src/plugins/marketing-blocks/index.ts", import.meta.url).href,
					adminEntry: new URL("./src/plugins/marketing-blocks/admin.tsx", import.meta.url).href,
				},
			],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Instrument Serif",
			cssVariable: "--font-display",
			weights: [400],
			fallbacks: ["serif"],
		},
	],
	devToolbar: { enabled: false },
});
