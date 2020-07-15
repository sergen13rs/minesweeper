// @flow
import React from 'react';

import * as Styled from './styled';

const Log = React.memo<{log: string}>(({ log }) => (
  <div>
    <Styled.LogLabelBlock>
      Log:
    </Styled.LogLabelBlock>
    <Styled.LogBlock>
      {log}
    </Styled.LogBlock>
  </div>
));

export default Log;
