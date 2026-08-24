import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const licenseKey = process.env.PRIMEUI_LICENSE_KEY?.trim();

if (!licenseKey) {
  console.error('PRIMEUI_LICENSE_KEY is not set.');

  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const output = resolve(root, 'src/environments/primeui-license.generated.ts');

await mkdir(dirname(output), {
  recursive: true,
});

await writeFile(output, `export const primeUiLicense = ${JSON.stringify(licenseKey)};\n`);

console.log('PrimeUI license configured.');
