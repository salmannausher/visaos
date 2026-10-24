import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { SITE_ORIGIN } from '../src/config/site.mjs';

const outputDirectory = resolve('dist');
const pagefindDirectory = join(outputDirectory, 'pagefind');
const productionHostname = new URL(SITE_ORIGIN).hostname;
const plainPlaceholder = 'example.com';
const escapedPlaceholder = String.raw`example\.com`;
const escapedProductionHostname = productionHostname.replaceAll('.', String.raw`\.`);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let changedFiles = 0;

for (const file of walk(pagefindDirectory).filter((path) => extname(path) === '.js')) {
  const contents = readFileSync(file, 'utf8');
  const sanitized = contents
    .replaceAll(plainPlaceholder, productionHostname)
    .replaceAll(escapedPlaceholder, escapedProductionHostname);

  if (sanitized !== contents) {
    writeFileSync(file, sanitized);
    changedFiles += 1;
  }
}

const remainingPlaceholders = walk(pagefindDirectory)
  .filter((path) => extname(path) === '.js')
  .filter((file) => {
    const contents = readFileSync(file, 'utf8');
    return contents.includes(plainPlaceholder) || contents.includes(escapedPlaceholder);
  });

if (remainingPlaceholders.length > 0) {
  console.error('Pagefind output still contains placeholder origins:');
  for (const file of remainingPlaceholders) console.error(`- ${relative(outputDirectory, file)}`);
  process.exit(1);
}

console.log(`Sanitized placeholder URL sentinels in ${changedFiles} Pagefind file(s).`);
