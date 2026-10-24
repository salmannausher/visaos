import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { parse } from 'yaml';
import { validateContentInventory } from './content-validation.mjs';

const root = resolve('.');
const articlesDirectory = join(root, 'src/content/articles');
const sourcesDirectory = join(root, 'src/content/sources');
const pagesDirectory = join(root, 'src/pages');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function readFrontmatter(file) {
  const contents = readFileSync(file, 'utf8');
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${relative(root, file)}: missing YAML frontmatter`);
  return { data: parse(match[1]), body: contents.slice(match[0].length) };
}

function routeForPage(file) {
  const relativePath = relative(pagesDirectory, file);
  if (relativePath.split(sep).some((part) => part.includes('['))) return undefined;

  const withoutExtension = relativePath.slice(0, -extname(relativePath).length);
  const segments = withoutExtension.split(sep);
  if (segments.at(-1) === 'index') segments.pop();
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`;
}

const articles = walk(articlesDirectory)
  .filter((file) => file.endsWith('.md'))
  .map((file) => ({ file: relative(root, file), ...readFrontmatter(file) }));

const sources = walk(sourcesDirectory)
  .filter((file) => file.endsWith('.json'))
  .map((file) => ({
    id: relative(sourcesDirectory, file).replaceAll(sep, '/').replace(/\.json$/, ''),
    file: relative(root, file),
    data: JSON.parse(readFileSync(file, 'utf8')),
  }));

const staticRoutes = walk(pagesDirectory)
  .filter((file) => file.endsWith('.astro'))
  .map(routeForPage)
  .filter(Boolean);

const { errors, warnings } = validateContentInventory({
  articles,
  sources,
  staticRoutes,
  today: new Date(),
});

for (const warning of warnings) console.warn(`Warning: ${warning}`);

if (errors.length > 0) {
  console.error('\nContent validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Content validation passed for ${articles.length} articles, ${sources.length} sources, and ${staticRoutes.length} static routes.`,
);
