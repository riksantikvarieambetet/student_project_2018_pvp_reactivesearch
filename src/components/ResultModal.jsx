import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LabelListItem from './LabelListItem'

//TODO länka till kringla via entityUri http://www.kringla.nu/kringla/objekt?referens= + raa/kmb/16000300032372

class ResultModal extends Component {

  createLabelListItems = (labels) => {
    return (labels.map(item =>
      <LabelListItem
        key={item.description}
        handleItemChange={(item) => console.log(item)}
        label={item.description}
        initialState={false}
        count={item.score}
      />
    ));
  }

  render() {

    if (!this.props.modalFields) return;

    let { description, service, image, organization, tag, context, googleVision } = this.props.modalFields
    let labels = googleVision.responses[0].labelAnnotations;
    console.dir(labels)
    let highres, lowres;
    let labelsstring = "";

    for (let label of labels) {
      labelsstring += " " + label.description;
    }

    for (let src of image.src) {
      if (src.type === 'highres') {
        highres = src.content;
        console.log(src.type)
      } else if (src.type === 'lowres') {
        console.log(src.type)
        lowres = src.content;
      }
    }


    return (
      <div style={{ display: "flex", flexDirection: "row", height: "800px" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
          <span><span style={{ minWidth: "100px" }}>Description:</span> {description ? description : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>organization:</span> {organization ? organization : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Tags:</span>{tag ? tag.toString().replace(",", " ") : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Service:</span>{service}</span>
          <span><span style={{ minWidth: "100px" }}>Context name:</span>{context.nameLabel ? context.nameLabel : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Context place:</span>{context.placeLabel ? context.placeLabel : "-"}</span>
          <span><span style={{ minWidth: "100px" }}>Context time:</span>{context.timeLabel ? context.timeLabel : "-"}</span>

          {this.createLabelListItems(labels)}
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