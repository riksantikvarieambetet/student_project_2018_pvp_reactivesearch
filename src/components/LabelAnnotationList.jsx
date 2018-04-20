import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    let newPartialQuery = this.buildPartialQuery()
    this.props.setAppstateQuery(newPartialQuery)
    this.updateComponentQuery(newPartialQuery)
  }

  updateComponentQuery = (newPartialQuery) => {
    let newComponentQuery = componentQuery({ musts: newPartialQuery, url: Array.from(this.state.selectedLabels) })
    this.props.setQuery(newComponentQuery);
  }

  buildPartialQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let lte = this.state.value[1];
    let gte = this.state.value[0];
    let queryMusts = [];

    labels.map((label) => {
      let LabelsQuery = partialComponentLabelsQuery({ gte: gte, lte: lte, label: label })
      queryMusts.push(LabelsQuery);
    });

    if (queryMusts.length === 0) {
      let sansLabelsQuery = partialComponentSansLabelsQuery({ gte: gte, lte: lte })
      queryMusts.push(sansLabelsQuery)
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
            defaultQuery={() => reactiveHistosliderDefaultQuery({ labels: Array.from(this.state.selectedLabels) })}
            react={{
              and: ["textSearch"]
            }}
          >
            <RectiveHistoslider
              setParentValueRange={(newScore) => { this.setState({ value: newScore }) }}
              parentBuildQuery={this.buildQuery}
              setParentRangeValue={(newValue) => this.setState({ value: newValue })}
            />
          </ReactiveComponent>
          {this.createLabelListItems(this.props.aggregations.labels.labels.buckets)}
        </div>
      )
    }
    return null;
  }
}

export default LabelAnnotationList;

