// Helper functions to sync up scrolling
export default function useScrollUtils(CodeMirror: any) {
	CodeMirror.defineExtension('getScrollPercent', function() {
		const info = this.getScrollInfo();

		// console.warn(this.lineAtHeight(info.top, "local"));
		// console.warn(this.lineAtHeight(info.top + info.clientHeight, "local"));
		// console.warn(info.top);
		// console.log(getScrollHeight(this));
		// console.warn(this.charCoords({line: 2, ch: 0}).top);
		// console.log(this.getViewport());
		// console.warn(this.heightAtLine(2));

		return info.top / (info.height - info.clientHeight);
	});

	CodeMirror.defineExtension('setScrollPercent', function(p: number) {
		const info = this.getScrollInfo();
		this.scrollTo(null, p * (info.height - info.clientHeight));
	});
}
