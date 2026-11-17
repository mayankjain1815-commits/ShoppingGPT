import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Extract a top-level `function name(...) { ... }` declaration by matching braces.
function extractFunction(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start === -1) {
    return "";
  }
  let depth = 0;
  for (let i = source.indexOf("{", start); i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated function ${name}`);
}

const templatePath = path.join(process.cwd(), "templates", "index.html");
const html = fs.readFileSync(templatePath, "utf8");

// escapeHtml is the new helper; on revisions without it this is empty and the
// message text is inserted verbatim (the vulnerable behaviour under test).
const source = [
  extractFunction(html, "escapeHtml"),
  extractFunction(html, "appendMessage"),
].join("\n");

assert.notEqual(source.trim(), "", "appendMessage not found in templates/index.html");

let rendered = "";
const sandbox = {
  msgerChat: {
    insertAdjacentHTML(_position, markup) {
      rendered += markup;
    },
    scrollTop: 0,
  },
  formatDate: () => "00:00",
  console,
};
vm.runInNewContext(`${source}\nthis.appendMessage = appendMessage;`, sandbox);

const payload = '<img src=x onerror="alert(1)">\nsecond line';
sandbox.appendMessage("You", "avatar.svg", "right", payload);

assert.ok(
  !rendered.includes(payload.split("\n")[0]),
  `raw HTML from a chat message reached insertAdjacentHTML:\n${rendered}`,
);
assert.ok(
  rendered.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"),
  `expected the message body to be HTML-escaped:\n${rendered}`,
);
assert.ok(
  rendered.includes("second line"),
  `expected newline handling to keep the text:\n${rendered}`,
);

console.log("chat messages are HTML-escaped");
