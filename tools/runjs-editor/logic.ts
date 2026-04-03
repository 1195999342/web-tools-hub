// RunJS Editor logic

export function buildPreviewHTML(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
}
