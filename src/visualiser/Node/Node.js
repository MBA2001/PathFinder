import React, { Component } from "react";
import "./node.css";

export default class Node extends Component {
  render() {
    const {
      isStart,
      isFinish,
      isVisited,
      isWall,
      col,
      row,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isInShortestPath,
    } = this.props;
    const extractClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isInShortestPath
      ? "node-shortest-path"
      : isWall
      ? "node-wall"
      : isVisited
      ? "node-visited"
      : "node";
    return (
      <div
        className={extractClassName}
        id={`node-${row}-${col}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
