import './App.css';
import React, { Component } from 'react';
import { ReactiveBase, SingleList, CategorySearch, SingleRange, ResultCard } from '@appbaseio/reactivesearch';

class App extends Component {

  render() {
    return (
      <ReactiveBase
        app="images"
        url='http://localhost:9200/'>

        <CategorySearch
          componentId="searchbox"
          dataField="googleVision.responses.labelAnnotations.description"
          categoryField="googleVision.responses.labelAnnotations.keyword"
          placeholder="Search for description"
        />

        <SingleRange
          componentId="scorefilter"
          dataField="googleVision.responses.labelAnnotations.score"
          title="Filter by score"
          data={[
            { "start": 0.0, "end": 0.8, "label": "0 to 5" },
            { "start": 0.8000001, "end": 1.0, "label": "5 to 10" }
          ]}
          defaultSelected="0 to 5"
        />

        <ResultCard
          componentId="results"
          dataField="googleVision.responses.labelAnnotations.description"
          size={20}
          pagination={true}
          react={{
            and: ["searchbox", "scorefilter"]
          }}
          onData={(res) => {
            console.log(res);
            return {
              image: res.image.src[0].content,
              title: res.description,
              description: res.brand + " " + "*".repeat(res.rating)
            }
          }}
        />

      </ReactiveBase>
    );
  }
}

export default App;
