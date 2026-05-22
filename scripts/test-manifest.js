import { EmDashClient } from "emdash/client";

async function main() {
  const client = new EmDashClient({
    baseUrl: "http://localhost:4321",
    devBypass: true,
  });

  try {
    const manifest = await client.manifest();
    console.log("SUCCESS FETCHING MANIFEST");
    console.log("Collections list:");
    for (const slug of Object.keys(manifest.collections)) {
      console.log(`- ${slug}`);
      const collection = manifest.collections[slug];
      for (const fieldSlug of Object.keys(collection.fields)) {
        const field = collection.fields[fieldSlug];
        if (field.kind === "reference") {
          console.log(`  - field: ${fieldSlug}, kind: ${field.kind}, widget: ${field.widget}, options:`, field.options);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching manifest:", error);
  }
}

main();
