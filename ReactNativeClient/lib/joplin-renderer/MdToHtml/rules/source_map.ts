
// @ts-ignore: Keep the function signature as-is despite unusued arguments
function installRule(markdownIt:any) {
	const allowed_levels:{[key:string]:{}} = {
		paragraph_open: 0,
		heading_open: 0,
		// fence: 0, // fence uses custom rendering that doesn't propogate attr so it can't be used for now
		blockquote_open: 0,
		table_open: 0,
		code_block: 0,
		hr: 0,
		html_block: 0,
		list_item_open: 99, // this will stop matching if a list goes more than 99 indents deep
	};

	for (const key in allowed_levels) {
		const default_rule = markdownIt.renderer.rules[key];

		// @ts-ignore: Keep the function signature as-is despite unusued arguments
		markdownIt.renderer.rules[key] = (tokens: { [x: string]: any; }, idx: string | number, options: any, env: any, self: any) => {
			if (!!tokens[idx].map && tokens[idx].level <= allowed_levels[key]) {
				const line = tokens[idx].map[0];
				tokens[idx].attrJoin('class', 'maps-to-line');
				tokens[idx].attrSet('source-line', `${line}`);
			}
			if (default_rule) { return default_rule(tokens, idx, options, env, self); } else { return self.renderToken(tokens, idx, options, env, self); }
		};
	}
}

export default function() {
	return function(md:any) {
		installRule(md);
	};
}
