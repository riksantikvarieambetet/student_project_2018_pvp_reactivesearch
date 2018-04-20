import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList from './components/LabelAnnotationList'
import ColorPicker from './components/ColorPicker'
import { labelAnnotationListDefaultQuery } from './queries/LabelAnnotationListQueries'
import { colorPickerDefaultQuery } from './queries/ColorPickerQueries'
import { textFieldQuery } from './queries/TextFieldQueries'

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
      labelsQuery: null,
      colorQuery: [{ "match_all": {} }]
    };
  }

  // setAppLabelsQuery
  setAppstateQuery = (newQuery) => {
    this.setState({ labelsQuery: newQuery })
  }

  // fix set setAppColorQuery
  setColorQuery = (newquerry) => {
    this.setState({ colorQuery: newquerry })
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
              customQuery={textFieldQuery}
            />

            <ReactiveComponent
              componentId="labelAnnotationList"
              defaultQuery={() => labelAnnotationListDefaultQuery(this.state.labelsQuery)}
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

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "350px", minWidth: "350px" }}>

            <ReactiveComponent
              componentId="ColorAnnotation"
              defaultQuery={() => colorPickerDefaultQuery(this.state.colorQuery)}
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
