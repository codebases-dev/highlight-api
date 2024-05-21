import { Hono } from "hono";
import { html, raw } from "hono/html";
import { type HighlighterCore, getHighlighterCore, loadWasm } from "shiki/core";
import js from "shiki/langs/javascript.mjs";
import theme from "shiki/themes/github-dark-dimmed.mjs";

// @ts-ignore
await loadWasm(import("shiki/onig.wasm"));

let highlighter: HighlighterCore | undefined;

const app = new Hono();

app.post("/highlight", async (c) => {
	try {
		const { code, language } = await c.req.json();

		if (!code) {
			return c.json({ error: "`code` is required" }, 400);
		}

		if (typeof code !== "string") {
			return c.json({ error: "`code` must be a string" }, 400);
		}

		if (!language) {
			return c.json({ error: "`language` is required" }, 400);
		}

		if (typeof language !== "string") {
			return c.json({ error: "`language` must be a string" }, 400);
		}

		if (!highlighter) {
			highlighter = await getHighlighterCore({
				themes: [theme],
				langs: [js],
			});
		}

		return c.json({
			html: highlighter.codeToHtml(code, {
				theme: "github-dark-dimmed",
				lang: language,
			}),
		});
	} catch (error) {
		return c.json({ error: "An unexpected error occurred" }, 500);
	}
});

export default app;
