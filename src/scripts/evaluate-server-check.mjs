import { appendFileSync, readFileSync } from 'node:fs';

const outputPath = process.env.GITHUB_OUTPUT;
let passed = false;

try {
  const universities = JSON.parse(readFileSync('src/data/universities.json', 'utf8'));
  const results = JSON.parse(readFileSync('validate-results.json', 'utf8'));
  const configuredCount = Object.values(universities)
    .filter(({ supported }) => supported)
    .reduce((count, { website }) => count + (Array.isArray(website) ? website.length : 1), 0);
  const validatedCount = results.summary.validated;
  const passRate = configuredCount === 0 ? 0 : validatedCount / configuredCount;
  passed = passRate >= 0.75;

  console.log(`Validated ${validatedCount}/${configuredCount} configured servers (${(passRate * 100).toFixed(1)}%).`);
  console.log(`Validation threshold: 75.0% (${passed ? 'passed' : 'failed'}).`);
} catch (error) {
  console.error(`Could not evaluate validation results: ${error.message}`);
}

if (outputPath) {
  appendFileSync(outputPath, `passed=${passed}\n`);
}
