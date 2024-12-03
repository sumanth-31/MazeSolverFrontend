import React, { useState } from "react";
import { getGrid, getUpdatedObstacleMaze } from "./util";

/*
Component that allows the user to configure the maze, i.e., declare the position of obstacles and the cost of edges.
*/
export const ConfigureMaze = props => {
    const [maze, setMaze] = useState(props.maze);
    const [upwardWeights, setUpwardWeights] = useState(props.upwardWeights);
    const [rightwardWeights, setRightwardWeights] = useState(props.rightwardWeights);
    return (
        <div className="w-1/2 flex flex-col justify-around items-center">
            <h1>MAZE CONFIGURATION</h1>
            <h2 className="text-center m-10">Maze:</h2>
            {getGrid(maze, (rowIndex, colIndex) => setMaze(getUpdatedObstacleMaze(maze, rowIndex, colIndex)))}
            <h2 className="text-center m-10">Downward Weights:</h2>
            {/*Display as downward weights because array when displayed, starts from the first row to last, 
            meaning that the top-left node is the start node and the bottom right is the goal node. 
            However, design of the project takes first element of first array (start node) as bottom left, and last element of last array (goal node) as top-right.
            Although the naming can be confusing due to code-design differences, the algorithm works in the same way*/} 
            {getInputGrid(upwardWeights, (val, r, c) => setUpwardWeights(getUpdatedGrid(val, upwardWeights, r, c)))}
            <h2 className="text-center m-10">RightwardWeights:</h2>
            {getInputGrid(rightwardWeights, (val, r, c) => setRightwardWeights(getUpdatedGrid(val, rightwardWeights, r, c)))}
            <button className="bg-blue-600 text-white p-2 rounded w-1/2 mt-3" onClick={e => props.configureMaze(maze, upwardWeights, rightwardWeights)}> Finalize Maze</button>
        </div>
    );
}


function getInputGrid(array, onChange) {
    return (<div style={{ display: 'grid', gridTemplateColumns: `repeat(${array[0].length}, 1fr)` }} className="w-full">
        {array.map((row, rowIndex) =>
            row.map((item, colIndex) => (
                <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                        border: '1px solid white',
                        padding: '10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <input className="text-black" value={item} onChange={e => onChange(e.target.value, rowIndex, colIndex)} type="number"></input>
                </div>
            ))
        )}
    </div>);
}

function getUpdatedGrid(newVal, grid, r, c) {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[r][c] = newVal;
    return newGrid;
}