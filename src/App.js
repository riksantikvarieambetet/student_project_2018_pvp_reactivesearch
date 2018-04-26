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
  ResultCard,
  TextField,
  ReactiveComponent
} from '@appbaseio/reactivesearch';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      partialLabelQuery: null,
      partialColorQuery: [{ "match_all": {} }],
      modalIsOpen: false,
      modalFields: null
    };
  }

  setAppstateQuery = (newQuery) => {
    this.setState({ partialLabelQuery: newQuery })
  }

  setColorQuery = (newQuery) => {
    this.setState({ partialColorQuery: newQuery })
  }

  //MOdal methods

  openModal = (modalFields) => {
    this.setState({ modalIsOpen: true, modalFields: modalFields });

  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  renderModal = () => {
    if (!this.state.modalFields) return;
    let { description, service, image, organization, tag, context } = this.state.modalFields
    let highres, lowres;
    for (let src of image.src) {
      if (src.type === 'highres') {
        highres = src.content;
      } else if (src.type === 'lowres') {
        console.log(src.type)
        lowres = src.content;
      }
    }

    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span><span style={{ minWidth: "100px" }}>Description:</span> {description ? description : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>organization:</span> {organization ? organization : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Tags:</span>{tag ? tag.toString().replace(",", " ") : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Service:</span>{service}</span>
          <span><span style={{ minWidth: "100px" }}>Context name:</span>{context.nameLabel ? context.nameLabel : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Context place:</span>{context.placeLabel ? context.placeLabel : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Context time:</span>{context.timeLabel ? context.timeLabel : "-"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={highres ? highres : lowres} />
        </div>

      </div>
    )
  }
  /* 
    "nameLabel": "Lundberg, Bengt A",
    "placeLabel": "Län: Gotland, Kommun: Gotland, Landskap: Gotland, Socken: Visby",
    "timeLabel": "2001-08-15 - 2001-08-15" */

  render() {
    return (
      <ReactiveBase
        app="images"
        url='http://ul-aomlab01.testraa.se:8080/'>

        {/* url='http://localhost:9200/' : url='http://ul-aomlab01.testraa.se:8080/'*/}
        <button onClick={this.openModal}>Open Modal</button>
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
          contentLabel="Example Modal"
        >
          {this.renderModal()}

        </Modal>

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
              defaultQuery={() => labelAnnotationListDefaultQuery(this.state.partialLabelQuery)}
              react={{
                and: ["textSearch", "RectiveHistoslider", "ColorAnnotation"]
              }}
            >

              <LabelAnnotationList
                setDefaultQueryPartial={this.setAppstateQuery}
              />

            </ReactiveComponent>

          </div>

          <ResultCardModified
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
              defaultQuery={() => colorPickerDefaultQuery({ musts: this.state.partialColorQuery })}
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
