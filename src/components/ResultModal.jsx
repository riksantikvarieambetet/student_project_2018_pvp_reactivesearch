import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LabelListItem from './LabelListItem'
import ColorStrip from './ColorStrip'

//TODO länka till kringla via entityUri http://www.kringla.nu/kringla/objekt?referens= + raa/kmb/16000300032372

class ResultModal extends Component {

  createLabelListItems = (labels) => {
    return (labels.map((item, index) =>
      <LabelListItem
        key={index}
        handleItemChange={(item) => console.log(item)}
        label={item.description}
        initialState={false}
        count={item.score}
      />
    ));
  }

  render() {

    if (!this.props.modalFields) return;

    const { description, service, image, organization, tag, context, googleVision, entityUri } = this.props.modalFields
    const labels = googleVision.responses[0].labelAnnotations;
    const colors = googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors;
    let highres, lowres;
    let kringla = "http://www.kringla.nu/kringla/objekt?referens=" + entityUri.slice(25)

    for (let src of image.src) {
      if (src.type === 'highres') {
        highres = src.content;
        break;
      } else if (src.type === 'lowres') {
        lowres = src.content;
      }
    }

    const ksamData = [
      { label: "Description:", text: description ? description : "-" },
      { label: "Organization:", text: organization ? organization : "-", },
      { label: "Tags:", text: tag ? tag : "-", },
      { label: "Service:", text: service ? service : "-" },
      { label: "Name:", text: context.nameLabel ? context.nameLabel : "-" },
      { label: "Place:", text: context.placeLabel ? context.placeLabel : "-" },
      { label: "Time:", text: context.timeLabel ? context.timeLabel : "-" },
      { label: "Attribution:", text: <a href={kringla} target="_blank">Kringla.nu</a> }

    ]


    return (
      <div style={{ display: "flex", flexDirection: "row", height: "800px" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
          {
            ksamData.map((row) => {
              return (
                <div key={row.label} style={{ display: "flex", flexDirection: "row", padding: "5px", fontSize: "14px" }}>
                  <div style={{ width: "150px", fontWeight: "bold" }}>{row.label}</div>
                  <div style={{ width: "100%" }}>{row.text}</div>
                </div>
              )
            })
          }
          <div style={{ padding: "5px" }}>
            <ColorStrip key={"color"} colors={colors} colorstripWidth={100} setSelectedColors={() => { console.log('not done') }} />
          </div>
          <div style={{ overflowY: "auto", padding: "5px" }}>
            {this.createLabelListItems(labels)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img style={{ display: "block", maxWidth: "1000px", maxHeight: "750px", width: "auto", height: "auto" }} src={highres ? highres : lowres} />
        </div>

      </div>
    )

  }
}
/* 
ResultModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
}; */

export default ResultModal;