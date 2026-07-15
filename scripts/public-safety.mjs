#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".csv", ".html", ".http", ".js", ".json", ".jsonc",
  ".lock", ".md", ".mjs", ".ndjson", ".sh", ".sql", ".svg", ".toml",
  ".ts", ".tsx", ".txt", ".wasm.txt", ".xml", ".yaml", ".yml"
]);

const TEXT_FILENAMES = new Set([
  ".editorconfig", ".env.example", ".env.sample", ".gitattributes", ".gitignore",
  "CITATION.cff", "CODE_OF_CONDUCT", "CONTRIBUTING", "LICENSE", "README", "SECURITY"
]);

function rule(id, source, flags = "g") {
  return { id, pattern: new RegExp(source, flags) };
}

const dash = "-";
const underscore = "_";
const slash = "/";
const colon = ":";

const RULES = [
  rule("PRIVATE_KEY_BLOCK", ["-----BEGIN ", "(?:RSA |EC |DSA |OPENSSH )?", "PRIVATE KEY-----"].join("")),
  rule("OPENAI_API_KEY", ["\\bsk", dash, "(?:proj", dash, ")?[A-Za-z0-9_", dash, "]{20,}\\b"].join("")),
  rule("GITHUB_TOKEN", ["\\b(?:ghp|gho|ghu|ghs|ghr)", underscore, "[A-Za-z0-9]{20,}\\b"].join("")),
  rule("GITHUB_FINE_GRAINED_TOKEN", ["\\bgithub_pat", underscore, "[A-Za-z0-9_]{20,}\\b"].join("")),
  rule("AWS_ACCESS_KEY", "\\bAKIA[0-9A-Z]{16}\\b"),
  rule("AUTHORIZATION_CREDENTIAL", "Authorization\\s*:\\s*(?:Bearer|Basic)\\s+[A-Za-z0-9._~+/=-]{12,}", "gi"),
  rule("COOKIE_CREDENTIAL", "Cookie\\s*:\\s*[^\\n]{8,}", "gi"),
  rule("WEBHOOK_URL", ["https", colon, "\\/\\/(?:hooks\\.slack\\.com\\/services|discord(?:app)?\\.com\\/api\\/webhooks)\\/[^\\s<]+"].join(""), "gi"),
  rule("NON_EXAMPLE_EMAIL", "\\b[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!example\\.(?:com|org|net)\\b)[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+\\b", "gi"),
  rule("IPV4_ADDRESS", "\\b(?:(?:25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\\.){3}(?:25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\\b"),
  rule("IPV6_ADDRESS", "\\b(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\\b"),
  rule("WINDOWS_ABSOLUTE_PATH", "\\b[A-Za-z]:\\\\(?:[^\\\\\\s\"'`]+\\\\)+[^\\\\\\s\"'`]*"),
  rule("USER_HOME_PATH", "(?:^|[\\s\"'`(])(?:/Users|/home)/[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)+"),
  rule("PRIVATE_HOSTNAME", "\\b[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.(?:internal|local|lan|ts\\.net)\\b", "gi"),
  rule("SECRET_ASSIGNMENT", "\\b[A-Z0-9_]*(?:API_KEY|ACCESS_KEY|TOKEN|SECRET|PASSWORD|WEBHOOK)[A-Z0-9_]*\\s*=\\s*(?!<redacted>|<token>|<secret>|example|test-only|synthetic)[^\\s#]{8,}", "gi"),
  rule("SOURCE_MAP_LOCAL_PATH", "\"sourceRoot\"\\s*:\\s*\"/(?!/)[^\"]+\"", "g")
];

const SAFE_IPV4_PREFIXES = ["192.0.2.", "198.51.100.", "203.0.113."];
const SAFE_IPV6 = new Set(["2001:db8:0:0:0:0:0:1"]);

function normalizePath(path) {
  return path.replaceAll("\\\\", "/");
}

function isTextPath(path) {
  const name = basename(path);
  const extension = extname(name).toLowerCase();
  if (TEXT_EXTENSIONS.has(extension)) return true;
  if (TEXT_FILENAMES.has(name)) return true;
  return [...TEXT_FILENAMES].some((base) => name.startsWith(`${base}.`));
}

function loadPrivateDenylist() {
  const configuredPath = process.env.OPENCALCULATOR_PRIVATE_DENYLIST_FILE;
  if (!configuredPath) return [];

  let text;
  try {
    text = readFileSync(configuredPath, "utf8");
  } catch {
    throw new Error("PRIVATE_DENYLIST_READ_ERROR");
  }

  return text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function lineNumberForOffset(text, offset) {
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (text.charCodeAt(index) === 10) line += 1;
  }
  return line;
}

function lineAt(text, offset) {
  const start = text.lastIndexOf("\n", Math.max(0, offset - 1)) + 1;
  const endCandidate = text.indexOf("\n", offset);
  const end = endCandidate === -1 ? text.length : endCandidate;
  return text.slice(start, end);
}

function isRuleDefinitionExemption(ruleId, relativePath, line) {
  if (relativePath !== "scripts/public-safety.mjs") return false;
  if (!line.includes("rule(")) return false;
  return line.includes(`\"${ruleId}\"`);
}

function isDocumentationExemption(ruleId, relativePath, matchedText, line) {
  if (isRuleDefinitionExemption(ruleId, relativePath, line)) return true;

  if (ruleId === "IPV4_ADDRESS") {
    return SAFE_IPV4_PREFIXES.some((prefix) => matchedText.startsWith(prefix));
  }

  if (ruleId === "IPV6_ADDRESS" && SAFE_IPV6.has(matchedText)) return true;

  if (ruleId === "USER_HOME_PATH") {
    const trimmed = matchedText.trim();
    if (trimmed.includes("<local-path>") || trimmed.includes("/user/")) return true;
  }

  return false;
}

function findRuleViolations(text, relativePath) {
  const findings = [];

  for (const { id, pattern } of RULES) {
    const expression = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = expression.exec(text)) !== null) {
      const matchedText = match[0];
      const line = lineAt(text, match.index);
      if (isDocumentationExemption(id, relativePath, matchedText, line)) continue;
      findings.push({ ruleId: id, path: relativePath, line: lineNumberForOffset(text, match.index) });
      if (match[0].length === 0) expression.lastIndex += 1;
    }
  }

  return findings;
}

function findPrivateTerms(text, relativePath, terms) {
  const findings = [];
  for (const term of terms) {
    let offset = text.indexOf(term);
    while (offset !== -1) {
      findings.push({
        ruleId: "PRIVATE_DENYLIST_TERM",
        path: relativePath,
        line: lineNumberForOffset(text, offset)
      });
      offset = text.indexOf(term, offset + Math.max(1, term.length));
    }
  }
  return findings;
}

function scanFile(filePath, displayPath, privateTerms) {
  if (!isTextPath(filePath)) return { scanned: false, findings: [] };

  let buffer;
  try {
    buffer = readFileSync(filePath);
  } catch {
    return {
      scanned: true,
      findings: [{ ruleId: "SCAN_READ_ERROR", path: displayPath, line: 0 }]
    };
  }

  if (buffer.includes(0)) return { scanned: false, findings: [] };

  const text = buffer.toString("utf8");
  return {
    scanned: true,
    findings: [
      ...findRuleViolations(text, displayPath),
      ...findPrivateTerms(text, displayPath, privateTerms)
    ]
  };
}

function walkPath(targetPath, rootPath, privateTerms, findings, scannedPaths) {
  let metadata;
  try {
    metadata = statSync(targetPath);
  } catch {
    findings.push({ ruleId: "SCAN_READ_ERROR", path: normalizePath(relative(rootPath, targetPath) || targetPath), line: 0 });
    return;
  }

  if (metadata.isFile()) {
    const displayPath = normalizePath(relative(rootPath, targetPath) || basename(targetPath));
    const result = scanFile(targetPath, displayPath, privateTerms);
    if (result.scanned) scannedPaths.push(displayPath);
    findings.push(...result.findings);
    return;
  }

  if (!metadata.isDirectory()) return;

  let entries;
  try {
    entries = readdirSync(targetPath, { withFileTypes: true });
  } catch {
    findings.push({ ruleId: "SCAN_READ_ERROR", path: normalizePath(relative(rootPath, targetPath) || targetPath), line: 0 });
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory() && [".git", "node_modules", "coverage", "dist", "build"].includes(entry.name)) continue;
    walkPath(join(targetPath, entry.name), rootPath, privateTerms, findings, scannedPaths);
  }
}

function trackedFiles() {
  const result = spawnSync("git", ["ls-files", "-z"], {
    encoding: "utf8",
    timeout: 30_000,
    windowsHide: true
  });

  if (result.error || result.status !== 0) throw new Error("TRACKED_FILE_ENUMERATION_ERROR");
  return result.stdout.split("\0").filter(Boolean);
}

function parseArguments(argv) {
  if (argv.length === 0 || (argv.length === 1 && argv[0] === "--tracked")) {
    return { mode: "tracked", target: null, reportPaths: false };
  }

  if (argv[0] === "--path" && argv[1] && argv.length <= 3) {
    return { mode: "path", target: argv[1], reportPaths: argv[2] === "--report-scanned-paths" };
  }

  if (argv.length === 2 && argv[0] === "--tracked" && argv[1] === "--report-scanned-paths") {
    return { mode: "tracked", target: null, reportPaths: true };
  }

  throw new Error("USAGE_ERROR");
}

function main() {
  let options;
  let privateTerms;
  try {
    options = parseArguments(process.argv.slice(2));
    privateTerms = loadPrivateDenylist();
  } catch (error) {
    const code = error instanceof Error ? error.message : "SCAN_CONFIGURATION_ERROR";
    console.error(code);
    process.exitCode = 1;
    return;
  }

  const rootPath = resolve(process.cwd());
  const findings = [];
  const scannedPaths = [];

  if (options.mode === "tracked") {
    let files;
    try {
      files = trackedFiles();
    } catch (error) {
      const code = error instanceof Error ? error.message : "TRACKED_FILE_ENUMERATION_ERROR";
      console.error(code);
      process.exitCode = 1;
      return;
    }

    for (const trackedPath of files) {
      const absolutePath = resolve(rootPath, trackedPath);
      let metadata;
      try {
        metadata = statSync(absolutePath);
      } catch {
        findings.push({ ruleId: "SCAN_READ_ERROR", path: normalizePath(trackedPath), line: 0 });
        continue;
      }
      if (!metadata.isFile()) continue;
      const result = scanFile(absolutePath, normalizePath(trackedPath), privateTerms);
      if (result.scanned) scannedPaths.push(normalizePath(trackedPath));
      findings.push(...result.findings);
    }
  } else {
    const targetPath = resolve(rootPath, options.target);
    walkPath(targetPath, rootPath, privateTerms, findings, scannedPaths);
  }

  findings.sort((left, right) =>
    left.path.localeCompare(right.path) || left.line - right.line || left.ruleId.localeCompare(right.ruleId)
  );

  if (options.reportPaths) {
    for (const path of [...new Set(scannedPaths)].sort()) console.log(`SCANNED ${path}`);
  }

  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(`${finding.ruleId} ${finding.path}:${finding.line}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Public-safety scan passed: ${new Set(scannedPaths).size} file(s) scanned, no findings.`);
}

main();
