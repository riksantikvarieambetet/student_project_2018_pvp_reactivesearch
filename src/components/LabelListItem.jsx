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

  render() {
    const { label, count, initialState } = this.props;
    const { checked } = this.state;
    return (
      <div className="label-list-item" style={{ "marginLeft": "10px", "marginTop": "5px" }}>
        <label className="container">
          {label + "    "}
          {count}
          <input
            type="checkbox"
            value={label}
            checked={checked}
            onChange={this.toggleItemChange}
          />
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