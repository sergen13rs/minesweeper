// @flow
import React from 'react';

let wss;

const useWebSocket = (url: string): [string, (string) => void] => {
  const [response, setResponse] = React.useState('');

  React.useEffect(() => {
    wss = new WebSocket(url);

    wss.onopen = () => {
      wss.send('new 1');
    }

    wss.onmessage = (event) => {
      // $FlowFixMe
      setResponse(event.data);
    }

    wss.onerror = () => {
      console.log('ws error');
    }

    wss.onclose = () => {
      console.log('ws closed');
    }

    return () => {
      wss.close(1001);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [
    response,
    (message) => {
      wss.send(message)
    },
  ];
};

export default useWebSocket;
