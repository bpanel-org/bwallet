const fs = require('fs');
process.env.CHROME_BIN = require('puppeteer').executablePath();
process.env.CHROMIUM_BIN = require('puppeteer').executablePath();

// read https key/cert
const httpsOptions = {};
try {
  httpsOptions.cert = fs.readFileSync(`${__dirname}/certs/cert.pem`);
  httpsOptions.key = fs.readFileSync(`${__dirname}/certs/key.pem`);
} catch (e) {
  console.log(e);
  process.exit(1);
}

const webpackConfigs = require('./webpack');

module.exports = function(config) {

  const browserFlags = [
    '--no-sandbox',
    '--ignore-certificate-errors',
    '--disable-web-security',
    '--disable-setuid-sandbox',
  ];

  config.set({

    // Project configurations
    basePath: '..',
    frameworks: ['mocha'],
    files: [
      'test/hardwareWallet.js'
    ],
    exclude: [],
    preprocessors: {
      'test/hardwareWallet.js': ['webpack']
    },
    webpack: webpackConfigs,

    // Karma configs
    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher')
    ],

    // web server configurations
    // use TLS for u2f
    port: 9876,
    protocol: 'https:',
    httpsServerOptions: httpsOptions,

    // Disable Certificate checks
    browsers: ['Chrome_NoCerts'],
    customLaunchers: {
      Chrome_NoCerts: {
        base: 'Chrome',
        flags: browserFlags,
      }
    },

    // Karma run configs
    autoWatch: false,
    singleRun: true,
    concurrency: 1,

    // Karma reporting
    reporters: ['mocha'],
    colors: true,
    logLevel: config.LOG_INFO
  });
};
