import React, { useState } from "react";

/*
 The component that allows the user to define the dimensions of the maze before configuring the environment.
*/
export const CreateMaze = (props) => {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    return (
        <div className="h-1/2 flex flex-col justify-around items-center w-full">
            <h3>Create Maze:</h3>
            <div className='flex w-1/2 justify-around'>
                <label>Rows:</label>
                <input className="text-black" type='number' value={rows} onChange={e => setRows(Math.max(2, Number(e.target.value)))} />
            </div>
            <div className='flex w-1/2 justify-around'>
                <label>Cols:</label>
                <input className="text-black" type='number' value={cols} onChange={e => setCols(Math.max(2, Number(e.target.value)))} />
            </div>
            <button className="bg-blue-600 text-white p-2 rounded w-1/6" onClick={e => props.setMaze(initializeMaze(rows, cols))}> Create Maze</button>
        </div>
    );
}

function initializeMaze(rows, cols) {
    const maze = new Array(rows);
    for (let i = 0; i < rows; i++) {
        maze[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            maze[i][j] = 0;
        }
    }
    return maze;
}