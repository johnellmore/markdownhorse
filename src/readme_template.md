# :horse: markdown.horse :horse:

**_Write markdown files, serve them as HTML._**

Add this line to the beginning of any Markdown document:

```html
{LATEST_TAG}
```

and change the extension to `.html` or `.md.html`. When you open the file in a browser, you'll see nicely-rendered Markdown--no extra work required.

## Features

- **CommonMark spec**
- **Inline HTML**
- **Emoji**. Example: `:horse:` shows :horse:.
- **Code syntax highlighting** via [highlight.js](https://www.npmjs.com/package/highlight.js)
- **Heading anchors**. Example: [`{BUILD_DOMAIN}/#supports`](//{BUILD_DOMAIN}/#supports)
- **Single external JS file**. Only requires one additional network resource.
- **Version-pinned**. The `integrity` attribute guarantees that the JS won't change later and inject ads or something. Old versions will remain perpetually available (barring security issues).

## Known issues

- There's a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) before markdown.horse initializes the page.
- If you use `<script>` tags in your Markdown doc, they'll run twice: on initial document load, and again after markdown.horse formats everything.
- No automatic dark mode (yet) for those with browser/OS preferences set to dark mode.
- The JS file is a little big ({BUNDLE_SIZE}). It's mostly language definitions for syntax highlighting.

---

_MIT Licensed. Inspired by [MarkDeep](https://casual-effects.com/markdeep/). [Contribute on Github](https://github.com/johnellmore/markdownhorse)._