import React, { Component } from 'react';

import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import ReactiveList from '@appbaseio/reactivesearch/lib/components/result/ReactiveList';
import Title from '@appbaseio/reactivesearch/lib/styles/Title';
import Card, { container, Image } from '@appbaseio/reactivesearch/lib/styles/Card';

class ResultCardModified extends Component {
  static generateQueryOptions = props => ReactiveList.generateQueryOptions(props);

  renderAsCard = (item) => {
    const result = this.props.onData(item);

    if (result) {
      return (
        <Card
          onClick={() => result.openModal(item)}
          key={item._id}
          className={getClassName(this.props.innerClass, 'listItem')}
          target={this.props.target}
          rel={this.props.target === '_blank' ? 'noopener noreferrer' : null}
        >
          <Image
            style={{ backgroundImage: `url(${result.image})` }}
            className={getClassName(this.props.innerClass, 'image')}
          />
          {
            typeof result.title === 'string'
              ? <Title
                dangerouslySetInnerHTML={{ __html: result.title }}
                className={getClassName(this.props.innerClass, 'title')}
              />
              : (
                <Title className={getClassName(this.props.innerClass, 'title')}>
                  {result.title}
                </Title>
              )
          }
          {
            typeof result.description === 'string'
              ? <article dangerouslySetInnerHTML={{ __html: result.description }} />
              : <article>{result.description}</article>
          }
        </Card>
      );
    }

    return null;
  };

  render() {
    const { onData, ...props } = this.props;

    return (
      <ReactiveList
        {...props}
        onData={this.renderAsCard}
        listClass={container}
      />
    );
  }
}

ResultCardModified.propTypes = {
  innerClass: types.style,
  target: types.stringRequired,
  onData: types.func,
};

ResultCardModified.defaultProps = {
  target: '_blank',
};

export default ResultCardModified;
