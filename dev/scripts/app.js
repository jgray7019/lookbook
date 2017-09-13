import React from 'react';
import ReactDOM from 'react-dom';
import StarRating from './starRating.js';
import firebase, { auth, provider } from './firebase.js';
import shortid from 'shortid';

const dbRef = firebase.database().ref('/images');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			newImage: '',
			comment: '',
			images: []	,
			user: null,
			loading: false
		};
		this.handleUpload = this.handleUpload.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
			.then((result) => {
				const user = result.user;
				this.setState({
					user
				})

			});
	}
	logout() {
		auth.signOut()
			.then(() => {
				this.setState({
					user: null,
				});
			})
	}
	removeItem(key) {
		const itemRef = firebase.database().ref(`/images/${key}`);
		itemRef.remove();
	}
	handleSubmit(e) {
		e.preventDefault();
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
		// console.log(storageRef)
		let uploadImage = storageRef.child(file.name);
		// console.log('upload image', uploadImage);
		this.setState({
			loading: true,
		});
		uploadImage.put(file).then((snapshot) => {
			uploadImage.getDownloadURL().then((url) => {
				// console.log(url);
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
	  });
	  const imageRef = firebase.database().ref('/');
	  imageRef.on('value', (snapshot) => {
	  		let firebaseItems = snapshot.val();
	  		// console.log(firebaseItems);
	  		const images = [];
	  		for(let key in firebaseItems.images) {
	  			// console.log(firebaseItems.images[key]);
	  			images.push({
	  				key: key,
	  				imageUrl: firebaseItems.images[key].newImage,
	  				comment: firebaseItems.images[key].comment
	  			})
	  		}
	  		this.setState({
	  			images: images
	  		})
	  })
	}
    render() {
      return (
        <div className='app'>
          <header>
          	<div className="wrapper">
          		<h1>Lookbook</h1>
          		{this.state.user ?
		     	  <button className="logInBtn"onClick={this.logout}>Log Out</button>
		     	  :
		     	  <button className="logInBtn" onClick={this.login}>Log In</button>
		     	}
          	</div>
          </header>
          <main>
          {this.state.user ?
          	<div className="wrapper">
          		<div className="uploadNewImage">
	          		<form className="uploadImageForm" onSubmit={this.handleSubmit}>
	          				
	          				<input className="uploadImageInput" name="newImage" id="newImage" type="file" accept="image/*" ref={(ref) => {this.file = ref}} onChange={this.handleUpload}/>
	          			<label className="uploadFileContainer" htmlFor="newImage">Upload an outfit</label>
	          			<textarea name="comment" placeholder="comment" cols="20" rows="10" onChange={this.handleChange} value={this.state.comment}></textarea>
	          			{ (this.state.loading === true) ?
	          				<p className="loadingParagraph">Image is Loading!</p>
	          				:
	          				<input className="imageSubmit" disabled={!this.state.newImage} type="submit" />	
	          			}
	          		</form>
          		</div>
          		<div className="galleryContainer">
					<ul className="gallery">
						{this.state.images.map((singleImage) => {
							return(
								<li key={shortid.generate()}>
									<div className="imageContainer">
									<img src={singleImage.imageUrl} alt=""/>
									</div>
									<div className="imageTextContainer">
									<StarRating imageId={singleImage.key}/>
									<p>{singleImage.comment}</p>
									<button className="deleteOutfitBtn" onClick={() => this.removeItem(singleImage.key)}>Delete Outfit</button>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
          	</div>
          :
          <div className="logOutPage">
          	  <h2>Welcome to Lookbook</h2>
          	  <p>Lookbook is your personal outfit diary where you can upload your best outfits, rate your favourites and comment on what made them special. You'll never have that <span>nothing to wear</span> moment in your wardrobe again... (no guarantees though) </p>
          </div>
      	}
          </main>
        </div>
      );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

// user enters google sign in information to log in to app

// on submit, log in screen disappears and main page appears

// user clicks upload picture button

// user can select an image from their computer 

// on submit, user's image is appended to the image gallery

// on each image, user can rate their outfit a score from 1 star to 5 stars

// user can click on sign out button to sign out of google account







