// @flow
import React from 'react';
import chunk from 'lodash/chunk';
import isEmpty from 'lodash/isEmpty';

import Cell from './Cell';

import type {MapPropsT} from './types';

const argsEqual = (prevProps, nextProps) =>
  prevProps.mapLine === nextProps.mapLine && prevProps.minesLine === nextProps.minesLine;

const Map = React.memo<MapPropsT>(({
  mapLine,
  rowSize,
  minesLine,
  level,
}) => {
  const cellsSquare = chunk(mapLine, rowSize);
  const minesArray = isEmpty(minesLine) ? [] : minesLine.split(',');

  return (
    <div>
      {
        cellsSquare.map((cellsRow, rowId) => (
          <div
            key={rowId}
            style={{ display: 'flex' }}
          >
            {
              cellsRow.map((cellValue, columnId) => {
                const cellKey = rowId * rowSize + columnId;
                const isMine = minesArray.includes(String(cellKey));
                const isUnknown = !isMine && cellValue === '□';
                const isExplosion = cellValue === '*';
                const isHint = !isMine && !isUnknown && !isExplosion;

                return (
                  <Cell
                    key={cellKey}
                    isUnknown={isUnknown}
                    isMine={isMine}
                    isExplosion={isExplosion}
                    isHint={isHint}
                    cellValue={cellValue}
                    cellKey={cellKey}
                    rowId={rowId}
                    columnId={columnId}
                    level={level}
                  />
                )
              })
            }
          </div>
        ))
      }
    </div>
  );
}, argsEqual);

export default Map;
