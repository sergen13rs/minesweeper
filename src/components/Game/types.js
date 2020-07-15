// @flow
import type {LevelT} from "../../types";

export type GamePropsT = {
  level: LevelT,
  isRobotMode: boolean,
  isFlagMode: boolean,
  log: string,
  mapLine: string,
  rowSize: number,
  mines: Array<number>,
  unknownsNumber: number,
  onChangeFlagMode: () => void,
  onChangeRobotMode: () => void,
  onReloadGame: () => void,
  onChangeLevel: (nextLevel: LevelT) => void,
  onClickUnknown: (event: SyntheticEvent<HTMLDivElement>) => void,
}
