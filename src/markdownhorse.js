import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItAnchors from 'markdown-it-anchor';
import css from "./styles.css";

function renderPage() {
  // make the page responsive
  const viewportTag = document.createElement("meta");
  viewportTag.name = "viewport";
  viewportTag.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewportTag);

  // add the stylesheet
  const styleTag = document.createElement("style");
  styleTag.innerText = css;
  document.head.appendChild(styleTag);

  // render the markdown
  const markdownContents = document.body.innerHTML;
  const renderer = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (__) { }
      }

      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
  renderer.use(markdownItEmoji);
  renderer.use(markdownItAnchors);
  const html = renderer.render(markdownContents);

  // replace the page contents with the rendered markdown
  document.body.innerHTML = `<div id="wrap">${html}</div>`;
}

// temp hack to prevent multiple renders
// TODO fix this--ALL scripts in the markdown doc run multiple times
if (globalThis._markdownHorseHasRendered === undefined) {
  window.addEventListener("load", renderPage);
  globalThis._markdownHorseHasRendered = true;
}
