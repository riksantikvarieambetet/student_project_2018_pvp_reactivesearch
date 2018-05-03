import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import { componentQuery, partialComponentQuery } from './../queries/ColorPickerQueries'
import ColorStrip from './ColorStrip'
import HSLThresholdSliders from './HSLThresholdSliders'

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColors: new Set(),
            h_Threshold: 15,
            s_Threshold: 25,
            l_Threshold: 15,
            currentColorPickerColor: { h: 0, s: 0, l: 0 }
        };
    }

    setSelectedColors = (h, s, l) => {
        let colorValue = h + ";" + s + ";" + l;
        if (this.state.selectedColors.has(colorValue)) {
            this.state.selectedColors.delete(colorValue)
        } else {
            this.state.selectedColors.add(colorValue)
        }

        this.updateComponentQuery()
    }

    updateComponentQuery = () => {
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
                h: parseFloat(values[0]),
                s: parseFloat(values[1]),
                l: parseFloat(values[2]),
                h_Threshold: parseFloat(this.state.h_Threshold),
                s_Threshold: parseFloat(this.state.s_Threshold),
                l_Threshold: parseFloat(this.state.l_Threshold)
            });
            console.log(this.state.h_Threshold + " pushing query")
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
                        cursor: "pointer",
                        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19"
                    }}
                    onClick={() => this.setSelectedColors(values[0], values[1], values[2])}
                    key={index}>
                </div>
            )
        }))
    }


    buildAvalibleColorGUI = (hits) => {
        if (hits.length === 0) return;

        return (
            <div>
                {
                    hits.map((element, index) => {
                        let colors = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors;
                        return (<ColorStrip key={index} colors={colors} colorstripWidth={100} setSelectedColors={this.setSelectedColors} />)
                    })
                }
            </div>
        )
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
                <div style={{ marginTop: "50px", display: "flex", justifyContent: "center" }}>
                    <div className="color-picker">
                        <ChromePicker
                            color={this.state.currentColorPickerColor}
                            onChangeComplete={this.handleChangeComplete}
                            disableAlpha={true}
                        />
                        <button className="button" onClick={this.handleClick}>ADD COLOR</button>
                        <h2 className="headings">Threshold</h2>
                        <HSLThresholdSliders
                            setH={(event) => { this.setState({ h_Threshold: event.target.value }) }}
                            setS={(event) => { this.setState({ s_Threshold: event.target.value }) }}
                            setL={(event) => { this.setState({ l_Threshold: event.target.value }) }}
                            h={this.state.h_Threshold}
                            s={this.state.s_Threshold}
                            l={this.state.l_Threshold}
                            updateQuery={() => this.updateComponentQuery()}
                        />
                    </div>
                </div>
                <h2 className="headings">Selected Colors</h2>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {this.buildSelectedColorGUI()}
                </div>
                <h2 className="headings">Dominant Colors</h2>
                <div style={{ display: "flex", marginTop: "45px", paddingTop: "15px", marginTop: "0px", justifyContent: "center" }}>
                    {this.buildAvalibleColorGUI(this.props.hits)}
                </div>
            </div >
        )
    }
}

export default ColorPicker;