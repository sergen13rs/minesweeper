// @flow
import type {LevelT} from '../../types';

export type MapPropsT = {
  mapLine: string,
  rowSize: number,
  minesLine: string,
  level: LevelT,
}

export type CellPropsT = {
  isUnknown: boolean,
  isMine: boolean,
  isExplosion: boolean,
  isHint: boolean,
  cellValue: string,
  cellKey: number,
}
