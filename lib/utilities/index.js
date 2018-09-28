const { HardwareWallet } = require('./hardwareWallet');
import { tobip44Account } from './path';
import { getxpub } from './hardware';

module.exports = {
  HardwareWallet,
  tobip44Account,
  getxpub,
};
