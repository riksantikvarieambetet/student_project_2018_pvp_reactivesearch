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
      confidenceRange: [0, 100],
      size: 20
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

  updateComponentQuery = (newSize) => {
    let newPartialQuery = this.buildPartialQuery()
    console.log(this.state.size + "building query")
    this.props.setDefaultQueryPartial({
      labels: newPartialQuery,
      lte: this.state.confidenceRange[1],
      gte: this.state.confidenceRange[0],
      size: newSize
    })
    let newComponentQuery = componentQuery({
      musts: newPartialQuery,
      url: Array.from(this.state.selectedLabels)
    })
    this.props.setQuery(newComponentQuery);
  }

  buildPartialQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let lte = this.state.confidenceRange[1];
    let gte = this.state.confidenceRange[0];
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

  showMoreLabels = () => {
    if (this.state.size > 1000000) return;
    //console.log(this.state.size + "before")
    let newSize = this.state.size * 2;
    this.setState({ size: newSize })
    // console.log(this.state.size + "after")
    this.updateComponentQuery(newSize)
  }

  showLessLabels = () => {
    this.setState({ size: 20 })
    this.updateComponentQuery(20)
  }

  render() {
    if (this.props.aggregations) {
      console.log(this.props.aggregations.googleVision)
      return (
        <div>
          <ReactiveComponent
            componentId="RectiveHistoslider"
            defaultQuery={() => reactiveHistosliderDefaultQuery({
              labels: Array.from(this.state.selectedLabels)
            })}
          >
            <RectiveHistoslider
              setParentValueRange={(newScore) => { this.setState({ confidenceRange: newScore }) }}
              rangeValue={this.state.confidenceRange}
              updateQuery={this.updateComponentQuery}
            />
          </ReactiveComponent>

          <h2 className="headings">Labels</h2>
          <div style={{ margin: "40px 0px 0px 40px" }}>
            {this.createLabelListItems(this.props.aggregations.googleVision.filterd.labels.buckets)}
          </div>
          {
            this.props.aggregations.googleVision.filterd.labels.sum_other_doc_count > 0 ?
              <div
                className="headings"
                style={{ margin: "5px 0px 0px 40px", cursor: "pointer", color: "blue" }}
                onClick={this.showMoreLabels}
              >
                {this.state.size} show more
              </div>
              : null
          }
          {
            this.state.size > 20 ?
              <div className="headings" style={{ margin: "5px 0px 0px 40px", cursor: "pointer", color: "blue" }} onClick={this.showLessLabels}>reset</div>
              : null
          }
        </div >
      )
    }
    return null;
  }
}

// style={{ marginLeft: "40px" }}

export default LabelAnnotationList;

