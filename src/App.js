import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList from './components/LabelAnnotationList'
import ColorPicker from './components/ColorPicker'
import {
  ReactiveBase,
  ResultCard,
  TextField,
  ReactiveComponent
} from '@appbaseio/reactivesearch';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedLabels: new Set(),
      query: null,
      colorQuery: [{ "match_all": {} }]
    };
  }

  setAppstateQuery = (newQuery) => {
    this.setState({ query: newQuery })
  }

  setColorQuery = (newquerry) => {
    this.setState({ colorQuery: newquerry })
  }

  textFieldQuery = (value) => {
    if (value === "") {
      return (
        {
          "query": {
            "match_all": {}
          }
        }
      );
    }
    else {
      return (
        {
          "query": {
            "multi_match": {
              "fields": ["description", "tag"],
              "query": value,
              "type": "most_fields",
              "fuzziness": "AUTO"
            }
          }
        }
      );
    }
  }

  labelDefaultQuery = () => {
    return (
      {
        "query": {
          "bool": {
            "must": this.state.query
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

  ColorDefaultQuery = (value, props) => {
    return (

      {
        "query": {
          "nested": {
            "path": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors",
            "query": {
              "bool": {
                "must":
                  this.state.colorQuery
              }
            }
          }
        },
        "size": 10000,
        "aggs": {
          "colors": {
            "nested": {
              "path": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors"
            },
            "aggs": {
              "h": {
                "terms": {
                  "field": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.h"

                },
                "aggs": {
                  "s": {
                    "terms": {
                      "field": "googleVision.responses.imagePropertiesAnnotation.dominantColors.colors.color.s"

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
    return (
      <ReactiveBase
        app="images"
        url='http://ul-aomlab01.testraa.se:8080/'>

        {/* url='http://localhost:9200/' */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>

            <TextField
              componentId="textSearch"
              style={{ "padding": "10px" }}
              dataField=""
              showFilter={true}
              URLParams={true}
              customQuery={this.textFieldQuery}
            />

            <ReactiveComponent
              componentId="LabelAnnotation"
              defaultQuery={this.labelDefaultQuery}
              URLParams={true}
              react={{
                and: ["textSearch", "ColorAnnotation"]
              }}
            >

              <LabelAnnotationList
                setAppstateQuery={this.setAppstateQuery}
              />

            </ReactiveComponent>

          </div>

          <ResultCard
            componentId="results"
            dataField="description"
            size={20}
            pagination={true}
            react={{
              and: ["textSearch", "LabelAnnotation", "ColorAnnotation"]
            }}
            onData={(res) => {
              return {
                image: res.image.src[0].content,
                title: res.description,
                description: res.tag
              }
            }}
            style={{
              width: "70%",
              textAlign: "center"
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", width: "15%" }}>

            <ReactiveComponent
              componentId="ColorAnnotation"
              defaultQuery={this.ColorDefaultQuery}
              react={{
                and: ["textSearch", "LabelAnnotation"]
              }}
            >

              <ColorPicker
                setColorQuery={this.setColorQuery}
              />

            </ReactiveComponent>

          </div>

        </div>

      </ReactiveBase>
    );
  }
}

export default App;
