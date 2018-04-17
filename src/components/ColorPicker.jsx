import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import rgbToHsl from 'rgb-to-hsl'
import { ReactiveList } from '@appbaseio/reactivesearch';

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rgb: { r: 255, g: 100, b: 50 }
        };
    }

    render() {
        console.dir(this.props);
        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
            </div>
        )
    }
}

export default ColorPicker;