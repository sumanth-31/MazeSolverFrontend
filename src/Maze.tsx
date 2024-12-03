import React, { useState } from "react";
import { getGrid, getUpdatedObstacleMaze } from "./util";
import axios from "axios";

/*
The component that comes after configuration and allows the user to evaluate the path, while also dynamically inserting and removing obstacles from the environment.
*/
export const Maze = props => {
    const upwardWeights = props.upwardWeights;
    const rightwardWeights = props.rightwardWeights;
    const mazeId = props.mazeId;
    const [maze, setMaze] = useState(props.maze);
    const [lastSolvedMaze, setLastSolvedMaze] = useState([]);
    const [isSolved, setIsSolved] = useState(false);
    const [solution, setSolution] = useState<Array<Array<number>>>([]);
    const [pathCosts, setPathCosts] = useState();
    const [rhsCosts, setRhsCosts] = useState();
    const [nodesEvaluated, setNodesEvaluated] = useState();

    // Calls the solve-maze API of the backend to evaluate the whole graph
    function solveMaze() {
        axios.post("http://localhost:8080/solve-maze", { "mazeId": mazeId }).then(res => res.data).then(body => {
            setIsSolved(true);
            setSolution(body.path);
            setPathCosts(body.pathCosts);
            setRhsCosts(body.rhsValues);
            setNodesEvaluated(body.nodesEvaluated);
            setLastSolvedMaze(JSON.parse(JSON.stringify(maze)));
        }).catch(console.log);
    }

    // Calls the update-obstacle API of the backend which re-evaluates only a small portion of the graph to find the optimal path. The number of nodes evaluated is displayed on UI.
    function reEvaluateMaze() {
        const updates: any[] = [];
        if (lastSolvedMaze.length == 0) {
            for (let i = 0; i < maze.length; i++) {
                for (let j = 0; j < maze[0].length; j++) {
                    if (maze[i][j] == -1) {
                        updates.push({ "rowInd": i, "colInd": j, "udpate": "ADD" });
                    }
                }
            }
        } else {
            for (let i = 0; i < maze.length; i++) {
                for (let j = 0; j < maze[0].length; j++) {
                    if (maze[i][j] !== lastSolvedMaze[i][j]) {
                        updates.push({ "rowInd": i, "colInd": j, "update": maze[i][j] == 0 ? "REMOVE" : "ADD" });
                    }
                }
            }
        }
        axios.put("http://localhost:8080/update-obstacle", { "mazeId": mazeId, "updates": updates }).then(res => res.data).then(body => {
            setSolution(body.path);
            setPathCosts(body.pathCosts);
            setRhsCosts(body.rhsValues);
            setNodesEvaluated(body.nodesEvaluated);
            setLastSolvedMaze(JSON.parse(JSON.stringify(maze)));
        }).catch(console.log)
    }

    function getSolutionGrid() {
        const newMaze = JSON.parse(JSON.stringify(lastSolvedMaze));
        for (const element of solution) {
            const currentNode = element
            newMaze[currentNode[0]][currentNode[1]] = 1;
        }
        return getGrid(newMaze);
    }

    return (
        <div className="w-1/2 flex flex-col justify-around items-center">
            <h2>Maze:</h2>
            {getGrid(maze, (rowIndex, colIndex) => setMaze(getUpdatedObstacleMaze(maze, rowIndex, colIndex)))}
            {isSolved ?
                <button className="bg-blue-600 text-white p-2 rounded w-1/2 mt-3" onClick={e => reEvaluateMaze()}> Re-evaluate Maze</button> :
                <button className="bg-blue-600 text-white p-2 rounded w-1/2 mt-3" onClick={e => solveMaze()}> Solve Maze</button>
            }
            <h2>Solution:</h2>
            <p>{isSolved && solution.length > 0 ? getSolutionGrid() : null}</p>
            <p>{isSolved && solution.length === 0 ? "No solution exists" : null}</p>
            {pathCosts === undefined || solution.length === 0 ? null : <h2>Path Costs:</h2>}
            {pathCosts === undefined || solution.length === 0 ? null : getGrid(pathCosts)}
            {rhsCosts === undefined || solution.length === 0 ? null : <h2>RHS Costs:</h2>}
            {rhsCosts === undefined || solution.length === 0 ? null : getGrid(rhsCosts)}
            {nodesEvaluated === undefined || solution.length === 0 ? null : <h2>Nodes Evaluated: {nodesEvaluated}</h2>}
        </div>
    )
}