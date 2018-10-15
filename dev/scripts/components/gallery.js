import React from 'react';
import firebase, { auth, provider } from '../firebase.js';

import Image from './image';
import ImageDetails from './imageDetails';
import FilterRating from './filterRating';

export default class Gallery extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            newImage: '',
			comment: '',
            images: [],
            filteredImages: [],
            user: null
        };
        this.removeItem = this.removeItem.bind(this);
        //this.initialImageState = this.state;
    }

    removeItem(uid, key) {
		const itemRef = firebase.database().ref(`/${uid}/${key}`);
		itemRef.remove();
    }

       
    getFilterRating(rating) {
        let filteredImages = this.state.images.filter((image) => {
            return image.rating == rating || image.rating > 0 == rating.includes('all');
        })
        this.setState({ filteredImages });
    };

    componentDidMount() {
	  auth.onAuthStateChanged((user) => {
	    if (user) {
	      this.setState({ user });
	    } 
        const imageRef = firebase.database().ref(user.uid);
        imageRef.on('value', (snapshot) => {
            let firebaseItems = snapshot.val();
            let images = [];
            for(let key in firebaseItems) {
                images.push({
                    key: key,
                    rating: firebaseItems[key].rating,
                    imageUrl: firebaseItems[key].newImage,
                    comment: firebaseItems[key].comment
                })
            }
            this.setState({
                images,
                filteredImages: images
            })
        });
	  });
	}

    render() {
        return (
            <div className="galleryContainer">
                <FilterRating getFilterRating={this.getFilterRating.bind(this)}/>
                <ul className="gallery">
                    {this.state.filteredImages.map((singleImage) => {
                        return(
                            <li key={singleImage.key}>
                                <Image source={singleImage.imageUrl} />
                                <div className="imageTextContainer">
                                    <ImageDetails comment={singleImage.comment} imageUid={this.state.user.uid} imageId={singleImage.key}/> 
                                </div>
                                <div className="deleteButtonContainer">
                                    <button className="deleteOutfitBtn" onClick={() => this.removeItem(this.state.user.uid, singleImage.key)}>Delete Outfit</button> 
                                </div>
                            </li>
                        )
                    })}
                </ul>
			</div>
        )
    }
}