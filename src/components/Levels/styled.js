import React from 'react';

import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

export const GameButton = styled(({ active, ...other }) => <Button {...other} />)({
  background: (props) =>
    props.active
      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
      : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', border: 0,
  borderRadius: 3,
  boxShadow: (props) =>
    props.active
      ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
      : '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '10px 20px',
});
