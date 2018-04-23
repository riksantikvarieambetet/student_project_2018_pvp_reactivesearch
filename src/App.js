import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList from './components/LabelAnnotationList'
import ColorPicker from './components/ColorPicker'
import { labelAnnotationListDefaultQuery } from './queries/LabelAnnotationListQueries'

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

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "350px", minWidth: "350px" }}>

            <TextField
              componentId="textSearch"
              style={{ "padding": "10px" }}
              dataField=""
              showFilter={true}
              URLParams={true}
              customQuery={this.textFieldQuery}
            />

            <ReactiveComponent
              componentId="labelAnnotationList"
              defaultQuery={() => labelAnnotationListDefaultQuery(this.state.query)}
              react={{
                and: ["textSearch", "RectiveHistoslider", "ColorAnnotation"]
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
              and: ["textSearch", "labelAnnotationList", "RectiveHistoslider", "ColorAnnotation"]
            }}
            onData={(res) => {
              /*  res.googleVision.responses["0"].labelAnnotations.map((item) => {
                 if (item.description === "sky" && item.score > 60)
                   console.dir(item.score)
               }) */
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
                and: ["textSearch", "labelAnnotationList"]
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
