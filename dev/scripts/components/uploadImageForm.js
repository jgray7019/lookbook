import React from 'react';
import firebase, { auth, provider } from '../firebase.js';

export default class UploadImageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            newImage: '',
            comment: '',
            user: null,
        };
    }

    handleSubmit(e) {
        e.preventDefault();
		const dbRef = firebase.database().ref(this.state.user.uid);
		
		const newImageAndComment = {
			newImage: this.state.newImage,
			comment: this.state.comment,
			rating: 0
		}
		dbRef.push(newImageAndComment);	
		this.setState({
			newImage: '',
			comment: ''
		});
    }
    
    handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
    }
    
    handleUpload(e) {
		e.preventDefault();
		let file = this.file.files[0];
		let storageRef = firebase.storage().ref('/');
		let uploadImage = storageRef.child(file.name);

		this.setState({
			loading: true,
		});
		uploadImage.put(file).then((snapshot) => {
			uploadImage.getDownloadURL().then((url) => {
				this.setState({
					newImage: url ,
					loading: false
				});
			})
		})
    }

    componentDidMount() {
	  auth.onAuthStateChanged((user) => {
	    if (user) {
	      this.setState({ user });
        } 
    })
}

        render() {
            return ( 
                <div className="uploadNewImage">
                    <form className="uploadImageForm" onSubmit={this.handleSubmit.bind(this)}>
                        <input 
                            className="uploadImageInput" 
                            name="newImage" 
                            id="newImage" 
                            type="file" 
                            accept="image/*" 
                            ref={(ref) => {this.file = ref}} 
                            onChange={this.handleUpload.bind(this)}
                        />
                        <label 
                            className="uploadFileContainer" 
                            htmlFor="newImage">
                                Upload an outfit
                        </label>
                        <textarea 
                            name="comment" 
                            placeholder="comment" 
                            cols="20" 
                            rows="10" 
                            onChange={this.handleChange.bind(this)} 
                            value={this.state.comment}>
                        </textarea>
                        { (this.state.loading === true) ?
                            <p className="loadingParagraph">Image is Loading!</p>
                            :
                            <input 
                                className="imageSubmit" 
                                disabled={!this.state.newImage} 
                                type="submit" 
                            />	
                        }
                    </form>
                </div>
            )
        }
    
}