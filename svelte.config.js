// import adapter from "@sveltejs/adapter-auto";
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte, mdsvex } from "mdsvex";
import { createHighlighter } from "shiki";

const theme = "github-dark";
const highlighter = await createHighlighter({
  themes: [theme],
  langs: ["javascript", "typescript", "json"],
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  highlight: {
    highlighter: async (code, lang = "text") => {
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
      return `{@html \`${html}\` }`;
    },
  },
  extensions: [".md"],
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    mdsvex(mdsvexOptions),
  ],
  kit: {
    adapter: adapter(),
  },
  extensions: [".svelte", ".md"],
  compilerOptions: {
    runes: true,
  },
};

export default config;
