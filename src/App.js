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

  constructor(props) {
    super(props);
    this.state = {
      query: null
    };
  }

  setAppstateQuery = (newQuery) => {
    this.setState({ query: newQuery })
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

  /* 
  ,
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
  */
  /*   
    "aggs": {
      "score": {
        "histogram": {
          "field": "googleVision.responses.labelAnnotations.score",
          "interval": 5
        }
      }
    } 
    
  */

  /* 
  
        "aggs": {
          "histo": {
            "nested": {
              "path": "googleVision.responses.labelAnnotations"
            },
            "aggs": {
              "score": {
                "histogram": {
                  "field": "googleVision.responses.labelAnnotations.score",
                  "interval": 5
                }
              }
            }
          }
        }

  */

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
              componentId="LabelAnnotationList"
              defaultQuery={this.labelDefaultQuery}
              react={{
                and: ["textSearch"]
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
              and: ["textSearch", "LabelAnnotationList"]
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
