import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getHighlighter } from "./highlighter";
import { codeSchema } from "./schema";

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
			const highlighter = await getHighlighter();

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

export default app;
