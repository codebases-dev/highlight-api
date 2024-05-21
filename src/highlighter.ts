import { type HighlighterCore, getHighlighterCore, loadWasm } from "shiki/core";
import js from "shiki/langs/javascript.mjs";
import theme from "shiki/themes/github-dark-dimmed.mjs";

// @ts-ignore
await loadWasm(import("shiki/onig.wasm"));

let highlighter: HighlighterCore | undefined;

export async function getHighlighter() {
	if (!highlighter) {
		highlighter = await getHighlighterCore({
			themes: [theme],
			langs: [js],
		});
	}

	return highlighter;
}
