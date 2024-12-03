import React, { useState } from 'react';
import './index.css';
import { CreateMaze } from './CreateMaze';
import { ConfigureMaze } from './ConfigureMaze';
import axios from 'axios';
import { Maze } from './Maze';

/*
Entry point of the application. 
1. If the maze isn't defined(dimensions of the maze), CreateMaze component allows the user to define it.
2. Once the dimensions are defined, ConfigureMaze component allows the user to set obstacles and configure edge costs.
3. Once the obstacles and costs are defined, the Maze component kicks in to allow user to solve the maze and insert obstacles dynamically and then re-evaluate the path.
*/
function App() {
  const [maze, setMaze] = useState<Array<Array<number>>>();
  const [upwardWeights, setUpwardWeights] = useState<Array<Array<number>>>();
  const [rightwardWeights, setRightwardWeights] = useState<Array<Array<number>>>();
  const [mazeId, setMazeId] = useState<string>();

  function initializeMaze(createdMaze: Array<Array<number>>) {
    const rows = createdMaze.length;
    const cols = createdMaze[0].length;
    const upWeights = new Array<Array<number>>(rows - 1);
    for (let i = 0; i < rows - 1; i++) {
      upWeights[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        upWeights[i][j] = 1;
      }
    }
    const rightWeights = new Array(rows);
    for (let i = 0; i < rows; i++) {
      rightWeights[i] = new Array(cols - 1);
      for (let j = 0; j < cols - 1; j++) {
        rightWeights[i][j] = 1;
      }
    }
    setMaze(createdMaze);
    setUpwardWeights(upWeights);
    setRightwardWeights(rightWeights);
  }

  function finalize(finalizedMaze, upWeights, rightWeights) {
    setMaze(finalizedMaze);
    setUpwardWeights(upWeights);
    setRightwardWeights(rightWeights);
    axios.post("http://localhost:8080/create-maze", { "grid": maze, "upwardWeights": upWeights, "rightwardWeights": rightWeights })
      .then(res => res.data).then(data => setMazeId(data.mazeId)).catch(console.log);
  }

  return (
    <div className="bg-gray-900 h-screen text-white flex flex-col items-center">

      {
        maze === undefined ? <CreateMaze setMaze={initializeMaze} /> :
          (mazeId === undefined ? <ConfigureMaze maze={maze} upwardWeights={upwardWeights} rightwardWeights={rightwardWeights} configureMaze={finalize} /> :
            <Maze upwardWeights={upwardWeights} rightwardWeights={rightwardWeights} mazeId={mazeId} maze={maze} />
          )
      }
    </div>
  );
}
export default App;
