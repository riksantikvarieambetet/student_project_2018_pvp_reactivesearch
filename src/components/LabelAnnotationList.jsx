import React, { Component } from 'react';
import LabelListItem from './LabelListItem'
import RectiveHistoslider from './ReactiveHistoslider'

import { reactiveHistosliderDefaultQuery } from './../queries/ReactiveHistosliderQueries'
import {
  componentQuery,
  partialComponentLabelsQuery,
  partialComponentSansLabelsQuery
} from './../queries/LabelAnnotationListQueries'


import { ReactiveComponent, DataController } from '@appbaseio/reactivesearch';

class LabelAnnotationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedLabels: new Set(),
      value: [0, 100]
    };
  }

  setSelectedLabels = (label) => {
    if (this.state.selectedLabels.has(label)) {
      this.state.selectedLabels.delete(label);
    } else {
      this.state.selectedLabels.add(label);
    }
    this.updateComponentQuery();
  }

  updateComponentQuery = () => {
    let newPartialQuery = this.buildPartialQuery()
    console.log('trying to read ' + this.state.value[0])
    this.props.setDefaultQueryPartial({
      labels: newPartialQuery,
      lte: this.state.value[1],
      gte: this.state.value[0]
    })
    let newComponentQuery = componentQuery({
      musts: newPartialQuery,
      url: Array.from(this.state.selectedLabels)
    })
    this.props.setQuery(newComponentQuery);
  }

  buildPartialQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let lte = this.state.value[1];
    let gte = this.state.value[0];
    let queryMusts = [];

    if (labels.length === 0) {
      let sansLabelsQuery = partialComponentSansLabelsQuery({ gte: gte, lte: lte })
      queryMusts.push(sansLabelsQuery)
    } else {
      queryMusts = labels.map((label) => {
        return partialComponentLabelsQuery({ gte: gte, lte: lte, label: label })
      });
    }
    return queryMusts;
  }

  createLabelListItems = (buckets) => {
    return (buckets.map(item =>
      <LabelListItem
        key={item.key}
        handleItemChange={this.setSelectedLabels}
        label={item.key}
        count={item.doc_count}
        initialState={this.state.selectedLabels.has(item.key)}
      />
    ));
  }

  render() {
    if (this.props.aggregations) {
      return (
        <div>
          <ReactiveComponent
            componentId="RectiveHistoslider"
            defaultQuery={() => reactiveHistosliderDefaultQuery({
              labels: Array.from(this.state.selectedLabels)
            })}
          >
            <RectiveHistoslider
              setParentValueRange={(newScore) => { this.setState({ value: newScore }) }}
              rangeValue={this.state.value}
              updateQuery={this.updateComponentQuery}
            />
          </ReactiveComponent>
          <div style={{ "marginLeft": "40px" }}>
            {this.createLabelListItems(this.props.aggregations.googleVision.filterd.labels.buckets)}
          </div>
        </div>
      )
    }
    return null;
  }
}

export default LabelAnnotationList;

