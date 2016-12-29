const setDrawColor = (doc, [r, g, b]) => {
  doc.setDrawColor(r, g, b);
};

const getTanDeg = (deg) => {
  const rad = (deg * Math.PI) / 180;
  return Math.tan(rad);
};

const drawHorizontalDashedLine = (doc, options) => {
  const { dashWidth, dashDistance, horizontalLineStartX, horizontalLineEndX, y } = options;
  let x = horizontalLineStartX;
  while (x + dashWidth <= horizontalLineEndX) {
    doc.line(horizontalLineStartX, y, horizontalLineStartX + dashWidth, y);
    x += (dashWidth + dashDistance);
  }
};

const drawGuideLineSet = (doc, options) => {
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
    xColor,
  } = options;
  const horizontalLineStartX = pageMarginx;
  const horizontalLineEndX = pageWidth - pageMarginx;
  // draw ascender line
  setDrawColor(doc, ascenderDescenderColor);
  doc.line(horizontalLineStartX, startY, horizontalLineEndX, startY);

  const dashWidth = 1;
  const dashDistance = 1;
  // half ascender line
  const halfAscenderY = startY + (ascenderDescenderHeight / 2);
  setDrawColor(doc, halfAscenderDescenderColor);
  drawHorizontalDashedLine(doc, {
    dashWidth,
    dashDistance,
    horizontalLineStartX,
    horizontalLineEndX,
    y: halfAscenderY,
  });

  const xLineTopY = startY + ascenderDescenderHeight;
  const xLineBottomY = xLineTopY + xHeight;

  // half descender line
  const halfDescenderY = xLineBottomY + (ascenderDescenderHeight / 2);
  setDrawColor(doc, halfAscenderDescenderColor);
  drawHorizontalDashedLine(doc, {
    dashWidth,
    dashDistance,
    horizontalLineStartX,
    horizontalLineEndX,
    y: halfDescenderY,
  });

  // draw descender line
  const descenderLineY = xLineBottomY + ascenderDescenderHeight;
  setDrawColor(doc, ascenderDescenderColor);
  doc.line(horizontalLineStartX, descenderLineY, horizontalLineEndX, descenderLineY);

  // draw slant
  setDrawColor(doc, slantColor);
  // TODO: HACK HERE, fix later
  let slantStartX = pageMarginx + 3;
  const lineHeight = (2 * ascenderDescenderHeight) + xHeight;
  const slantTopBottomXDistance = lineHeight / getTanDeg(slantDeg);
  while (slantStartX + slantTopBottomXDistance <= horizontalLineEndX) {
    // draw the line from bottom to top
    doc.line(slantStartX, descenderLineY, slantStartX + slantTopBottomXDistance, startY);
    slantStartX += slantDistance;
  }

  // draw x lines
  // (this should be the last lines to draw to prevent them from being cut off by other lines)
  setDrawColor(doc, xColor);
  doc.line(horizontalLineStartX, xLineTopY, horizontalLineEndX, xLineTopY);
  doc.line(horizontalLineStartX, xLineBottomY, horizontalLineEndX, xLineBottomY);
};

const drawGuideSheet = (doc, options) => {
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
    xColor,
  } = options;
  let y = pageMargin;
  const pageMarginx = pageMargin;

  const maxHorizontalLineY = pageHeight - pageMargin;
  const lineHeight = (2 * ascenderDescenderHeight) + xHeight;

  while (y + lineHeight <= maxHorizontalLineY) {
    drawGuideLineSet(doc, {
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
      xColor,
    });
    y += (lineHeight + lineDistance);
  }
};

export default drawGuideSheet;
