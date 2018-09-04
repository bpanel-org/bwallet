#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { execSync } = require('child_process');
const blgr = require('blgr');

const dir = __dirname;
const root = path.dirname(dir);

const pkg = path.resolve(root, 'package.json');
const modules = path.resolve(root, 'node_modules');

const json = require(pkg);

const { peerDependencies } = json;

const install = [];

// TODO: update to properly capture prefix ~ and ^
const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/;

for (let [package, version] of Object.entries(peerDependencies)) {
  const packagePath = path.resolve(modules, package);
  // check if not present in node modules
  if (!fs.existsSync(packagePath)) {
    // check if semver
    if (regex.test(version))
      install.push(`${package}@${version}`);
    else
      install.push(package);
  } else
    console.log(`${package} already found, skipping`)
}

if (install.length > 0) {
  const opt = install.join(' ')
  const cmd = `npm install --no-save ${opt}`;
  // use blgr
  console.log(cmd)
  execSync(cmd, {
    stdio: [0, 1, 2],
    cwd: root,
  });
}


