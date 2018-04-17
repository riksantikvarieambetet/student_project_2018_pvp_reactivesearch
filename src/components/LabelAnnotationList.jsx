import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LabelListItem from './LabelListItem'
import RectiveHistoslider from './ReactiveHistoslider'


import { ReactiveComponent } from '@appbaseio/reactivesearch';

class LabelAnnotationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedLabels: new Set(),
      value: [0, 100] // testing sliders
    };
  }

  setSelectedLabels = (label) => {
    if (this.state.selectedLabels.has(label)) {
      this.state.selectedLabels.delete(label);
    } else {
      this.state.selectedLabels.add(label);
    }
    this.updateQueryState()
  }

  updateQueryState = () => {
    //console.log('updating query state ' + Array.from(this.state.selectedLabels))
    let query = this.buildQuery()
    this.props.setAppstateQuery(query)
    this.updateQuery(query)
  }

  buildQuery = () => {
    let labels = Array.from(this.state.selectedLabels)
    let queryMusts = [];
    labels.map((label) => {
      queryMusts.push(
        {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "must": [
                  {
                    "range": {
                      "googleVision.responses.labelAnnotations.score": {
                        "lte": this.state.value[1],
                        "gte": this.state.value[0]
                      }
                    }
                  },
                  {
                    "term": {
                      "googleVision.responses.labelAnnotations.description.keyword": label
                    }
                  }
                ]
              }
            }
          }
        });
    });
    return queryMusts;
  }

  updateQuery = (musts) => {
    this.props.setQuery(
      {
        "query": {
          "bool": {
            "must": musts
          }
        },
        value: Array.from(this.state.selectedLabels)
      }
    );
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
  //Array.from(this.state.selectedLabels)
  ReactiveHistosliderDefaultQuery = () => {
    return (
      {
        "query": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "filter": [
                  {
                    "terms": {
                      "googleVision.responses.labelAnnotations.description": Array.from(this.state.selectedLabels)
                    }
                  }
                ]
              }
            },
            "inner_hits": {}
          }
        },
        "aggs": {
          "labelAnnotations": { // name of aggregated field 
            "nested": {
              "path": "googleVision.responses.labelAnnotations"
            },
            "aggs": {
              "inner": {
                "filter": {
                  "terms": {
                    "googleVision.responses.labelAnnotations.description": Array.from(this.state.selectedLabels)
                  }
                },
                "aggs": {
                  "score": {
                    "histogram": {
                      "field": "googleVision.responses.labelAnnotations.score",
                      "interval": 5,
                      "extended_bounds": {
                        "min": 0,
                        "max": 95
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  }

  render() {
    if (this.props.aggregations) {
      return (
        <div>
          <ReactiveComponent
            componentId="RectiveHistoslider"
            defaultQuery={this.ReactiveHistosliderDefaultQuery}
            react={{
              and: ["textSearch", "LabelAnnotationList"]
            }}
          >
            <RectiveHistoslider />
          </ReactiveComponent>
          {this.createLabelListItems(this.props.aggregations.labels.labels.buckets)}
        </div>
      )
    }
    return null;
  }
}

export default LabelAnnotationList;