import React from 'react';
import firebase, { auth, provider } from "../firebase.js";
import StarRatingComponent from 'react-star-rating-component';

export default class StarRating extends React.Component {
    constructor() {
        super();
        this.state = {
            rating: 0
        };
    }

    onStarClick(nextValue) {
        this.setState({rating: nextValue});

        firebase.database().ref(`/${this.props.imageUid}/${this.props.imageId}/rating`).set(nextValue);

        this.props.handleStarRating(nextValue);
    }

    componentDidMount() {
        const ratingRef = firebase.database().ref(`/${this.props.imageUid}/${this.props.imageId}/rating`);
        ratingRef.on('value', (snapshot) => {
            let rating = snapshot.val();
            this.setState({ rating })
        })
    }

    render() {
        const { rating } = this.state;
        return (                
            <div className="starRating">
                <StarRatingComponent 
                    name="rate1" 
                    starCount={5}
                    renderStarIcon={() => <span>♥︎</span>}
                    value={this.state.rating}
                    onStarClick={this.onStarClick.bind(this)}
                    starColor="#ffcbb6"
                />
            </div>
        );
    }
}

