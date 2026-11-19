import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// The chat template was assembled from two copies of the same HTML document.
// Browsers drop the nested <html>/<head>/<body> tags but still render the
// duplicated <header> and run the duplicated analytics <script> blocks. The
// second copy also points the stylesheet at the author's local file:// path.
const html = fs.readFileSync(
  path.join(process.cwd(), "templates", "index.html"),
  "utf8",
);

const count = (pattern) => (html.match(pattern) || []).length;

assert.equal(
  count(/<!DOCTYPE\s+html>/gi),
  1,
  "templates/index.html must contain exactly one document declaration",
);
assert.equal(count(/<html(?:\s|>)/gi), 1, "more than one <html> element");
assert.equal(count(/<body(?:\s|>)/gi), 1, "more than one <body> element");
assert.equal(
  count(/class="site-header"/g),
  1,
  "the site header is rendered more than once",
);
assert.equal(
  count(/dataLayer', 'GTM-NNH87PC'\)/g),
  1,
  "Google Tag Manager is initialised more than once",
);
assert.ok(
  !html.includes("file:///E:/"),
  "template references a developer-local file:/// stylesheet",
);

console.log("template contains a single HTML document");
