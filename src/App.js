import './App.css';
import React, { Component } from 'react';
import { ReactiveBase, SingleList, CategorySearch, SingleRange, ResultCard, RangeSlider } from '@appbaseio/reactivesearch';

class App extends Component {

  render() {
    return (
      <ReactiveBase
        app="images"
        url='http://localhost:9200/'>

        <div style={{ display: "flex", flexDirection: "row" }}>

          <div style={{ display: "flex", flexDirection: "column", width: "40%" }}>

            <CategorySearch
              componentId="searchbox"
              dataField="googleVision.responses.labelAnnotations.description"
              categoryField="googleVision.responses.labelAnnotations.keyword"
              placeholder="Search for description"
              style={{
                padding: "5px",
                marginTop: "10px"
              }}
            />

            <RangeSlider
              componentId="scoreSlider"
              dataField="googleVision.responses.labelAnnotations.score"
              title="Label confidence"
              range={{
                "start": 0.0,
                "end": 1.0
              }}
              defaultSelected={{
                "start": 0.0,
                "end": 1.0
              }}
              rangeLabels={{
                "start": "Start",
                "end": "End"
              }}
              stepValue={1}
              showHistogram={true}
              interval={0.1}
              react={{
                and: ["searchbox", "scorefilter"]
              }}
              URLParams={false}
              style={{
                padding: "5px",
                marginTop: "10px"
              }}
            />
          </div>

          <ResultCard
            componentId="results"
            dataField="googleVision.responses.labelAnnotations.description"
            size={20}
            pagination={true}
            react={{
              and: ["searchbox", "scorefilter", "scoreSlider"]
            }}
            onData={(res) => {
              console.log(res);
              return {
                image: res.image.src[0].content,
                title: res.description,
                description: res.brand + " " + "*".repeat(res.rating)
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
