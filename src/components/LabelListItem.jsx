import React, { Component } from 'react';


class LabelListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: props.initialState
    };
  }

  toggleItemChange = () => {
    const { handleItemChange, label } = this.props;
    this.setState(({ checked }) => (
      {
        checked: !checked,
      }
    ));
    handleItemChange(label);
  }

  // TODO this style needs amending its both inline and App.css
  render() {
    const { label, count } = this.props;
    const { checked } = this.state;
    return (
      <div className="label-list-item" style={{ "margin": "2px 0px 2px 0px", "width": "310px" }}>
        <label className="container">
          <input
            type="checkbox"
            value={label}
            checked={checked}
            onChange={this.toggleItemChange}
          />
          <span>{label}</span>
          {count ? <span style={{ "float": "right", "marginRight": "40px" }}> {count} </span> : null}
          <span className="checkmark"></span>
        </label>
      </div>
    );
  }
}

export default LabelListItem;