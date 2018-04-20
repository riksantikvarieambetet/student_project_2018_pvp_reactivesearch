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

  // TODO this style needs fixing its both inline and App.css
  render() {
    const { label, count, initialState } = this.props;
    const { checked } = this.state;
    return (
      <div className="label-list-item" style={{ "marginLeft": "40px", "marginTop": "2px", "marginBottom": "2px", "width": "310px" }}>
        <label className="container">
          <input
            type="checkbox"
            value={label}
            checked={checked}
            onChange={this.toggleItemChange}
          />
          <span>{label}</span>
          <span style={{ "float": "right", "marginRight": "40px" }}> {count} </span>

          <span className="checkmark"></span>
        </label>
      </div>
    );
  }
}
/* 

<label class="container">One
  <input type="checkbox" checked="checked">
    <span class="checkmark"></span>
</label> 

*/

export default LabelListItem;