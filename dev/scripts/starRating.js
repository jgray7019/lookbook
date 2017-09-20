import React from 'react';
import ReactDOM from 'react-dom';
import firebase, { auth, provider } from "./firebase.js";
import StarRatingComponent from 'react-star-rating-component';


const dbRef = firebase.database().ref('/');

export default class StarRating extends React.Component {
    constructor() {
        super();
        this.state = {
            rating: 0
        };
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});

      firebase.database().ref(`/${this.props.imageUid}/${this.props.imageId}/rating`).set(nextValue)
      console.log(this.props.imageId);
    }
    componentDidMount() {
        const ratingRef = firebase.database().ref(`/${this.props.imageUid}/${this.props.imageId}/rating`);
        ratingRef.on('value', (snapshot) => {
               
                let rating = snapshot.val()
                    
                this.setState({
                    rating: rating
                })
        })
    }

    render() {
        const { rating } = this.state;
        // console.log(rating);
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

