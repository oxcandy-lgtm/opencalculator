import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const scanner = resolve("scripts/public-safety.mjs");

function temporaryDirectory() {
  return mkdtempSync(join(tmpdir(), "open-calculator-safety-"));
}

function runPath(path, environment = {}) {
  return spawnSync(process.execPath, [scanner, "--path", path], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...environment },
    windowsHide: true
  });
}

function withFixture(content, callback, filename = "fixture.txt") {
  const directory = temporaryDirectory();
  try {
    const path = join(directory, filename);
    writeFileSync(path, content, "utf8");
    return callback(path, directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function expectFinding(result, ruleId) {
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, new RegExp(`${ruleId} .*:1`));
}

test("clean public documentation passes", () => {
  withFixture("Open Calculator uses SAI EpochCast and CCL.\n", (path) => {
    const result = runPath(path);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Public-safety scan passed:/);
  });
});

test("Open Calculator, SAI, EpochCast, CCL, and public technology names are allowed", () => {
  withFixture("Open Calculator SAI EpochCast CCL GPT-5.6 Codex OpenAI Cloudflare Rust WebAssembly SQLite\n", (path) => {
    const result = runPath(path);
    assert.equal(result.status, 0, result.stderr);
  });
});

test("private key marker is blocked without echoing the full fixture", () => {
  const dangerous = ["-----BEGIN ", "PRIVATE KEY-----"].join("");
  withFixture(`${dangerous}\nsynthetic-body\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "PRIVATE_KEY_BLOCK");
    assert.doesNotMatch(result.stderr, /synthetic-body/);
  });
});

test("OpenAI-shaped key is blocked and not printed", () => {
  const value = ["sk", "-", "proj", "-", "A".repeat(28)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "OPENAI_API_KEY");
    assert.equal(result.stderr.includes(value), false);
  });
});

test("classic GitHub token shape is blocked", () => {
  const value = ["ghp", "_", "B".repeat(30)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "GITHUB_TOKEN");
    assert.equal(result.stderr.includes(value), false);
  });
});

test("fine-grained GitHub token shape is blocked", () => {
  const value = ["github", "_pat", "_", "C".repeat(30)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "GITHUB_FINE_GRAINED_TOKEN");
  });
});

test("AWS access-key shape is blocked", () => {
  const value = ["AK", "IA", "1".repeat(16)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "AWS_ACCESS_KEY");
  });
});

test("credential-bearing authorization header is blocked", () => {
  const value = ["Author", "ization", ": Bearer ", "D".repeat(24)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "AUTHORIZATION_CREDENTIAL");
  });
});

test("cookie header with a value is blocked", () => {
  const value = ["Cook", "ie", ": session=", "E".repeat(16)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "COOKIE_CREDENTIAL");
  });
});

test("webhook URL shape is blocked", () => {
  const value = ["https", "://", "hooks.slack.com", "/services/", "A/B/", "F".repeat(24)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "WEBHOOK_URL");
  });
});

test("non-example email is blocked", () => {
  const value = ["person", "@", "private-domain", ".invalid"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "NON_EXAMPLE_EMAIL");
  });
});

test("example email is allowed", () => {
  const value = ["author", "@", "example", ".com"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    assert.equal(result.status, 0, result.stderr);
  });
});

test("ordinary IPv4 address is blocked", () => {
  const value = ["8", ".8", ".4", ".4"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "IPV4_ADDRESS");
  });
});

test("reserved documentation IPv4 address is allowed", () => {
  const value = ["192", ".0", ".2", ".44"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    assert.equal(result.status, 0, result.stderr);
  });
});

test("expanded IPv6 address is blocked", () => {
  const value = Array(8).fill("abcd").join(":");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "IPV6_ADDRESS");
  });
});

test("Windows absolute path is blocked", () => {
  const value = ["C:", "\\", "Users", "\\", "private-user", "\\", "secret.txt"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "WINDOWS_ABSOLUTE_PATH");
  });
});

test("user home path is blocked", () => {
  const value = ["/", "home", "/", "private-user", "/", "workspace", "/", "file.txt"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "USER_HOME_PATH");
  });
});

test("private hostname is blocked", () => {
  const value = ["database", ".", "service", ".", "internal"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "PRIVATE_HOSTNAME");
  });
});

test("secret-like environment assignment is blocked", () => {
  const value = ["SERVICE", "_TOKEN", "=", "G".repeat(20)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    expectFinding(result, "SECRET_ASSIGNMENT");
  });
});

test("redacted environment assignment is allowed", () => {
  const value = ["SERVICE", "_TOKEN", "=", "<redacted>"].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    assert.equal(result.status, 0, result.stderr);
  });
});

test("private denylist terms are treated literally", () => {
  const directory = temporaryDirectory();
  try {
    const target = join(directory, "target.txt");
    const denylist = join(directory, "denylist.txt");
    const literal = ["private", ".", "name", "+", "marker"].join("");
    writeFileSync(target, `prefix ${literal} suffix\n`, "utf8");
    writeFileSync(denylist, `${literal}\n`, "utf8");
    const result = runPath(target, { OPENCALCULATOR_PRIVATE_DENYLIST_FILE: denylist });
    expectFinding(result, "PRIVATE_DENYLIST_TERM");
    assert.equal(result.stderr.includes(literal), false);
    assert.equal(result.stderr.includes(denylist), false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("configured unreadable denylist fails closed", () => {
  withFixture("clean\n", (path, directory) => {
    const missing = join(directory, "missing-denylist.txt");
    const result = runPath(path, { OPENCALCULATOR_PRIVATE_DENYLIST_FILE: missing });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /PRIVATE_DENYLIST_READ_ERROR/);
  });
});

test("missing scan path fails closed", () => {
  const directory = temporaryDirectory();
  try {
    const result = runPath(join(directory, "missing.txt"));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SCAN_READ_ERROR/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("directory mode scans nested text files", () => {
  const directory = temporaryDirectory();
  try {
    const nested = join(directory, "nested");
    mkdirSync(nested);
    const value = ["host", ".", "local"].join("");
    writeFileSync(join(nested, "file.md"), `${value}\n`, "utf8");
    const result = runPath(directory);
    expectFinding(result, "PRIVATE_HOSTNAME");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("binary files are ignored", () => {
  const directory = temporaryDirectory();
  try {
    const binaryPath = join(directory, "fixture.txt");
    const prefix = Buffer.from([0, 1, 2, 3]);
    const dangerous = Buffer.from([65, 75, 73, 65, ...Array(16).fill(49)]);
    writeFileSync(binaryPath, Buffer.concat([prefix, dangerous]));
    const result = runPath(binaryPath);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("finding output contains rule, path, and line but not matched value", () => {
  const value = ["token", "_SECRET", "=", "H".repeat(20)].join("");
  withFixture(`${value}\n`, (path) => {
    const result = runPath(path);
    assert.match(result.stderr, /SECRET_ASSIGNMENT .*:1/);
    assert.equal(result.stderr.includes(value), false);
  });
});
