import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { type HighlighterCore, getHighlighterCore, loadWasm } from "shiki/core";
import js from "shiki/langs/javascript.mjs";
import theme from "shiki/themes/github-dark-dimmed.mjs";
import { codeSchema, codesSchema } from "./schema";

// @ts-ignore
await loadWasm(import("shiki/onig.wasm"));

let highlighter: HighlighterCore | undefined;

const app = new Hono();

app.post(
	"/highlight",
	zValidator("json", codeSchema, (result, c) => {
		if (!result.success) {
			return c.json({ error: "Invalid input" }, 400);
		}
	}),
	async (c) => {
		try {
			const { code, language } = c.req.valid("json");

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
	},
);

app.post(
	"/highlight/batch",
	zValidator("json", codesSchema, (result, c) => {
		if (!result.success) {
			return c.json({ error: "Invalid input" }, 400);
		}
	}),
	async (c) => {
		try {
			const { codes } = c.req.valid("json");

			const results = await Promise.all(
				codes.map(async ({ code, language }, index) => {
					if (!highlighter) {
						highlighter = await getHighlighterCore({
							themes: [theme],
							langs: [js],
						});
					}

					return {
						index,
						html: highlighter.codeToHtml(code, {
							theme: "github-dark-dimmed",
							lang: language,
						}),
					};
				}),
			);

			return c.json({ results });
		} catch (error) {
			return c.json({ error: "An unexpected error occurred" }, 500);
		}
	},
);

export default app;
