import { Plugin } from 'vite';

import fs from 'fs';
import { execSync } from 'child_process';

const swaggerUrl = './vite/plugins/generate-openapi-client/api.doc.json' // JSON.stringify(process.env.VITE_API_SWAGGER)
const outputPathTypes = './src/shared/client/types/index.ts'; 
const outputPathContracts = './src/shared/client/contracts/index.ts'; 

function generateApiClient() {
  console.log('[openapi-client] Generating client...');
  try {
    const cacheFile = '.swagger-cache.json';
    const lastHash = fs.existsSync(cacheFile) ? fs.readFileSync(cacheFile, 'utf8') : '';
    const currentHash = Date.now().toString();

    if (lastHash !== currentHash || (!fs.existsSync(outputPathContracts)) && !fs.existsSync(outputPathContracts)) {
      execSync(`npx openapi-typescript ${swaggerUrl} -o "${outputPathTypes}"`, { stdio: 'inherit' });
      execSync(`npx openapi-zod-client ${swaggerUrl} -o "${outputPathContracts}" --export-schemas`, { stdio: 'inherit' });
      fs.writeFileSync(cacheFile, currentHash, 'utf8');
    } else {
      console.log('[openapi-client] No changes in swagger spec — skipping regeneration');
    }
  } catch (e) {
    console.error('[openapi-client] Failed to generate API client', e);
  }
}

export const generateOpenApiPlugin = (): Plugin => ({
  name: 'generate-api-plugin',
  async buildStart() {
    generateApiClient();
  }
})