import React from 'react';
import StarRating from './starRating';

export default class ImageDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            rating: 0
        };
    }

    getStarRating(rating) {
       this.setState ({
           rating
       })
    }

    render() {
        return (
            <div className="imageDetails">
                <StarRating handleStarRating={this.getStarRating.bind(this)} imageId={this.props.imageId} imageUid={this.props.imageUid}/>
                <p>{this.props.comment}</p>
			</div>
        )
    }
  }