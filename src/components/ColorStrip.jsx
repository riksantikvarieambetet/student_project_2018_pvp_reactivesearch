import React, { Component } from 'react';


class ColorStrip extends Component {

  buildColorstripPart = (color, index, widthUnit) => {
    let hue = color.color.h
    let saturation = color.color.s
    let lightness = color.color.l
    let pixelFraction = color.pixelFraction
    return (
      <div
        onClick={() => {
          this.props.setSelectedColors(hue, saturation, lightness);
        }}
        style={{
          backgroundColor: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
          width: (pixelFraction * widthUnit) + "px",
          height: "30px",
        }}
        key={index}>
      </div>
    )

  }

  render() {
    let colorstripWidth = 300;
    let pixelFractionSum = 0;
    this.props.colors.forEach((color) => {
      pixelFractionSum += color.pixelFraction
    })
    let widthUnit = colorstripWidth / pixelFractionSum;

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