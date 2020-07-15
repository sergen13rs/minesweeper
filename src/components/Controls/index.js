// @flow
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';

import ReloadIcon from '../../icons/reload';

import type {ControlsPropsT} from './types';

const Controls = React.memo<ControlsPropsT>(({
  isRobotMode,
  isFlagMode,
  onReloadGame,
  onChangeRobotMode,
  onChangeFlagMode
}) => (
    <>
      <IconButton aria-label="reload" color="secondary" onClick={onReloadGame}>
        <ReloadIcon color="secondary" />
      </IconButton>
      <FormControlLabel
        control={<Switch checked={isRobotMode} onChange={onChangeRobotMode} name="robot" />}
        label="Robot"
      />
      <FormControlLabel
        control={<Checkbox checked={isFlagMode} onChange={onChangeFlagMode} name="flagmode" />}
        label="Flag Mode"
      />
    </>
  ));

export default Controls;
