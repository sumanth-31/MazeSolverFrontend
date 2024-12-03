import React from "react";

export function getGrid(array: Array<Array<number>>, onClick?) {
    return (<div style={{ display: 'grid', gridTemplateColumns: `repeat(${array[0].length}, 1fr)` }} className="w-full">
        {array.map((row, rowIndex) =>
            row.map((item, colIndex) => (
                <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                        border: '1px solid white',
                        padding: '10px',
                        textAlign: 'center',
                        cursor: onclick === undefined ? 'default' : 'pointer',
                    }}
                    onClick={() => onClick === undefined ? null : onClick(rowIndex, colIndex)}
                >
                    {item}
                </div>
            ))
        )}
    </div>);
}

export function getUpdatedObstacleMaze(maze, r, c) {
    maze[r][c] = -1 - maze[r][c];
    const newMaze = JSON.parse(JSON.stringify(maze));
    return newMaze;
}