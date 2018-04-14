import React, { Component } from 'react';

class LabelListItem extends Component {
  state = {
    checked: false,
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
    const { label, count } = this.props;
    const { checked } = this.state;
    return (
      <div className="label-list-item" style={{ "marginLeft": "10px", "marginTop": "5px" }}>
        <label>
          <input
            type="checkbox"
            value={label}
            checked={checked}
            onChange={this.toggleItemChange}
          />

          {label}
          {count}
        </label>
      </div>
    );
  }
}

export default LabelListItem;