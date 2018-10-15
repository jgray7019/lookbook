import React from 'react';
import ReactDOM from 'react-dom';

import firebase, { auth, provider } from './firebase.js';

import UploadImageForm from './components/uploadImageForm';
import Gallery from './components/gallery';
import LoggedOut from './components/loggedOut';

class App extends React.Component {
	constructor() {
		super();
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
			  this.setState({ user });
			}
		});
		this.state = {
			newImage: '',
			comment: '',
			images: [],
			user: null,
			loading: false
		};
		
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

    render() {
		return (
			<div className='app'>
				<header>
					<div className="wrapper">
						<h1>Lookbook</h1>
						{this.state.user ?
							<button className="logInBtn" onClick={this.logout}>Log Out</button>
							:
							<button className="logInBtn" onClick={this.login}>Log In</button>
						}
					</div>
				</header>
				<main>
					{this.state.user ?
						<div className="wrapper">
							<UploadImageForm />
							<Gallery />
						</div>
						:
						<LoggedOut />
					}
				</main>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
