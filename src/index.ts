import { Hono } from "hono";
import { html, raw } from "hono/html";
import { type HighlighterCore, getHighlighterCore, loadWasm } from "shiki/core";
import js from "shiki/langs/javascript.mjs";
import theme from "shiki/themes/github-dark-dimmed.mjs";

// @ts-ignore
await loadWasm(import("shiki/onig.wasm"));

let highlighter: HighlighterCore | undefined;

const app = new Hono();

app.post("/", async (c) => {
	try {
		const code = await c.req.text();
		if (!code) {
			return c.json({ error: "Code is required" }, 400);
		}

		if (!highlighter) {
			highlighter = await getHighlighterCore({
				themes: [theme],
				langs: [js],
			});
		}

		return c.html(
			html`${raw(
				highlighter.codeToHtml(code, {
					theme: "github-dark-dimmed",
					lang: "js",
				}),
			)}`,
		);
	} catch (error) {
		return c.json({ error: "An unexpected error occurred" }, 500);
	}
});

export default app;
