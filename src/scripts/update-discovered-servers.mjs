import { readFileSync, writeFileSync } from 'node:fs';

const dataPath = 'src/data/universities.json';
const universities = JSON.parse(readFileSync(dataPath, 'utf8'));
const discovery = JSON.parse(readFileSync('discovery-results.json', 'utf8'));
let added = 0;

for (const result of discovery.results) {
  if (result.status !== 'discovered' || !result.confirmed) {
    continue;
  }

  const university = universities[result.university];
  if (!university) {
    throw new Error(`Unknown university in discovery result: ${result.university}`);
  }

  const websites = Array.isArray(university.website) ? university.website : [university.website];
  if (!websites.includes(result.url)) {
    university.website = [...websites, result.url];
    added += 1;
    console.log(`Added ${result.url} to ${result.university}.`);
  }
}

if (added > 0) {
  writeFileSync(dataPath, `${JSON.stringify(universities, null, 2)}\n`);
}

console.log(`Added ${added} discovered server(s).`);
