export interface CdnLib {
  name: string;
  version: string;
  cdnUrl: string;
  homepage: string;
}

export const CDN_LIBS: CdnLib[] = [
  { name: 'React', version: '18.2.0', cdnUrl: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js', homepage: 'https://react.dev' },
  { name: 'React DOM', version: '18.2.0', cdnUrl: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js', homepage: 'https://react.dev' },
  { name: 'Vue.js', version: '3.4.21', cdnUrl: 'https://unpkg.com/vue@3.4.21/dist/vue.global.prod.js', homepage: 'https://vuejs.org' },
  { name: 'jQuery', version: '3.7.1', cdnUrl: 'https://code.jquery.com/jquery-3.7.1.min.js', homepage: 'https://jquery.com' },
  { name: 'Lodash', version: '4.17.21', cdnUrl: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', homepage: 'https://lodash.com' },
  { name: 'Axios', version: '1.6.7', cdnUrl: 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js', homepage: 'https://axios-http.com' },
  { name: 'Bootstrap CSS', version: '5.3.3', cdnUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', homepage: 'https://getbootstrap.com' },
  { name: 'Bootstrap JS', version: '5.3.3', cdnUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', homepage: 'https://getbootstrap.com' },
  { name: 'Tailwind CSS', version: '3.4.1', cdnUrl: 'https://cdn.tailwindcss.com', homepage: 'https://tailwindcss.com' },
  { name: 'D3.js', version: '7.9.0', cdnUrl: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js', homepage: 'https://d3js.org' },
  { name: 'Chart.js', version: '4.4.2', cdnUrl: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js', homepage: 'https://www.chartjs.org' },
  { name: 'Three.js', version: '0.162.0', cdnUrl: 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.min.js', homepage: 'https://threejs.org' },
  { name: 'Moment.js', version: '2.30.1', cdnUrl: 'https://cdn.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js', homepage: 'https://momentjs.com' },
  { name: 'Day.js', version: '1.11.10', cdnUrl: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js', homepage: 'https://day.js.org' },
  { name: 'Anime.js', version: '3.2.2', cdnUrl: 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js', homepage: 'https://animejs.com' },
  { name: 'Alpine.js', version: '3.13.5', cdnUrl: 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js', homepage: 'https://alpinejs.dev' },
  { name: 'GSAP', version: '3.12.5', cdnUrl: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', homepage: 'https://gsap.com' },
  { name: 'Highlight.js', version: '11.9.0', cdnUrl: 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js', homepage: 'https://highlightjs.org' },
];

export function getScriptTag(lib: CdnLib): string {
  if (lib.cdnUrl.endsWith('.css')) return `<link rel="stylesheet" href="${lib.cdnUrl}">`;
  return `<script src="${lib.cdnUrl}"></script>`;
}

export function filterLibs(libs: CdnLib[], query: string): CdnLib[] {
  if (!query.trim()) return libs;
  const q = query.toLowerCase();
  return libs.filter(l => l.name.toLowerCase().includes(q));
}
