import React, { Component } from 'react';

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColors: new Set(),
            colorTreshold: 10,
            userCklicks: 0,
            hitstate: this.props.hits
        };
    }

    setSelectedColors = (h, s, l) => {
        let colorValue = h + ";" + s + ";" + l;
        if (this.state.selectedColors.has(colorValue)) {
            this.state.selectedColors.delete(colorValue)
        } else {
            this.state.selectedColors.add(colorValue)
        }

        this.setState({ userCklicks: this.state.userCklicks + 1 })
        let complete = this.mustBuilder();
        this.updateQuery(complete);

    }

    mustBuilder = () => {
        let returnArray = [];
        let colors = Array.from(this.state.selectedColors)
        colors.map((element) => {
            let values = element.split(";");
            returnArray.push(
                {
                    "nested": {
                        "path": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors",
                        "query": {
                            "bool": {
                                "must": [
                                    { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.h": { gte: values[0] - this.state.colorTreshold, lte: values[0] + this.state.colorTreshold } } },
                                    { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.s": { gte: values[1] - this.state.colorTreshold, lte: values[1] + this.state.colorTreshold } } },
                                    { "range": { "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.l": { gte: values[2] - this.state.colorTreshold, lte: values[2] + this.state.colorTreshold } } }
                                ]
                            }
                        }
                    }
                }
            )
        }
        )
        return returnArray;
    }

    updateQuery = (musts) => {
        this.props.setQuery(
            {
                "query": {
                    "bool": {
                        "must": musts
                    }
                }
            }
        );
        this.props.setColorQuery(musts)
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
        return (hits.map((element, index) => {
            let hue = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.h;
            let saturation = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.s;
            let lightness = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.l;
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
        }
        )
        )
    }

    render() {
        return (
            <div>
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "45px", width: "auto", paddingBottom: "15px", marginBottom: "0px" }}>
                    {this.buildSelectedColorGUI()}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", marginTop: "45px", width: "auto", borderTop: "1px solid black", paddingTop: "15px", marginTop: "0px" }}>
                    {this.buildAvalibleColorGUI(this.props.hits)}
                </div>
            </div>
        )
    }
}

export default ColorPicker;