// @flow
import React from 'react';

import { LOG_SIZE } from '../constants';

const useLog = (): [string, (string) => void] => {
  const [log, setLog] = React.useState([]);
  return [
    log.join('\n'),
    (record) => {
      setLog((prev) => [record, ...prev].slice(0, LOG_SIZE));
    }
  ];
};

export default useLog;