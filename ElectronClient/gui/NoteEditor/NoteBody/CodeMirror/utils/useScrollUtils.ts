// Helper functions to sync up scrolling
export default function useScrollUtils(CodeMirror: any) {
	function getScrollHeight(cm: any) {
		const info = cm.getScrollInfo();
		const overdraw = cm.state.scrollPastEndPadding ? cm.state.scrollPastEndPadding : '0px';
		return info.height - info.clientHeight - parseInt(overdraw);
	}

	CodeMirror.defineExtension('getScrollPercent', function() {
		const info = this.getScrollInfo();

		// console.warn(this.lineAtHeight(info.top, "local"));
		// console.warn(this.lineAtHeight(info.top + info.clientHeight, "local"));
		// console.warn(info.top);
		// console.log(getScrollHeight(this));
		// console.warn(this.charCoords({line: 2, ch: 0}).top);
		// console.log(this.getViewport());
		// console.warn(this.heightAtLine(2));

		return info.top / getScrollHeight(this);
	});

	CodeMirror.defineExtension('setScrollPercent', function(p: number) {
		this.scrollTo(null, p * getScrollHeight(this));
	});

}
