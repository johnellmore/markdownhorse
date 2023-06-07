## Features

- **CommonMark spec**
- **Inline HTML**
- **Emoji**. For example, `:horse:` shows :horse:.
- **Code syntax highlighting** via [highlight.js](https://www.npmjs.com/package/highlight.js)
- **Heading anchors**. For example: [`{BUILD_DOMAIN}/#features`](//{BUILD_DOMAIN}/#features)
- **Single external JS file**. Only requires one additional network resource.
- **Works locally**. No HTTP server needed; local `.md`/`.html` files work great without being uploaded anywhere.
- **Version-pinned**. The `integrity` attribute guarantees that the JS won't change later and inject ads or something. Old versions will remain perpetually available (barring security issues).

## Known issues

- There's a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) before markdown.horse loads. The JS asset has a `cache-control: immutable` header, so the FOUC doesn't normally appear on subsequent page loads.
- If you use `<script>` tags in your Markdown doc, they'll run twice: on initial document load, and again after markdown.horse formats everything.
- No automatic dark mode (yet) for those with browser/OS preferences set to dark mode.

---

_MIT Licensed. Inspired by [MarkDeep](https://casual-effects.com/markdeep/). [Contribute on Github](https://github.com/johnellmore/markdownhorse)._
