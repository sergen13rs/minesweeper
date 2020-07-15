// @flow
export const getAllUnknowns = (
  mapLineArr: Array<string>,
  mines: Array<number>
): Array<number> => mapLineArr.reduce((acc, cellValue, cellKey) => {
  if (cellValue === '□' && !mines.includes(cellKey)) {
    acc.push(cellKey);
  }
  return acc;
}, []);

export const getCellCoordinates = (
  cellKey: number,
  rowSize: number
): {rowId: number, columnId: number} => {
  const rowId = Math.floor(cellKey / rowSize);
  const columnId = cellKey - (rowId * rowSize);

  return { rowId, columnId };
};

export const checkSurroundings = (
  rowId: number,
  columnId: number,
  mapLine: string,
  mines: Array<number>,
  rowSize: number,
  columnSize: number
): [Array<{rowId: number, columnId: number, cellKey: number}>, number] => {
  const unknowns = [];
  let minesCount = 0;

  // check left cell
  if (columnId - 1 >= 0) {
    const cellKey = columnId - 1 + (rowId * rowSize);
    if (mines.includes(cellKey)) {
      ++minesCount
    } else if (mapLine[cellKey] === '□') {
      unknowns.push({ rowId, columnId: columnId - 1, cellKey })
    }
  }
  // check right cell
  if (columnId + 1 <= rowSize - 1) {
    const cellKey = columnId + 1 + (rowId * rowSize);
    (mines.includes(cellKey) && ++minesCount)
      || (mapLine[cellKey] === '□' && unknowns.push({ rowId, columnId: columnId + 1, cellKey }));
  }

  if (rowId - 1 >= 0) {
    // check top left cell
    if (columnId - 1 >= 0) {
      const cellKey = columnId - 1 + ((rowId - 1) * rowSize);
      (mines.includes(cellKey) && ++minesCount)
        || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId - 1, columnId: columnId - 1, cellKey }));
    }
    // check top right cell
    if (columnId + 1 <= rowSize - 1) {
      const cellKey = columnId + 1 + ((rowId - 1) * rowSize);
      (mines.includes(cellKey) && ++minesCount)
        || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId - 1, columnId: columnId + 1, cellKey }));
    }
    // check top cell
    const cellKey = columnId + ((rowId - 1) * rowSize);
    (mines.includes(cellKey) && ++minesCount)
      || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId - 1, columnId, cellKey }));
  }

  if (rowId + 1 <= columnSize - 1) {
    // check bottom left cell
    if (columnId - 1 >= 0) {
      const cellKey = columnId - 1 + ((rowId + 1) * rowSize);
      (mines.includes(cellKey) && ++minesCount)
        || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId + 1, columnId: columnId - 1, cellKey }));
    }
    // check bottom right cell
    if (columnId + 1 <= rowSize - 1) {
      const cellKey = columnId + 1 + ((rowId + 1) * rowSize);
      (mines.includes(cellKey) && ++minesCount)
        || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId + 1, columnId: columnId + 1, cellKey }));
    }
    // check bottom cell
    const cellKey = columnId + ((rowId + 1) * rowSize);
    (mines.includes(cellKey) && ++minesCount)
      || (mapLine[cellKey] === '□' && unknowns.push({ rowId: rowId + 1, columnId, cellKey }));
  }

  return [unknowns, minesCount];
}
