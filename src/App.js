import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList, { labelAnnotationListDefaultQuery } from './components/LabelAnnotationList'
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

  render() {
    // googleVision.responses.labelAnnotations
    return (
      <ReactiveBase
        app="images"
        url='http://localhost:9200/'>

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
                and: ["textSearch", "RectiveHistoslider"]
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
              and: ["textSearch", "labelAnnotationList", "RectiveHistoslider"]
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
