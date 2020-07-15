// @flow
import React from 'react';

import * as Styled from './styled';

import type {LevelsPropsT} from './types';

const Levels = React.memo<LevelsPropsT>(({ onChangeLevel, currentLevel }) => {
  const onClickHandler = (event) => {
    switch (event.target.textContent) {
      case 'Level 1':
        onChangeLevel(1);
        break;
      case 'Level 2':
        onChangeLevel(2);
        break;
      case 'Level 3':
        onChangeLevel(3);
        break;
      case 'Level 4':
        onChangeLevel(4);
        break;
      default:
        onChangeLevel(currentLevel);
    }
  };

  return (
    <div onClick={onClickHandler}>
      <Styled.GameButton active={currentLevel === 1}>Level 1</Styled.GameButton>
      <Styled.GameButton active={currentLevel === 2}>Level 2</Styled.GameButton>
      <Styled.GameButton active={currentLevel === 3}>Level 3</Styled.GameButton>
      <Styled.GameButton active={currentLevel === 4}>Level 4</Styled.GameButton>
    </div>
  )
});

export default Levels;
