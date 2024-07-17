/**
 * Add handles to a x axis only brush (i.e. fixed y)
 * @param brush
 * @param brushContainer
 * @param selectionFn - function to provide the selection provided by a brush event in case there is snapping or other modifications done
 * @param brushHeight
 * @param handleWidth
 * @param handleHeight
 * @param initialSelection - initial brush selection so we can place the handles
 * @param insetWest - will inset the brush as it reaches its minimum value
 * @param insetEast - will inset the brush as it reaches its maximum value
 */
export function addHandlesToBrushX(brush, brushContainer, selectionFn, brushHeight, handleWidth, handleHeight, initialSelection, insetWest = false, insetEast = false) {
	const path = d3.path();
	path.rect(0, 0, handleWidth, handleHeight);

	const handles = brushContainer.selectAll(".handle--custom")
		.data([{type: "w"}, {type: "e"}])
		.join(enter => enter.append("path")
			.attr("class", "handle--custom")
			.attr("fill", "#777")
			.attr("fill-opacity", 1)
			.attr("stroke", "#FFF")
			.attr("stroke-width", 1.5)
			.attr("cursor", "ew-resize")
			.attr("d", path)
		);

	const handleEast = brushContainer.selectAll(".handle--e");
	const handleWest = brushContainer.selectAll(".handle--w");

	function updateHandles(selection) {
		if (selection != null) {
			handles.attr("display", null);
			handles.attr("transform", function (d, i) {
				let offset = 0;
				if (i === 0 && insetWest) {
					offset = handleWidth / 2.0;
				} else if (i === 1 && insetEast) {
					offset = handleWidth / -2.0;
				}
				return "translate(" + (selection[i] - (handleWidth / 2.0) + offset) + "," + (brushHeight / 2.0 - handleHeight / 2.0) + ")";
			});

			handleWest.attr("x", selection[0] - (insetWest ? 0 : 3));
			handleEast.attr("x", selection[1] - (insetEast ? 6 : 3));
		} else {
			handles.attr("display", "none");
		}
	}

	const startListener = brush.on("start");
	const brushListener = brush.on("brush");
	const endListener = brush.on("end");

	let selectionFunc = selectionFn;
	if (selectionFn == null) {
		selectionFn = s => s.selection;
	}

	function handleBrushEvent(event) {
		if (!event.sourceEvent) return;
		updateHandles(selectionFn(event));
	}

	function brushed(event) {
		if (brushListener) {
			brushListener(event);
		}
		handleBrushEvent(event);
	};

	function brushEnd(event) {
		if (endListener) {
			endListener(event);
		}
		handleBrushEvent(event);
	};

	function brushStart(event) {
		if (startListener) {
			startListener(event);
		}
		handleBrushEvent(event);
	};

	// update brush listeners to include the modifications necessary for the tooltip
	brush.on("start", brushStart)
		.on("brush", brushed)
		.on("end", brushEnd);

	updateHandles(initialSelection);
};