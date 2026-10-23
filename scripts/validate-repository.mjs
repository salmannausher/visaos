import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean);

const forbiddenPaths = files.filter(
  (file) =>
    file === '.env' ||
    (file.startsWith('.env.') && file !== '.env.example') ||
    file === '.DS_Store' ||
    file.startsWith('node_modules/') ||
    file.startsWith('dist/') ||
    file.startsWith('.astro/'),
);

const secretPatterns = [
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub token', pattern: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: 'OpenAI API key', pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/ },
];

const suspectedSecrets = [];

for (const file of files) {
  let contents;

  try {
    const buffer = readFileSync(file);
    if (buffer.length > 2_000_000 || buffer.includes(0)) continue;
    contents = buffer.toString('utf8');
  } catch {
    continue;
  }

  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(contents)) suspectedSecrets.push(`${file}: possible ${name}`);
  }
}

const errors = [
  ...forbiddenPaths.map((file) => `${file}: generated, local, or secret-bearing file must not be tracked`),
  ...suspectedSecrets,
];

if (errors.length > 0) {
  console.error('Repository validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Repository validation passed for ${files.length} non-ignored files.`);
