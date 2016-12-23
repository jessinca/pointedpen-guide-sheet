const doc = new jsPDF("l", "mm");
const mmToPt = 72 / 25.4000508;

const a4 = [595.28, 841.89];
const a4HorizontalWidthMm = a4[1] / mmToPt;
const a4HorizontalHeightMm = a4[0] / mmToPt;

const setDrawColor = ([r, g, b]) => {
	doc.setDrawColor(r, g, b);
}


const getTanDeg = (deg) => {
	const rad = deg * Math.PI/180;
	return Math.tan(rad);
};

const drawHorizontalDashedLine = ({dashWidth, dashDistance, horizontalLineStartX, horizontalLineEndX, y}) => {
	while (horizontalLineStartX + dashWidth <= horizontalLineEndX) {
		doc.line(horizontalLineStartX, y, horizontalLineStartX + dashWidth, y);
		horizontalLineStartX += (dashWidth + dashDistance);
	}
};

const drawGuideLineSet = (options) => {
	const {
		ascenderDescenderColor,
		ascenderDescenderHeight,
		halfAscenderDescenderColor,
		startY,
		pageWidth,
		pageMarginx,
		slantColor,
		slantDeg,
		slantDistance,
		xHeight,
		xColor
	} = options;
	const horizontalLineStartX = pageMarginx;
	const horizontalLineEndX = pageWidth - pageMarginx;
	// draw ascender line
	setDrawColor(ascenderDescenderColor);
	doc.line(horizontalLineStartX, startY, horizontalLineEndX, startY);
	
	const dashWidth = 1;
	const dashDistance = 1;
	// half ascender line
	const halfAscenderY = startY + (ascenderDescenderHeight/2);
	setDrawColor(halfAscenderDescenderColor);
	drawHorizontalDashedLine({
		dashWidth,
		dashDistance,
		horizontalLineStartX,
		horizontalLineEndX,
		y: halfAscenderY
	});
	
	// draw x line (top)
	setDrawColor(xColor);
	const xLineTopY = startY + ascenderDescenderHeight;
	doc.line(horizontalLineStartX, xLineTopY, horizontalLineEndX, xLineTopY);
	
	// draw x line (bottom)
	const xLineBottomY = xLineTopY + xHeight;
	doc.line(horizontalLineStartX, xLineBottomY, horizontalLineEndX, xLineBottomY);
	
	// half descender line
	const halfDescenderY = xLineBottomY + (ascenderDescenderHeight/2);
	setDrawColor(halfAscenderDescenderColor);
	drawHorizontalDashedLine({
		dashWidth,
		dashDistance,
		horizontalLineStartX,
		horizontalLineEndX,
		y: halfDescenderY
	});
	
	// draw descender line
	const descenderLineY = xLineBottomY + ascenderDescenderHeight;
	setDrawColor(ascenderDescenderColor);
	doc.line(horizontalLineStartX, descenderLineY, horizontalLineEndX, descenderLineY);
	
	// draw slant
	setDrawColor(slantColor);
	// TODO: HACK HERE, fix later
	let slantStartX = pageMarginx + 3;
	const lineHeight = 2 * ascenderDescenderHeight + xHeight;
	const slantTopBottomXDistance = lineHeight / getTanDeg(slantDeg);
	while(slantStartX + slantTopBottomXDistance <= horizontalLineEndX){
		doc.line(slantStartX, descenderLineY, slantStartX+slantTopBottomXDistance, startY); // draw the line from bottom to top
		slantStartX += slantDistance;
	}
	
};

const drawGuideSheet = (options) => {
	const {
		lineDistance,
		pageWidth,
		pageHeight,
		pageMargin,
		halfAscenderDescenderColor,
		ascenderDescenderColor,
		ascenderDescenderHeight,
		slantColor,
		slantDeg,
		slantDistance,
		xHeight,
		xColor
	} = options;
	let y = pageMargin;
	const pageMarginx = pageMargin;
	
	const maxHorizontalLineY = pageHeight-pageMargin;
	const lineHeight = 2*ascenderDescenderHeight + xHeight;
	
	while (y + lineHeight <= maxHorizontalLineY) {
		drawGuideLineSet({
			ascenderDescenderColor,
			ascenderDescenderHeight,
			halfAscenderDescenderColor,
			startY: y,
			slantColor,
			slantDeg,
			slantDistance,
			pageWidth,
			pageMarginx,
			xHeight,
			xColor
		});
		y += (lineHeight+lineDistance);
	}

};

drawGuideSheet({
	pageWidth: a4HorizontalWidthMm,
	pageHeight: a4HorizontalHeightMm,
	pageMargin: 15,
	halfAscenderDescenderColor: [200, 200, 200],
	ascenderDescenderColor: [180, 180, 180],
	ascenderDescenderHeight: 7.5,
	lineDistance: 10,
	slantColor: [180,180,180],
	slantDistance: 7.5,
	slantDeg: 55,
	xHeight: 5,
	xColor: [50,50,50]
});

doc.save('a4.pdf');