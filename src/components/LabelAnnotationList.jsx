import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LabelListItem from './LabelListItem'
import RectiveHistoslider from './ReactiveHistoslider'


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
    this.updateQueryState()
  }

  updateQueryState = () => {
    //console.log('updating query state ' + Array.from(this.state.selectedLabels))
    let newQuery = this.buildQuery()
    this.props.setAppstateQuery(newQuery)
    this.updateQuery(newQuery)
  }

  updateQuery = (musts) => {
    this.props.setQuery(
      {
        "query": {
          "bool": {
            "must": musts
          }
        },
        value: Array.from(this.state.selectedLabels) // behövs endast för routing
      }
    );
  }

  buildQuery = () => {
    console.log(Array.from(this.state.selectedLabels))
    let labels = Array.from(this.state.selectedLabels)
    let queryMusts = [];
    labels.map((label) => {
      // console.log("-------> " + this.state.value[0] + " " + this.state.value[1])
      queryMusts.push(
        {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "query": {
              "bool": {
                "must": [
                  { "term": { "googleVision.responses.labelAnnotations.description.keyword": label } },
                  {
                    "range": {
                      "googleVision.responses.labelAnnotations.score": {
                        "lte": this.state.value[1],
                        "gte": this.state.value[0]
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      );
    });
    if (queryMusts.length === 0) {
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
                  }
                ]
              }
            }
          }
        }
      )
    }
    return queryMusts;
  }
  // obs kolla att keyword finns på alla label queries 
  //Array.from(this.state.selectedLabels)
  reactiveHistosliderDefaultQuery = () => {
    let labels = Array.from(this.state.selectedLabels);
    if (labels.length === 0) {
      return (
        {
          "size": 0,
          "aggs": {
            "labelAnnotations": {
              "nested": {
                "path": "googleVision.responses.labelAnnotations"
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
      )
    } else {
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
                        "googleVision.responses.labelAnnotations.description.keyword": labels
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
                      "googleVision.responses.labelAnnotations.description.keyword": labels
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
            defaultQuery={this.reactiveHistosliderDefaultQuery}
            react={{
              and: ["textSearch"]
            }}
          >
            <RectiveHistoslider
              setParentValueRange={(newScore) => { this.setState({ value: newScore }) }}
              parentBuildQuery={this.buildQuery}
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

export function labelAnnotationListDefaultQuery(query) {
  return (
    {
      "query": {
        "bool": {
          "must": query
        }
      },
      "size": 0,
      "aggs": {
        "labels": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations"
          },
          "aggs": {
            "labels": {
              "terms": {
                "field": "googleVision.responses.labelAnnotations.description.keyword",
                "order": { "_count": "desc" },
                "size": 100000
              }
            }
          }
        }
      }
    }
  )
}