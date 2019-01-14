# bPanel bwallet

Work in progress.

### Usage

Use as a plugin with `bPanel`

Install using `bpanel-cli`

```js
$ npm install -g bpanel-cli

$ bpanel-cli install @bpanel/bwallet
```

This will update the `bpanel` config file so that the plugins array contains `@bpanel/bwallet`.
`bpanel` will install the plugin during its build.

Note: To create a self signed certificate to run locally, use the command:

```
$ openssl req -newkey rsa:2048 -nodes -sha512 -x509 -days 3650 -nodes -subj '/CN=localhost' -out selfsigned.crt -keyout selfsigned.key
```

### Features

- Ledger Support
- Trezor Support
- Multisig Support
- Watch only wallets using extended public keys

