---
id: install
title: Installation
sidebar_label: Installation
slug: /
---

Welcome to easy-utils, the best helper package for Cloudflare Workers! Get started with `cfw-easy-utils` using this guide.

### Why?
easy-utils was created by Cerulean to ease developer stress and reduce code clutter, making developing with easy-utils a must. Instead of manually calling `JSON.stringify` and setting the correct Content-Type headers, `response.json` makes it ultra simple to return JSON from your worker. This is just one example of how easy-utils can help you. It also handles CORS for you so you dont have to inject CORS headers into every response.

easy-utils also comes with a bunch of helper functions that make it easier to develop for CF workers. For example, easy-utils can be used to process cookies, headers, responses, and more.

Since this package is designed for Cloudflare Workers, it may not work in other environments. If your platform of choice is service worker based, it may support easy-utils.

### NPM
`npm i cfw-easy-utils@latest`

### Wrangler template
Installs a basic Worker template along side easy-utils.

`wrangler generate projectname https://github.com/aggressivelymeows/cfw-easy-utils-template`  

