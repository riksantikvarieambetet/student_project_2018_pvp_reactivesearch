import React, { Component } from 'react';


class ColorStrip extends Component {

  buildColorstripPart = (color, index, widthUnit) => {
    let hue = color.color.h
    let saturation = color.color.s
    let lightness = color.color.l
    let score = color.score
    console.log(widthUnit)
    return (
      <div
        onClick={() => {
          this.props.setSelectedColors(hue, saturation, lightness);
        }}
        style={{
          backgroundColor: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
          width: (score * widthUnit) + "px",
          height: "30px",
        }}
        key={index}>
      </div>
    )

  }

  render() {
    let colorstripWidth = 300;
    let scoreSum = 0;
    this.props.colors.forEach((color) => {
      scoreSum += color.score
    })
    let widthUnit = colorstripWidth / scoreSum;

    return (
      <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px", cursor: "pointer" }}>
        {this.props.colors.map((color, index) => {
          return this.buildColorstripPart(color, index, widthUnit)
        })}
      </div>
    );
  }
}

export default ColorStrip;