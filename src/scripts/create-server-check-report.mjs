import { appendFileSync, readFileSync } from 'node:fs';

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (!summaryPath) {
  throw new Error('GITHUB_STEP_SUMMARY is not available.');
}

const now = new Date();
const runDate = `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}.${String(now.getUTCDate()).padStart(2, '0')} - ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
const escapeTableCell = (value) => String(value).replaceAll('|', '\\|');
const outcomeLabel = (outcome) => (outcome === 'success' ? ':heavy_check_mark: Passed' : outcome === 'skipped' ? ':fast_forward: Skipped' : `:x: ${outcome || 'Unknown'}`);
const lines = [
  '# Neptun WebServer check',
  '',
  `**Run date:** ${runDate}`,
  '',
  '### Workflow steps',
  '',
  '| Step | Outcome |',
  '| :--------------------------- | :---------------------- |',
  `| Validate configured servers | ${outcomeLabel(process.env.VALIDATE_OUTCOME)} |`,
  `| Evaluate validation pass rate | ${outcomeLabel(process.env.EVALUATE_OUTCOME)} |`,
  `| Discover additional servers | ${outcomeLabel(process.env.DISCOVER_OUTCOME)} |`,
  `| Add discovered servers | ${outcomeLabel(process.env.UPDATE_OUTCOME)} |`,
  '',
  '### Validation',
  '',
];

try {
  const results = JSON.parse(readFileSync('validate-results.json', 'utf8'));
  const { validated, reachedUnconfirmed, unreached } = results.summary;
  const total = results.total;
  const rate = total === 0 ? 0 : (validated / total) * 100;
  const failed = results.results.filter(({ status }) => status === 'unreachable' || status === 'reached - not confirmed');

  lines.push(
    '| Metric | Count |',
    '| :--------------------------- | ----------------------: |',
    `| Successfully validated | ${validated} :heavy_check_mark: |`,
    `| Reached but not validated | ${reachedUnconfirmed} :question: |`,
    `| Unreachable | ${unreached} :x: |`,
    `| :pencil: Total | ${total} |`,
    `| :heavy_check_mark: Pass rate | ${rate.toFixed(1)}% (required: 75.0%) |`,
    '',
    '### Failed hosts',
    '',
  );

  if (failed.length === 0) {
    lines.push('No failed hosts.', '');
  } else {
    lines.push('| University | Webserver | Result |', '| :----------------- | :----------------------- | :---------------------- |');
    for (const result of failed) {
      lines.push(`| ${escapeTableCell(result.university)} | ${escapeTableCell(result.url)} | ${escapeTableCell(result.status)} |`);
    }
    lines.push('');
  }
} catch {
  lines.push('Validation results were not produced.', '');
}

try {
  const results = JSON.parse(readFileSync('discovery-results.json', 'utf8'));
  const discovered = results.results.filter(({ status }) => status === 'discovered');

  lines.push(
    '---',
    '',
    '### Discovery',
    '',
    '| Metric | Count |',
    '| -------------- | ------------------: |',
    `| Unreachable | ${results.summary.unreached} :x: |`,
    `| Discovered | ${results.summary.discovered} :heavy_plus_sign: |`,
    `| :pencil: Total | ${results.total} |`,
    '',
    '#### New hosts',
    '',
  );

  if (discovered.length === 0) {
    lines.push('No new webserver discovered.', '');
  } else {
    lines.push('| University | Webserver |', '| :------------- | -------------------: |');
    for (const result of discovered) {
      lines.push(`| ${escapeTableCell(result.university)} | ${escapeTableCell(result.url)} |`);
    }
    lines.push('');
  }
} catch {
  lines.push('---', '', '### Discovery', '', 'Discovery results were not produced.', '');
}

appendFileSync(summaryPath, `${lines.join('\n')}\n`);
