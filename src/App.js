import './App.css';
import React, { Component } from 'react';
import LabelAnnotationList from './components/LabelAnnotationList'
import ColorPicker from './components/ColorPicker'
import ResultModal from './components/ResultModal'
import { labelAnnotationListDefaultQuery } from './queries/LabelAnnotationListQueries'
import { colorPickerDefaultQuery } from './queries/ColorPickerQueries'
import { textFieldQuery } from './queries/TextFieldQueries'
import Modal from 'react-modal';
import ResultCardModified from './components/ResultCardModified'

import {
  ReactiveBase,
  TextField,
  ReactiveComponent
} from '@appbaseio/reactivesearch';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      partialLabelQuery: { labels: [], gte: 0, lte: 100, size: 20 },
      partialColorQuery: [{ "match_all": {} }],
      modalIsOpen: false,
      modalFields: null,
      paginationSize: 20,
      currentPage: 1
    };
  }

  setLabelsQuery = (newQuery) => {
    this.setState({ partialLabelQuery: newQuery })
  }

  setColorQuery = (newQuery) => {
    this.setState({ partialColorQuery: newQuery })
  }

  openModal = (modalFields) => {
    this.setState({
      modalIsOpen: true,
      modalFields: modalFields
    });

  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  handlePageChange = (page) => {
    if (page !== this.state.currentPage) {
      this.setState({ currentPage: page });
    }
  }

  render() {
    return (
      <ReactiveBase
        //  app="test_data"
        // url='http://ul-aomlab01.testraa.se:8080/'
        app="test_data"
        url='http://localhost:9200/'
      >

        {/* url='http://localhost:9200/' : url='http://ul-aomlab01.testraa.se:8080/'*/}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)'
            }
          }}
        >
          <ResultModal
            modalFields={this.state.modalFields}
          />

        </Modal>

        <div style={{ display: "flex", flexDirection: "row" }}>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "350px", minWidth: "350px" }}>

            <TextField
              componentId="textSearch"
              style={{ "padding": "10px", margin: "42px 0px 0px 30px", width: "300px" }}
              dataField=""
              showFilter={true}
              customQuery={textFieldQuery}
              placeholder="search"
            />

            <ReactiveComponent
              componentId="labelAnnotationList"
              defaultQuery={() => labelAnnotationListDefaultQuery(this.state.partialLabelQuery)}
              react={{
                and: ["textSearch", "RectiveHistoslider", "ColorAnnotation"]
              }}
            >

              <LabelAnnotationList
                setDefaultQueryPartial={this.setLabelsQuery}
              />

            </ReactiveComponent>

          </div>

          <ResultCardModified
            onPageChange={(page) => this.handlePageChange(page)}
            componentId="results"
            dataField="description"
            size={this.state.paginationSize}
            pagination={true}
            react={{
              and: ["textSearch", "labelAnnotationList", "ColorAnnotation"]
            }}
            onData={(res) => {
              let highres, lowres;
              for (let src of res.image.src) {
                if (src.type === 'highres') {
                  highres = src.content;
                  break;
                } else if (src.type === 'lowres') {
                  lowres = src.content;
                }
              }
              return {
                image: highres ? highres : lowres,
                title: res.description ? res.description : res.itemLabel,
                description: res.tag,
                modalData: res,
                openModal: this.openModal
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
              defaultQuery={() => colorPickerDefaultQuery({
                musts: this.state.partialColorQuery,
                paginationSize: this.state.paginationSize,
                from: (this.state.currentPage - 1) * this.state.paginationSize
              })}

              react={{
                and: ["textSearch", "labelAnnotationList", "RectiveHistoslider"]
              }}
            >

              <ColorPicker
                setDefaultQueryPartial={this.setColorQuery}
              />

            </ReactiveComponent>

          </div>

        </div>

      </ReactiveBase>
    );
  }
}

export default App;
