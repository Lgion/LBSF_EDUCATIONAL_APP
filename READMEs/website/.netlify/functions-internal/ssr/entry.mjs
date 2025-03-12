import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BylyTRXF.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/chapter1.astro.mjs');
const _page2 = () => import('./pages/chapter2.astro.mjs');
const _page3 = () => import('./pages/chapter3.astro.mjs');
const _page4 = () => import('./pages/chapter4.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.18_rollup@4.34.8_sass@1.85.1_typescript@5.7.3/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/chapter1.astro", _page1],
    ["src/pages/chapter2.astro", _page2],
    ["src/pages/chapter3.astro", _page3],
    ["src/pages/chapter4.astro", _page4],
    ["src/pages/index.astro", _page5]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
