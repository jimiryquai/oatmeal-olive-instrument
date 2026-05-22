import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const UPLOADS_DIR = './uploads';
const BUCKET_NAME = 'my-marketing-media';

const MIME_TYPES = {
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
};

async function sync() {
	try {
		const files = await fs.readdir(UPLOADS_DIR);
		console.log(`Found ${files.length} files in ${UPLOADS_DIR} to sync to R2...`);

		for (const file of files) {
			const ext = path.extname(file).toLowerCase();
			const contentType = MIME_TYPES[ext] || 'application/octet-stream';
			const filePath = path.join(UPLOADS_DIR, file);

			console.log(`Syncing ${file} (${contentType})...`);
			
			const cmd = `npx wrangler r2 object put ${BUCKET_NAME}/${file} --file ${filePath} --content-type ${contentType} --local`;
			execSync(cmd, { stdio: 'inherit' });
		}

		console.log('Media sync completed successfully!');
	} catch (error) {
		console.error('Error during media sync:', error);
		process.exit(1);
	}
}

sync();
