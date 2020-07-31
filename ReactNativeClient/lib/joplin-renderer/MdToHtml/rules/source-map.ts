
// @ts-ignore: Keep the function signature as-is despite unusued arguments
function installRule(markdownIt:any) {
	// @ts-ignore: Keep the function signature as-is despite unusued arguments
	const injectLineNumber = (tokens: { [x: string]: any; }, idx: string | number, options: any, env: any, self: any) => {
		if (!!tokens[idx].map && tokens[idx].level === 0) {
			const line = tokens[idx].map[0];
			tokens[idx].attrJoin('class', 'line');
			tokens[idx].attrSet('source-line', `${line}`);
		}
		return self.renderToken(tokens, idx, options, env, self);
	};

	// the markdown-it demo only uses paragraph and header opens, so we'll try that
	// If we notice issues with specific markdown features we can add them here
	markdownIt.renderer.rules.paragraph_open = markdownIt.renderer.rules.heading_open = injectLineNumber;
}

export default function() {
	return function(md:any) {
		installRule(md);
	};
}
