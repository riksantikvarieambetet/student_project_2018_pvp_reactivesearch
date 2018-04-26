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
    this.props.setDefaultQueryPartial(newPartialQuery)
    let newComponentQuery = componentQuery({ musts: newPartialQuery, url: Array.from(this.state.selectedLabels) })
    this.props.setQuery(newComponentQuery);
  }

  buildPartialQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let lte = this.state.value[1];
    let gte = this.state.value[0];
    let queryMusts = [];

    if (queryMusts.length === 0) {
      let sansLabelsQuery = partialComponentSansLabelsQuery({ gte: gte, lte: lte })
      queryMusts.push(sansLabelsQuery)
    } else {
      queryMusts = labels.map((label) => {
        return partialComponentLabelsQuery({ gte: gte, lte: lte, label: label })
      });
    }

    queryMusts = labels.map((label) => {
      return partialComponentLabelsQuery({ gte: gte, lte: lte, label: label })
    });

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
              labels: Array.from(this.state.selectedLabels),
              gte: this.state.value[0],
              lte: this.state.value[1]
            })}
            react={{
              and: ["textSearch", "labelAnnotationList"]
            }}
          >
            <RectiveHistoslider
              //setParentValueRange={(newScore) => { this.setState({ value: newScore }) }}
              //parentBuildQuery={this.updateComponentQuery}
              selectedLabels={this.state.selectedLabels}
            />
          </ReactiveComponent>
          <div style={{ "marginLeft": "40px" }}>
            {this.createLabelListItems(this.props.aggregations.labels.labels.buckets)}
          </div>
        </div>
      )
    }
    return null;
  }
}

export default LabelAnnotationList;

