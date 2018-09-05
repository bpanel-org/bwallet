const fs = require('fs');

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
    '--ignore-certificate-errors',
    '--disable-web-security',
    '--no-sandbox',
    '--disable-gpu',
    '--headless',
  ];

  config.set({
    // Project configurations
    basePath: '..',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/hardwareWallet.js',
    ],
    exclude: ['node_modules/**/test/*.js'],
    preprocessors: {
      'test/hardwareWallet.js': ['webpack']
    },
    webpack: webpackConfigs,

    // Karma configs
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-mocha-reporter'),
    ],

    // web server configurations
    // use TLS for u2f
    port: 9876,
    protocol: 'https:',
    httpsServerOptions: httpsOptions,

    // Disable Certificate checks
    browsers: ['ChromeHeadless_custom'],
    customLaunchers: {
      ChromeHeadless_custom: {
        base: 'ChromeHeadless',
        options: {
          flags: browserFlags
        },
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
