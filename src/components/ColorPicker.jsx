import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import { componentQuery, partialComponentQuery } from './../queries/ColorPickerQueries'

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColors: new Set(),
            colorTreshold: 10,
            h_Treshold: 10,
            s_Treshold: 25,
            l_Treshold: 15,
            userCklicks: 0,
            hitstate: this.props.hits, // TODO behövs detta ???
            currentColorPickerColor: { h: 0, s: 0, l: 0 }
        };
    }

    setSelectedColors = (h, s, l) => {
        console.log(h, s, l)
        let colorValue = h + ";" + s + ";" + l;
        if (this.state.selectedColors.has(colorValue)) {
            this.state.selectedColors.delete(colorValue)
        } else {
            this.state.selectedColors.add(colorValue)
        }

        // this.setState({ userCklicks: this.state.userCklicks + 1 })
        let partialQueries = this.buildPartialQueries();
        let query = componentQuery({ musts: partialQueries });
        this.props.setQuery(query);
        this.props.setDefaultQueryPartial(partialQueries)

    }

    buildPartialQueries = () => {
        let partialQueries = [];
        let colors = Array.from(this.state.selectedColors)
        colors.map((element) => {
            let values = element.split(";");
            let query = partialComponentQuery({
                h: values[0],
                s: values[1],
                l: values[2],
                h_Treshold: this.state.h_Treshold,
                s_Treshold: this.state.s_Treshold,
                l_Treshold: this.state.l_Treshold
            });

            partialQueries.push(query)
        }
        )
        return partialQueries;
    }

    buildSelectedColorGUI = () => {
        let colors = Array.from(this.state.selectedColors)
        return (colors.map((element, index) => {
            let values = element.split(";");
            return (
                <div
                    style={{
                        backgroundColor: "hsl(" + values[0] + ", " + values[1] + "%, " + values[2] + "%)",
                        width: "30px",
                        height: "30px",
                        margin: "5px",
                        borderRadius: "100%",
                        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19"
                    }}
                    onClick={() => this.setSelectedColors(values[0], values[1], values[2])}
                    key={index}>
                </div>
            )
        }
        )
        )
    }

    buildAvalibleColorGUI = (hits) => {
        if (hits.length === 0) return;
        /* 
                for (i = 0; i < hits.length; i++) {
                    text += hits[i] + "<br>";
                }
         */
        let len = Array.from(this.state.selectedColors).length;
        return (hits.map((element, index) => {
            let hue = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0 + len].color.h;
            let saturation = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0 + len].color.s;
            let lightness = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0 + len].color.l;
            return (
                <div
                    onClick={() => {
                        this.setSelectedColors(hue, saturation, lightness);
                    }}
                    style={{
                        backgroundColor: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
                        width: "30px",
                        height: "30px",
                        margin: "5px",
                        borderRadius: "100%",
                        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19"
                    }}
                    key={index}>
                </div>
            )
        }))
    }

    handleChangeComplete = (color) => {
        this.setState({ currentColorPickerColor: { h: color.hsl.h, s: color.hsl.s, l: color.hsl.l } })
    };

    handleClick = () => {
        let h = this.state.currentColorPickerColor.h
        let s = this.state.currentColorPickerColor.s
        let l = this.state.currentColorPickerColor.l

        this.setSelectedColors(h, s * 100, l * 100);

    }

    render() {
        return (
            <div>
                <div style={{ marginTop: "15px", display: "flex" }}>
                    <ChromePicker
                        color={this.state.currentColorPickerColor}
                        onChangeComplete={this.handleChangeComplete}
                        disableAlpha={true}
                    />
                </div>
                <button onClick={this.handleClick}>Add</button>
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "45px", width: "auto", paddingBottom: "15px", marginBottom: "0px" }}>
                    {this.buildSelectedColorGUI()}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "45px", width: "auto", borderTop: "1px solid black", paddingTop: "15px", marginTop: "0px" }}>
                    {this.buildAvalibleColorGUI(this.props.hits)}
                </div>
            </div >
        )
    }
}

export default ColorPicker;