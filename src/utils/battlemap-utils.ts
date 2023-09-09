function calculateWidthUsedHexagonFlatTop(
  numHexagons: number,
  hexagonWidth: number,
) {
  if (numHexagons <= 0) {
    return 0;
  }

  // Distance between adjacent hexagon centers along the x-axis
  const hexagonSpacing = (hexagonWidth * 3) / 4;

  // Total width taking into account the overlap
  const totalWidth = (numHexagons - 1) * hexagonSpacing + hexagonWidth;

  return totalWidth;
}

export const drawGrid_FlatTop = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number,
) => {
  const heightFactor = canvasHeight / canvasWidth;
  let hexagonDiameter = canvasWidth / gridWidth;

  // the diameter needs to take into account the fact that when the hexes are tiled,
  // they're overlapping - and therefore it needs to be larger than calculated

  const totalWidthUsedActuallyUsed = calculateWidthUsedHexagonFlatTop(
    gridWidth,
    hexagonDiameter,
  );

  const widthNotAccountedFor = (canvasWidth - totalWidthUsedActuallyUsed) * 1.5;
  const amountToAddToDiameter = widthNotAccountedFor / gridWidth;

  hexagonDiameter += amountToAddToDiameter;
  //   let hexagondiameter
  //   we start from an earlier number so that it covers the whole canvas
  for (let y = -1; y < Math.ceil(gridHeight * heightFactor) + 1; y++) {
    for (let x = -1; x < gridWidth + 1; x++) {
      let xTilingOffset = 0;
      let yTilingOffset = 0;

      // we need to fuck around with even columns due to Hex Magic
      if (x % 2 === 0) {
        yTilingOffset = hexagonDiameter / 2;
      }

      // hate this
      xTilingOffset = x * (hexagonDiameter / 4) * -1 - hexagonDiameter / 2;

      const xPos = x * hexagonDiameter + xTilingOffset;
      const yPos = y * hexagonDiameter + yTilingOffset;

      drawHexagonFlatTop(context, xPos, yPos, hexagonDiameter, hexagonDiameter);
      context.stroke();
    }
  }
};

export const drawGrid_PointyTop = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number,
) => {
  let hexagonDiameter = canvasWidth / gridWidth;

  const heightFactor = (canvasWidth / canvasHeight) * gridWidth;

  for (let y = -1; y < gridHeight * heightFactor; y++) {
    for (let x = -1; x < gridWidth + 1; x++) {
      let xTilingOffset = 0;
      let yTilingOffset = 0;

      // // we need to fuck around with even columns due to Hex Magic
      if (y % 2 === 0) {
        xTilingOffset = hexagonDiameter / 2;
      }

      // hate this
      yTilingOffset = y * (hexagonDiameter / 4) * -1 - hexagonDiameter / 2;

      const xPos = x * hexagonDiameter + xTilingOffset;
      const yPos = y * hexagonDiameter + yTilingOffset;

      drawHexagonPointyTop(
        context,
        xPos,
        yPos,
        hexagonDiameter,
        hexagonDiameter,
      );
      context.stroke();
    }
  }
};

export const drawHexagonFlatTop = (
  context: CanvasRenderingContext2D,
  xPos: number,
  yPos: number,
  width: number,
  height: number,
) => {
  const hexagonWidth = width;
  const hexagonHeight = height;
  const hexagonWidthQuarter = hexagonWidth / 4;
  context.beginPath();

  context.moveTo(xPos, yPos + hexagonWidth / 2);
  context.lineTo(xPos + hexagonWidthQuarter, yPos);
  context.lineTo(xPos + hexagonWidthQuarter * 3, yPos);
  context.lineTo(xPos + hexagonWidth, yPos + hexagonHeight / 2);
  context.lineTo(xPos + hexagonWidthQuarter * 3, yPos + hexagonHeight);
  context.lineTo(xPos + hexagonWidthQuarter, yPos + hexagonHeight);

  context.closePath();
};

export const drawHexagonPointyTop = (
  context: CanvasRenderingContext2D,
  xPos: number,
  yPos: number,
  width: number,
  height: number,
) => {
  const hexagonWidth = width;
  const hexagonHeight = height;
  // const hexagonRadius = hexagonWidth / 2;
  const hexagonWidthQuarter = hexagonWidth / 4;

  context.beginPath();
  context.moveTo(xPos, yPos + hexagonWidthQuarter * 1); // 1
  context.lineTo(xPos + hexagonWidthQuarter * 2, yPos); // 2
  context.lineTo(xPos + hexagonWidth, yPos + hexagonWidthQuarter * 1); // 3
  context.lineTo(xPos + hexagonWidth, yPos + hexagonWidthQuarter * 3); // 4
  context.lineTo(xPos + hexagonWidthQuarter * 2, yPos + hexagonHeight); // 5
  context.lineTo(xPos, yPos + hexagonWidthQuarter * 3); // 6
  context.closePath();
  // context.stroke();
};

export const calculateFinalSquareSize = (
  canvasWidth: number,
  totalUnitsAcross: number,
) => {
  const squareSize = Math.floor(canvasWidth / totalUnitsAcross);

  return squareSize;
};

export const calculateFinalHexPointyTopSize = (
  canvasWidth: number,
  gridWidth: number,
) => {
  let hexagonDiameter = canvasWidth / gridWidth;

  return hexagonDiameter;
};
