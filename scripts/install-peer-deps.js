#!/usr/bin/env node

const path = require('path');
const fs = require('bfile');
const assert = require('bsert');
const { execSync } = require('child_process');
const blgr = require('blgr');
const semver = require('semver');

const logger = new blgr('info');
logger.open();

const dir = __dirname;
const root = path.dirname(dir);

const pkg = path.resolve(root, 'package.json');
const modules = path.resolve(root, 'node_modules');

const json = require(pkg);

const { peerDependencies } = json;

const install = [];

for (let [package, version] of Object.entries(peerDependencies)) {
  const packagePath = path.resolve(modules, package);
  // check if not present in node modules
  // this is naive and doesn't check version of
  // previously installed package
  if (!fs.existsSync(packagePath)) {
    // check if semver
    let packageVer;
    try {
      packageVer = semver.parse(version);
    } catch (e) {
      logger.info(`problem parsing semantic version: ${package}@${version}`);
      logger.info(e.message);
      process.exit(1);
    }
    install.push(`${package}@${version}`);
  } else
    logger.info(`${package} already found, skipping`);
}

if (install.length > 0) {
  try {
    const opt = install.join(' ')
    const cmd = `npm install --no-save ${opt}`;
    logger.info('running command:');
    logger.info(cmd);
    execSync(cmd, {
      stdio: [0, 1, 2],
      cwd: root,
    });
    logger.info('successful peer deps install');
  } catch (e) {
    logger.info('error installing peer deps');
    logger.info(e.message);
    process.exit(1);
  }
}
