// @flow
import React from 'react';
import isEmpty from 'lodash/isEmpty';

import Map from '../Map';
import Levels from '../Levels';
import Log from '../Log';

import * as Styled from './styled';
import Controls from '../Controls';

import type {GamePropsT} from './types';

const Game = React.memo<GamePropsT>(({
  level,
  isRobotMode,
  isFlagMode,
  log,
  mapLine,
  rowSize,
  mines,
  unknownsNumber,
  onChangeFlagMode,
  onChangeRobotMode,
  onReloadGame,
  onChangeLevel,
  onClickUnknown,
}) => (
    <>
      <Styled.ButtonsBlock>
        <Levels
          onChangeLevel={onChangeLevel}
          currentLevel={level}
        />
        <Styled.ControlsBlock>
          <Controls
            isRobotMode={isRobotMode}
            isFlagMode={isFlagMode}
            onReloadGame={onReloadGame}
            onChangeRobotMode={onChangeRobotMode}
            onChangeFlagMode={onChangeFlagMode}
          />
        </Styled.ControlsBlock>
      </Styled.ButtonsBlock>
      <Styled.GameBlock>
        {
          !isEmpty(log) && (
            <Log log={log} />
          )
        }
        {
          !isEmpty(mapLine) && (
            <div style={{ paddingLeft: '40px' }}>
              <div style={{ paddingBottom: '10px' }}>
                Number of unknowns: {unknownsNumber}
              </div>
              <Styled.MapBlock
                onClick={onClickUnknown}
              >
                <Map
                  mapLine={mapLine}
                  rowSize={rowSize}
                  minesLine={mines.join(',')}
                  level={level}
                />
              </Styled.MapBlock>
            </div>
          )
        }
      </Styled.GameBlock>
    </>
  ));

export default Game;
