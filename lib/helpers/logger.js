const blgr = require('blgr');

// TODO: default to info level
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const logger = new blgr(LOG_LEVEL);

// set different contexts here
logger.context('actions');

logger.open();

if (window)
  window.logger = logger;

module.exports = {
  actionsLogger: logger.contexts.actions,
};

