import { styled } from '@material-ui/core/styles';

export const ButtonsBlock = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const ControlsBlock = styled('div')({
  paddingLeft: '50px',
  display: 'flex',
  width: '330px',
  justifyContent: 'space-between'
});

export const MapBlock = styled('div')({
  display: 'flex',
  maxWidth: 'calc(100vw - 400px)',
  width: 'fit-content',
  maxHeight: '610px',
  height: 'fit-content',
  overflowY: 'auto',
});

export const GameBlock = styled('div')({
  display: 'flex',
  height: 'calc(100vh - 70px)',
  padding: '50px 25px 0 25px',
});
