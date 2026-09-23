import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const TIMING = {
  validate: {
    delayMs: 1000,
    requestTimeoutMs: 10000,
    renderTimeoutMs: 5000,
  },
  discover: {
    delayMs: 150,
    requestTimeoutMs: 2000,
    renderTimeoutMs: 2500,
  },
};
const DISCOVERY_MIN = 1;
const DISCOVERY_MAX = 20;
const USER_AGENT = '';
const ANSI = {
  reset: '\u001b[0m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  blue: '\u001b[34m',
};
const options = new Set(process.argv.slice(2));
const validate = options.has('--validate');
const discover = options.has('--discover');
const timing = TIMING[validate ? 'validate' : 'discover'];
const jsonOutputOption = [...options].find((option) => option.startsWith('--json-output='));
const jsonOutputPath = jsonOutputOption?.slice('--json-output='.length);

if (validate === discover) {
  throw new Error('[ERROR]: Use exactly one of --validate or --discover.');
}

const universitiesPath = new URL('../data/universities.json', import.meta.url);
const universities = JSON.parse(await readFile(universitiesPath, 'utf8'));

function asUrls(website) {
  return Array.isArray(website) ? website : [website];
}

function hasNumericHostnamePart(url) {
  return /\d+/.test(new URL(url).hostname);
}

function createDiscoveryUrls(url) {
  const parsedUrl = new URL(url);
  const originalHostname = parsedUrl.hostname;
  const numericPart = originalHostname.match(/\d+/);

  if (!numericPart) {
    return [];
  }

  return Array.from({ length: DISCOVERY_MAX - DISCOVERY_MIN + 1 }, (_, index) => {
    const number = String(DISCOVERY_MIN + index).padStart(numericPart[0].length, '0');
    const hostname = originalHostname.replace(numericPart[0], number);
    const candidateUrl = new URL(parsedUrl.href);
    candidateUrl.hostname = hostname;
    return candidateUrl.href;
  });
}

async function checkUrl(page, url) {
  try {
    const response = await page.goto(url, {
      timeout: timing.requestTimeoutMs,
      waitUntil: 'domcontentloaded',
    });
    let angularLoaded = false;

    try {
      await page.waitForSelector('app-root[ng-version]', { timeout: timing.renderTimeoutMs, state: 'attached' });
      angularLoaded = true;
    } catch {
      // a reachable page can still fail the Angular check if it never renders the expected marker
    }

    const title = (await page.title()).trim();
    const titleMatches = title === 'Neptun Web';
    const confirmed = angularLoaded && titleMatches;
    const statusCode = response?.status() ?? 0;

    return {
      url,
      finalUrl: page.url(),
      status: statusCode,
      state: confirmed ? 'confirmed' : response?.ok() ? 'reachable-not-confirmed' : 'http-error',
      appRoot: angularLoaded,
      title: titleMatches,
      confirmed,
    };
  } catch (error) {
    return {
      url,
      state: error.name === 'AbortError' ? 'timeout' : 'unreachable',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const knownUrls = new Set();
const checks = [];

for (const [university, details] of Object.entries(universities)) {
  if (!details.supported) {
    continue;
  }

  for (const url of asUrls(details.website)) {
    if (!url) {
      continue;
    }

    knownUrls.add(url);
    checks.push({ university, url, discovered: false });
  }
}

if (discover) {
  const discoveredUrls = new Set();
  const configuredChecks = [...checks];

  for (const check of configuredChecks) {
    if (!Array.isArray(universities[check.university]?.website) || !hasNumericHostnamePart(check.url)) {
      continue;
    }

    for (const url of createDiscoveryUrls(check.url)) {
      if (knownUrls.has(url) || discoveredUrls.has(url)) {
        continue;
      }

      discoveredUrls.add(url);
      checks.push({ university: check.university, url, discovered: true });
    }
  }
}

const checksToRun = checks.filter(({ discovered }) => (validate ? !discovered : discovered));

const modeLabel = validate ? 'Validating' : 'Discovering';
console.log(`[SERVER CHECK] - ${modeLabel} ${checksToRun.length} servers with ${timing.delayMs}ms of delay.\n`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ userAgent: USER_AGENT });
const page = await context.newPage();
const summary = {
  validated: 0,
  reachedUnconfirmed: 0,
  unreached: 0,
  discovered: 0,
};
const results = [];

try {
  for (const [index, check] of checksToRun.entries()) {
    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, timing.delayMs));
    }

    const result = await checkUrl(page, check.url);
    const isDiscovered = check.discovered && result.confirmed;
    const status = isDiscovered ? 'discovered' : result.state === 'confirmed' ? 'confirmed' : result.state === 'reachable-not-confirmed' ? 'reached - not confirmed' : 'unreachable';
    const statusStyle = isDiscovered ? [ANSI.blue, '+'] : status === 'confirmed' ? [ANSI.green, '✓'] : status === 'reached - not confirmed' ? [ANSI.yellow, '?'] : [ANSI.red, '✗'];
    results.push({ university: check.university, ...result, status });

    if (isDiscovered) {
      summary.discovered += 1;
    } else if (status === 'confirmed') {
      summary.validated += 1;
    } else if (status === 'reached - not confirmed') {
      summary.reachedUnconfirmed += 1;
    } else {
      summary.unreached += 1;
    }

    console.log(`[TARGET] - ${check.url}: ${statusStyle[0]}(${status}) ${statusStyle[1]}${ANSI.reset}`);
  }
} finally {
  await context.close();
  await browser.close();
}

console.log('\n[SUMMARY]\n');
console.log(`• Total: ${checksToRun.length}`);
if (validate) {
  console.log(`• Successfully validated: ${ANSI.green}${summary.validated}${ANSI.reset} ${ANSI.green}✓${ANSI.reset}`);
  console.log(`• Reached but not validated: ${ANSI.yellow}${summary.reachedUnconfirmed}${ANSI.reset} ${ANSI.yellow}?${ANSI.reset}`);
  console.log(`• Unreachable: ${ANSI.red}${summary.unreached}${ANSI.reset} ${ANSI.red}✗${ANSI.reset}`);
} else {
  console.log(`• Discovered: ${ANSI.blue}${summary.discovered}${ANSI.reset} ${ANSI.blue}+${ANSI.reset}`);
  console.log(`• Unreachable: ${ANSI.red}${summary.unreached}${ANSI.reset} ${ANSI.red}✗${ANSI.reset}`);
}

if (jsonOutputPath) {
  await writeFile(jsonOutputPath, `${JSON.stringify({ mode: modeLabel, total: checksToRun.length, summary, results }, null, 2)}\n`);
}
