import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import "./pathfinder.css";

let START_NODE_ROW = 10;
let START_NODE_COL = 5;
let END_NODE_ROW = 10;
let END_NODE_COL = 45;

export default class PathFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      mouseIsPressed: false,
    };
  }

  removeVisited() {
    const { nodes } = this.state;

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 50; j++) {
        nodes[i][j].isVisited = false;
      }
    }

    return nodes;
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    let flag = false;
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (i === 1) {
        this.setState({ nodes: this.removeVisited() });
      }
      setTimeout(() => {
        const newGrid = this.state.nodes.slice();
        const node = visitedNodesInOrder[i];
        let newNode = { ...node };
        if (nodesInShortestPathOrder.includes(node)) {
          newNode = {
            ...node,
            isInShortestPath: true,
          };
        } else {
          newNode = {
            ...node,
            isVisited: true,
          };
        }
        newGrid[node.row][node.col] = newNode;

        this.setState({ nodes: newGrid });
      }, 5 * i);
    }
  }

  visualizeDijkstra() {
    const { nodes } = this.state;
    const startNode = nodes[START_NODE_ROW][START_NODE_COL];
    const endNode = nodes[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = dijkstra(nodes, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ nodes: grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.nodes, col, row);
    this.setState({ nodes: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.nodes, col, row);
    this.setState({ nodes: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  render() {
    const { nodes, mouseIsPressed } = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's algorithm
        </button>
        <button
          onClick={() => {
            window.location.reload();
          }}
        >
          Reset
        </button>
        <div className="grid">
          {nodes.map((row, rowidx) => {
            return (
              <div
                key={rowidx}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {row.map((node, nodeidx) => {
                  const {
                    isStart,
                    isFinish,
                    isVisited,
                    isWall,
                    row,
                    col,
                    isInShortestPath,
                  } = node;
                  return (
                    <Node
                      key={nodeidx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isVisited={isVisited}
                      isWall={isWall}
                      isInShortestPath={isInShortestPath}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let i = 0; i < 20; i++) {
    let currentRow = [];
    for (let j = 0; j < 50; j++) {
      currentRow.push(createNode(j, i));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    isInShortestPath: false,
  };
};

const getNewGridWithWallToggled = (grid, col, row) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
