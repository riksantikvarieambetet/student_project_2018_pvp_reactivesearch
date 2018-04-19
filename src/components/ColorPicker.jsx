import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import rgbToHsl from 'rgb-to-hsl'
import { ReactiveList } from '@appbaseio/reactivesearch';

class ColorPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        let hue = 0;
        let saturation = 0;
        let lightness = 0;
    }


    render() {
        if (this.props.aggregations) {
            console.dir(this.props);
        }

        return (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "45px", width: "auto" }}>
                {
                    this.props.hits.map((element, index) => {
                        this.hue = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.h;
                        this.saturation = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.s;
                        this.lightness = element._source.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors[0].color.l;

                        return (
                            <div
                                style={{
                                    backgroundColor: "hsl(" + this.hue + ", " + this.saturation + "%, " + this.lightness + "%)",
                                    width: "30px",
                                    height: "30px",
                                    margin: "5px",
                                    borderRadius: "100%",
                                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19"
                                }}
                                key={index}>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default ColorPicker;