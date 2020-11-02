import { useEffect, useCallback, useRef, useState } from 'react';

export function cursorPositionToTextOffset(cursorPos: any, body: string) {
	if (!body) return 0;

	const noteLines = body.split('\n');

	let pos = 0;
	for (let i = 0; i < noteLines.length; i++) {
		if (i > 0) pos++; // Need to add the newline that's been removed in the split() call above

		if (i === cursorPos.line) {
			pos += cursorPos.ch;
			break;
		} else {
			pos += noteLines[i].length;
		}
	}

	return pos;
}

export function usePrevious(value: any): any {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export function useScrollHandler(editorRef: any, webviewRef: any, onScroll: Function) {
	const ignoreNextEditorScrollEvent_ = useRef(false);
	const scrollTimeoutId_ = useRef<any>(null);

	const scheduleOnScroll = useCallback((event: any) => {
		if (scrollTimeoutId_.current) {
			clearTimeout(scrollTimeoutId_.current);
			scrollTimeoutId_.current = null;
		}

		scrollTimeoutId_.current = setTimeout(() => {
			scrollTimeoutId_.current = null;
			onScroll(event);
		}, 10);
	}, [onScroll]);

	const setEditorPercentScroll = useCallback((p: number) => {
		ignoreNextEditorScrollEvent_.current = true;

		if (editorRef.current) {
			editorRef.current.setScrollPercent(p);

			scheduleOnScroll({ percent: p });
		}
	}, [scheduleOnScroll]);

	const setViewerPercentScroll = useCallback((p: number) => {
		if (webviewRef.current) {
			webviewRef.current.wrappedInstance.send('setPercentScroll', p);
			scheduleOnScroll({ percent: p });
		}
	}, [scheduleOnScroll]);

	const editor_scroll = useCallback(() => {
		if (ignoreNextEditorScrollEvent_.current) {
			ignoreNextEditorScrollEvent_.current = false;
			return;
		}

		if (editorRef.current) {
			const cm = editorRef.current;
			const map = webviewRef.current.wrappedInstance.getMappedLines();
			const info = cm.getScrollInfo();
			let percent = cm.getScrollPercent();
			// let percent = 1.0;
			const line = cm.lineAtHeight(info.top, 'local');
			map.push({ line: cm.lineCount(), p: 1.0 });
			// TODO: need some concept of a *last line* so that when the editor hits the bottom
			// of the screen (100% scroll) the viewer will do the same

			for (let i = 1; i < map.length; i++) {
				if (map[i].line > line) {
					const iLineHeight = cm.heightAtLine(map[i - 1].line, 'local');
					const i1LineHeight = cm.heightAtLine(map[i].line, 'local');
					const lineInterp = (info.top - iLineHeight) / (i1LineHeight - iLineHeight);
					percent = map[i - 1].p + (map[i].p - map[i - 1].p) * lineInterp;
					// console.log(info.top, iLineHeight, i1LineHeight, lineInterp, map[i].line, map[i-1].line, percent, map[i].p);
					break;
				}
			}
			// console.warn(cm.lineAtHeight(info.top + info.clientHeight, "local"));

			setViewerPercentScroll(percent);
		}
	}, [setViewerPercentScroll]);

	const resetScroll = useCallback(() => {
		if (editorRef.current) {
			editorRef.current.setScrollPercent(0);
		}
	}, []);

	return { resetScroll, setEditorPercentScroll, setViewerPercentScroll, editor_scroll };
}


export function useRootSize(dependencies:any) {
	const { rootRef } = dependencies;

	const [rootSize, setRootSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!rootRef.current) return;

		const { width, height } = rootRef.current.getBoundingClientRect();

		if (rootSize.width !== width || rootSize.height !== height) {
			setRootSize({ width: width, height: height });
		}
	});

	return rootSize;
}
