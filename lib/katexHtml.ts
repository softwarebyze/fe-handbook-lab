/** Self-contained HTML for WebView KaTeX (native). CDN; requires network on first paint. */

export function buildKaTeXDocument(
  latex: string,
  display: boolean,
  textColor: string,
  mathBg: string
): string {
  const safe = JSON.stringify(latex);
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous" />
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  body {
    margin: 0;
    padding: 10px 8px;
    background: ${mathBg};
    display: flex;
    justify-content: ${display ? 'center' : 'flex-start'};
    align-items: center;
    min-height: 40px;
    box-sizing: border-box;
  }
  .katex { color: ${textColor} !important; font-size: ${display ? '1.12em' : '1.02em'} !important; }
  .katex-display { margin: 0 !important; }
</style>
</head>
<body>
  <div id="m"></div>
  <script>
    function sendH() {
      var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(String(Math.ceil(h)));
    }
    function paint() {
      try {
        katex.render(${safe}, document.getElementById('m'), {
          displayMode: ${display ? 'true' : 'false'},
          throwOnError: false,
          strict: false,
          trust: false
        });
      } catch (e) {
        document.getElementById('m').textContent = 'Math error';
      }
      sendH();
      setTimeout(sendH, 60);
      setTimeout(sendH, 200);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', paint);
    } else {
      paint();
    }
  </script>
</body></html>`;
}
