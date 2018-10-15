import React from 'react';

export default class Image extends React.Component {
    render() {
        return (
            <div className="imageContainer">
				<img src={this.props.source} alt=""/>
			</div>
        )
    }
  }