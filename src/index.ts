import { Hono } from "hono";
import { html, raw } from "hono/html";
import { type HighlighterCore, getHighlighterCore, loadWasm } from "shiki/core";
import js from "shiki/langs/javascript.mjs";
import theme from "shiki/themes/github-dark-dimmed.mjs";

const CODE = `const greeting = "Hello, World!";
console.log(greeting);
`;

// @ts-ignore
await loadWasm(import("shiki/onig.wasm"));

let highlighter: HighlighterCore | undefined;

const app = new Hono();

app.get("/", async (c) => {
	if (!highlighter) {
		highlighter = await getHighlighterCore({
			themes: [theme],
			langs: [js],
		});
	}

	return c.html(
		html`${raw(
			highlighter.codeToHtml(CODE, {
				theme: "github-dark-dimmed",
				lang: "js",
			}),
		)}`,
	);
});

export default app;
