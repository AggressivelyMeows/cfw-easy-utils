---
id: install
title: Installation
sidebar_label: Installation
slug: /
---

Welcome to easy-utils, the best helper package for Cloudflare Workers! Get started with `cfw-easy-utils` using this guide.

### Why?
easy-utils was created by Cerulean to ease developer stress and reduce code clutter, making developing with easy-utils a must. Instead of manually calling `JSON.stringify` and setting the correct Content-Type headers, `response.json` makes it ultra simple to return JSON from your worker. This is just one example of how easy-utils can help you. It also handles CORS for you so you dont have to inject CORS headers into every response.

Responses are not all that easy-utils can do. We have helper functions for a bunch of common tasks with Workers.

:::info
While this package is focused on Cloudflare Workers, this package can run in any environment that has Request or Response objects built into JS.
:::
### NPM
`npm i cfw-easy-utils@latest`

### Wrangler template
Installs a basic Worker template along side easy-utils.

`wrangler generate projectname https://github.com/aggressivelymeows/cfw-easy-utils-template`  

