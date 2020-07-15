// @flow
import React from 'react';

import type {CellPropsT} from './types';

const Cell = React.memo<CellPropsT>(({
  isUnknown,
  isMine,
  isExplosion,
  isHint,
  cellValue,
  cellKey,
  level
}) => {
  const background = isExplosion ? 'red' : isMine ? 'orange' : isUnknown ? 'gray' : 'lightgray'
  return (
    <div
      data-id={cellKey}
      style={{
        background,
        border: '1px solid white',
        textAlign: 'center',
        cursor: 'pointer',
        width: level > 2 ? '10px' : '20px',
        height: level > 2 ? '10px' : '20px',
        fontSize: level > 2 ? '8px' : 'inherit',
      }}
    >
      {
        ((isHint || isExplosion) && cellValue) || (isMine && '*')
      }
    </div >
  )
});

export default Cell;
