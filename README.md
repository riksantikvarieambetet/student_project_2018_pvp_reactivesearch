# Content based image search student project

This is a prototype commissioned by Riksantikvarieämbetet (RAÄ) in Visby. The prototype's purpose is to show the potential strengths or weaknesses of adding machine extracted labels to images made available through the SOCH/K-samsök API. The Google Vision service was used in conjunction with the RAÄ K-Samsök API to merge image information of 1000 photos. The result is presented via a React web application that allows a user to search images by combining labels as well as combinations of colors.

The design and development of the prototyp and an analysis of the precision of the machine extracted labels have been summarised in Max Collin's and Alfred Bjersander's student paper "[Innehållsbaserad bildsök - Förbättrad informationskvalitet för det fotografiska
kulturarvet](https://github.com/riksantikvarieambetet/student_project_2018_pvp_reactivesearch/blob/master/Inneh%C3%A5llsbaserad_bilds%C3%B6k_2018_05_31.pdf)" at Uppsala University.

## Getting Started

### Prerequisites

* Nodejs needs to be installed on your system. Refer to Nodejs documentation for your Operating system at: https://nodejs.org/en/
* Elasticsearch is needed as database and searchengine. Check documentation at: https://www.elastic.co/

### Installing

* Install Nodejs
* Install Elasticsearch
* Clone project to local folder

To install required dependencies run:
```
npm install
```

## Deployment

### Add data to Elasticsearch database.

First, add mapping included in './ElasticsearchConfigs/elasticsearchMappings.txt'-file:
```
curl -XPUT 'localhost:9200/test_data?pretty' -H 'Content-Type: application/json' -d <Content of elasticsearchMappings>
```

Then add test data from './ElasticsearchConfigs/test_data.json'-file:
```
curl -XPOST 'localhost:9200/test_data/googleVision/_bulk?pretty' --data-binary "@/path-to-test-data-file/test_data.json" -H 'Content-Type: application/json'
```

The default Elasticsearch-server is set to 'localhost:9200' and indice 'test_data'. If a change is needed, edit props for ReactiveBase-component in './src/App.js'



### Run project

run:
```
npm start
```

## Built With

* [React.JS](https://reactjs.org/) - The web framework used
* [ReactiveSearch](https://opensource.appbase.io/reactive-manual/) - React.js library for searchfunctions
* [Histoslider](https://github.com/samhogg/histoslider) - A D3 based histogram slider component for React.JS
* [react-color](https://casesandberg.github.io/react-color/) - A Collection of Color Pickers for React.JS
* [react-modal](https://github.com/reactjs/react-modal) - Accessible modal dialog component for React.JS

## Authors

* [Alfred Bjersander](alfred.bjersander@gmail.com)
* [Max Collin](maxcollin@gmail.com)
 

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details
