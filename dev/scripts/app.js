import React from 'react';
import ReactDOM from 'react-dom';
import StarRating from './starRating.js';
import firebase, { auth, provider } from './firebase.js';
import shortid from 'shortid';



const dbRef = firebase.database().ref('/');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			newImage: '',
			comment: '',
			images: [],
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
	removeItem(uid, key) {
		// console.log(uid, key)
		const itemRef = firebase.database().ref(`/${uid}/${key}`);
		itemRef.remove();
	}
	handleSubmit(e) {
		const dbRef = firebase.database().ref(this.state.user.uid);
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
		// let user;	
	  auth.onAuthStateChanged((user) => {
	    if (user) {
	    	// user = user.uid	
	      this.setState({ user });
	    } 
	    	// console.log(user.uid)
		  const imageRef = firebase.database().ref(user.uid);
		  imageRef.on('value', (snapshot) => {
		  		let firebaseItems = snapshot.val();
		  		// console.log(user);
		  		// console.log(firebaseItems);
		  		let images = [];
		  		for(let key in firebaseItems) {
		  			// console.log(firebaseItems[key].comment)
		  			images.push({
		  				key: key,
		  				imageUrl: firebaseItems[key].newImage,
		  				comment: firebaseItems[key].comment
		  			})
		  		}
		  		this.setState({
		  			images: images
		  		})
		  })
	  });
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
										<StarRating imageId={singleImage.key} imageUid={this.state.user.uid}/>
										<p>{singleImage.comment}</p>
										<button className="deleteOutfitBtn" onClick={() => this.removeItem(this.state.user.uid, singleImage.key)}>Delete Outfit</button>
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
