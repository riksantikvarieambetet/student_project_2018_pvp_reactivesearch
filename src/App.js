import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList from './components/LabelAnnotationList'
import {
  ReactiveBase,
  SingleList,
  CategorySearch,
  SingleRange,
  ResultCard,
  RangeSlider,
  TextField,
  SelectedFilters,
  DataSearch,
  MultiList,
  ReactiveComponent
} from '@appbaseio/reactivesearch';


/* {
  "query": {
    "match_phrase_prefix": {
      "description": {
        "query": value,
          "slop": 10,
            "max_expansions": 50
      }
    }
  }
} */

class App extends Component {

  textFieldQuery = (value, props) => {
    return (
      {
        "query": {
          "multi_match": {
            "fields": ["description", "tag"],
            "query": value,
            "type": "phrase_prefix"
          }
        }
      }
    );
  }

  MultiListQuery = (value, props) => {
    return (
      {
        "query": {
          "nested": {
            "path": "googleVision.responses.labelAnnotations",
            "score_mode": "avg",
            "query": {
              "bool": {
                "must": [
                  { "match": { "googleVision.responses.labelAnnotations.description": "street" } },
                  { "range": { "googleVision.responses.labelAnnotations.score": { "lt": 55 } } }
                ]
              }
            }
          }
        }
      }
    )
  }

  MultiListQuery2 = (value, props) => {
    return (
      {
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


  render() {
    // googleVision.responses.labelAnnotations
    return (
      <ReactiveBase
        app="images"
        url='http://localhost:9200/'>

        <div style={{ display: "flex", flexDirection: "row" }}>

          <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>

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
              defaultQuery={this.MultiListQuery2}
              react={{
                and: ["textSearch"]
              }}
            >
              <LabelAnnotationList
                componentId="LabelAnnotationList"
              />
            </ReactiveComponent>
          </div>
          <ResultCard
            componentId="results"
            dataField="description"
            size={20}
            pagination={true}
            react={{
              and: ["textSearch", "LabelAnnotation"]
            }}
            onData={(res) => {
              return {
                image: res.image.src[0].content,
                title: res.description,
                description: res.tag
              }
            }}
            style={{
              width: "60%",
              textAlign: "center"
            }}
          />
        </div>
      </ReactiveBase>
    );
  }
}

export default App;
