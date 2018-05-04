import React, { Component } from 'react';
import { heartBeat } from '../library/animations'

export default class Heart extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    heartBeat()
  }

  render() {
    return (
      <div>
        <img id="heart" src="../img/heart.svg" width="50" height="50" />
      </div>
    );
  }
}