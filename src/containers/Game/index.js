// @flow
import React, { useState, useEffect, useCallback } from 'react';

import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';

import Game from '../../components/Game';
import useWebSocket from '../../hooks/useWebSocket';
import useLog from '../../hooks/useLog';
import { getAllUnknowns, checkSurroundings, getCellCoordinates } from '../../utils';
import { WS_URL } from '../../constants';

let attempts = 0;
let shotsByProbability = 0;

const GameContainer = () => {
  const [rowSize, setRowSize] = useState(0);
  const [columnSize, setColumnSize] = useState(0);
  const [unknownsNumber, setUnknownsNumber] = useState(0);
  const [level, setLevel] = useState(1);
  const [robot, setRobot] = useState(false);
  const [lose, setLose] = useState(false);
  const [win, setWin] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [mines, setMines] = useState([]);
  const [checked, setChecked] = useState([]);
  const [mapLine, setMapLine] = useState('');

  const [log, setRecord] = useLog();
  const [response, sendMessage] = useWebSocket(WS_URL);

  useEffect(() => {
    setRecord(`START ${level} LEVEL`);
    attempts = 0;
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!robot || lose || win || isEmpty(mapLine)) return;

    const minesAround = [];
    const newCheckedCells = [];
    let needRandomShot = true;
    let mineProbabilities = {}; // for closest unknowns

    [...mapLine].forEach((cellValue, cellKey) => {
      if (checked.includes(cellKey)) {
        return;
      }

      const isHint = !isNaN(cellValue);

      if (isHint) {
        const { rowId, columnId } = getCellCoordinates(cellKey, rowSize);
        const [unknowns, minesCount] =
          checkSurroundings(rowId, columnId, mapLine, mines, rowSize, columnSize);

        if (unknowns.length === Number(cellValue) - minesCount) {
          // mark around unknowns as mines
          unknowns.forEach(unknown => {
            needRandomShot = false;
            minesAround.push(unknown.cellKey);
          });
          // mark current cell as fully checked
          newCheckedCells.push(cellKey)
        } else if (minesCount > 0 && +cellValue === minesCount) {
          // open all unknowns around
          unknowns.forEach(unknown => {
            needRandomShot = false;
            sendMessage(`open ${unknown.columnId} ${unknown.rowId}`);
          });
          // mark current cell as fully checked
          newCheckedCells.push(cellKey);
        } else {
          // calculate and set mines probabilities for unknowns around current hint
          const probability = (Number(cellValue) - minesCount) / unknowns.length;
          unknowns.forEach(unknown =>
            (mineProbabilities[unknown.cellKey])
              ? mineProbabilities[unknown.cellKey] += probability
              : mineProbabilities[unknown.cellKey] = probability
          );
        }
      }
    });

    if (needRandomShot) {
      if (isEmpty(mineProbabilities)) {
        // open random unknown cell
        const firstShotsNumber = level > 2 ? 10 : 1;
        setRecord(`random shots: ${firstShotsNumber}`);
        Array(firstShotsNumber).fill().forEach(() => makeRandomShot(mapLine.length));
      } else {
        // open unknown with lowest probability of mines
        makeShotByProbability(mineProbabilities);
      }
    }

    setMines(uniq([...mines, ...minesAround])); // set new found mines
    setChecked(uniq([...checked, ...newCheckedCells])); // set hints as fully checked to ignore them in next checks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLine, mines.length, robot]);

  const makeShotByProbability = (mineProbabilities) => {
    const lowestChanceUnknown = Object.entries(mineProbabilities)
      .reduce((lowest, [key, value]) =>
          // $FlowFixMe Flow assumes that value as returned by [key, value] for Object.entries is mixed.
          (value < lowest.value) ? { key, value } : lowest
        , { key: 0, value: 100 });

    const { rowId, columnId } = getCellCoordinates(Number(lowestChanceUnknown.key), rowSize);
    sendMessage(`open ${columnId} ${rowId}`);
    setRecord(`shot by probability: ${++shotsByProbability}`);
  }

  const makeRandomShot = (mapLineSize: number): void => {
    const cellKey = Math.floor(Math.random() * Math.floor(mapLineSize));
    const { rowId, columnId } = getCellCoordinates(cellKey, rowSize);
    sendMessage(`open ${columnId} ${rowId}`);
  }

  // response handler
  useEffect(() => {
    if (response.includes('open: You win.')) {
      setWin(true);
      setRecord(response.slice(6));
      sendMessage('map');
      console.log(response);
    }

    // reset states to default
    if (response === 'new: OK') {
      setLose(false);
      setWin(false);
      setMapLine('');
      setMines([]);
      setChecked([]);
      setRowSize(0);
      setColumnSize(0);
      shotsByProbability = 0;
      setRecord(`attempt: ${++attempts}`);

      sendMessage('map');
    }

    if (response === 'open: You lose') {
      setLose(true);
      setRecord(response.slice(6));
      sendMessage('map');
    }

    if (response === 'open: OK') {
      sendMessage('map');
    }

    if (response.split('\n')[0] === 'map:') {
      setRowSize(response.split('\n')[1].length);
      setColumnSize(response.split('\n').length - 2);
      const mapLine = response.slice(5).split('\n').join('');
      setMapLine(mapLine);
      const unknowns = getAllUnknowns([...mapLine], mines);
      setUnknownsNumber(unknowns.length);
    }
  }, [response]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeLevel = useCallback((nextLevel) => {
    if (nextLevel === level) return;
    sendMessage(`new ${nextLevel}`);
    setLevel(nextLevel);
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeFlagMode = useCallback(() => {
    setFlagMode(!flagMode);
  }, [flagMode]);

  const onChangeRobotMode = useCallback(() => {
    setRobot(!robot);
  }, [robot]);

  const onReloadGame = useCallback(() => {
    sendMessage(`new ${level}`);
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClickUnknown = useCallback(
    (event) => {
      // $FlowFixMe
      const cellKey = event.target.dataset.id;
      if (flagMode) {
        mines.includes(cellKey)
          ? setMines((prev) => prev.filter(mineKey => mineKey !== cellKey))
          : setMines((prev) => [...prev, cellKey]);
      } else {
        const { rowId, columnId } = getCellCoordinates(cellKey, rowSize);
        sendMessage(`open ${columnId} ${rowId}`);
      }
    }, [flagMode, mines.join(','), rowSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Game
      level={level}
      isRobotMode={robot}
      isFlagMode={flagMode}
      log={log}
      mapLine={mapLine}
      rowSize={rowSize}
      mines={mines}
      unknownsNumber={unknownsNumber}
      onChangeFlagMode={onChangeFlagMode}
      onChangeRobotMode={onChangeRobotMode}
      onReloadGame={onReloadGame}
      onChangeLevel={onChangeLevel}
      onClickUnknown={onClickUnknown}
    />
  )
};

export default GameContainer;
