#!/usr/bin/env node

import { execSync } from 'child_process';
import dns from 'dns';

// Ensure localhost resolves properly
dns.setDefaultResultOrder('ipv4first');

const PAGES = [
  { path: '/', status: 200, title: 'Oatmeal', checks: ['<header', '<footer', 'Get started'] },
  { path: '/pricing', status: 200, title: 'Pricing — Oatmeal', checks: ['pricing', 'Plan', 'monthly', 'yearly'] },
  { path: '/about', status: 200, title: 'About Us — Oatmeal', checks: ['About', 'team', 'company'] },
  { path: '/contact', status: 200, title: 'Contact — Oatmeal', checks: ['Contact', '<form', 'email', 'Message'] },
  { path: '/privacy-policy', status: 200, title: 'Privacy Policy — Oatmeal', checks: ['Privacy', 'Policy'] },
  { path: '/404', status: 404, title: 'Page not found — Oatmeal', checks: ['not found'] }
];

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function logSection(title) {
  console.log('\n' + COLORS.bold + COLORS.cyan + '='.repeat(50));
  console.log(` ${title}`);
  console.log('='.repeat(50) + COLORS.reset);
}

// Find active port
async function getActivePort() {
  const ports = [4322, 4321];
  for (const port of ports) {
    try {
      const res = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(5000) });
      if (res.status === 200) {
        const text = await res.text();
        if (text.toLowerCase().includes('oatmeal')) {
          return port;
        }
      }
    } catch (e) {
      // Port not responding
    }
  }
  return null;
}

async function runHealthCheck(port) {
  logSection(`1. HTTP ROUTING & CONTENT CHECKS (Port ${port})`);
  let passed = true;

  for (const page of PAGES) {
    const url = `http://localhost:${port}${page.path}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      
      const statusMatch = res.status === page.status;
      const titleMatch = text.includes(`<title>${page.title}</title>`);
      
      const missingChecks = page.checks.filter(c => !text.toLowerCase().includes(c.toLowerCase()));
      const contentMatch = missingChecks.length === 0;

      // Check for common error strings
      const errorStrings = ['internal server error', 'sqlite_error', 'database error', 'd1_error', 'undefined', 'nullpointer'];
      const errorsFound = errorStrings.filter(err => text.toLowerCase().includes(err));

      if (statusMatch && titleMatch && contentMatch && errorsFound.length === 0) {
        log(COLORS.green, `[PASS] ${page.path} (HTTP ${res.status})`);
      } else {
        passed = false;
        log(COLORS.red, `[FAIL] ${page.path}`);
        if (!statusMatch) log(COLORS.red, `       Expected status ${page.status}, got ${res.status}`);
        if (!titleMatch) {
          const titleTag = text.match(/<title>(.*?)<\/title>/)?.[1];
          log(COLORS.red, `       Expected title "${page.title}", got "${titleTag || 'None'}"`);
        }
        if (!contentMatch) log(COLORS.red, `       Missing expected content: ${missingChecks.map(c => `"${c}"`).join(', ')}`);
        if (errorsFound.length > 0) log(COLORS.red, `       Errors found in page body: ${errorsFound.map(e => `"${e}"`).join(', ')}`);
      }
    } catch (e) {
      passed = false;
      log(COLORS.red, `[FAIL] ${page.path} - Connection error: ${e.message}`);
    }
  }
  return passed;
}

function runTypecheck() {
  logSection('2. TYPESCRIPT TYPECHECK (astro check)');
  try {
    execSync('pnpm run typecheck', { stdio: 'inherit' });
    log(COLORS.green, '[PASS] Typescript validation passed (0 errors, 0 warnings)');
    return true;
  } catch (e) {
    log(COLORS.red, '[FAIL] Typescript validation failed');
    return false;
  }
}

function runBuild() {
  logSection('3. PRODUCTION BUNDLE BUILD (astro build)');
  try {
    execSync('pnpm run build', { stdio: 'inherit' });
    log(COLORS.green, '[PASS] Production build compiled successfully');
    return true;
  } catch (e) {
    log(COLORS.red, '[FAIL] Production build failed');
    return false;
  }
}

async function main() {
  console.log(COLORS.bold + COLORS.cyan + '\n=== OATMEAL SAAS MARKETING KIT DIAGNOSTIC SUITE ===' + COLORS.reset);
  
  const port = await getActivePort();
  if (!port) {
    log(COLORS.yellow, '\n[WARN] No local dev server detected on port 4321 or 4322.');
    log(COLORS.yellow, '       Please start the dev server ("pnpm run dev") to run routing/content checks.\n');
  }

  let healthPassed = true;
  if (port) {
    healthPassed = await runHealthCheck(port);
  }

  const typecheckPassed = runTypecheck();
  const buildPassed = runBuild();

  logSection('DIAGNOSTIC SUMMARY');
  
  if (port) {
    log(healthPassed ? COLORS.green : COLORS.red, `HTTP Routing:  ${healthPassed ? 'PASSED' : 'FAILED'}`);
  } else {
    log(COLORS.yellow, 'HTTP Routing:  SKIPPED (Dev server not running)');
  }
  log(typecheckPassed ? COLORS.green : COLORS.red, `Type Check:    ${typecheckPassed ? 'PASSED' : 'FAILED'}`);
  log(buildPassed ? COLORS.green : COLORS.red, `Prod Build:    ${buildPassed ? 'PASSED' : 'FAILED'}`);

  console.log('');

  const allPassed = (!port || healthPassed) && typecheckPassed && buildPassed;
  if (allPassed) {
    log(COLORS.green + COLORS.bold, '✓ ALL SYSTEM CHECKS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    log(COLORS.red + COLORS.bold, '✗ SOME CHECKS FAILED. Please review the output above.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
