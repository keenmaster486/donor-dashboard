import React, {Component} from 'react';
import './App.css';

import NavBar from './NavBar/NavBar';
import About from './About/About';
import Donations from './Donations/Donations';

// import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


class App extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			apiURL: '',
			apiStatus: '',
			menuOption: 'Donations',
			defaultHeaders: {
				'Content-Type': 'application/json',
				'Cache-Control': 'max-age=0'
			},
			debug: false,
			loggedIn: false,
			email: '',
			password: '',
			createEmail: '',
			createPass: '',
			createPass2: '',
			sessionId: ''
		}
	}

	componentDidMount() {
		this.getApiStatus();
	}

	getApiStatus = async () => {
		const response = await fetch(this.state.apiURL + '/status', {
			'method': 'GET',
			'headers': this.state.defaultHeaders
		});
		const resJson = await response.json();
		this.setState({
			apiStatus: await resJson['status']
		});
	}

	handleChange = (e) =>
	{
		e.preventDefault();
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	// Change the main app state, to be passed to other components for state management
	changeState = (input, e) => {
		this.setState(input);
	}

	onDebug = (e) => {
		this.setState({
			'debug': !!e.target.checked
		});
	}

	onLogout = async () => {
		const response = await fetch(this.state.apiUrl + '/auth/logout', {
			'method': 'POST',
			'headers': this.state.defaultHeaders
		});
		const resJson = await response.json();

		if (resJson.success) {
			this.setState({
				loggedIn: false
			});
		} else {
			if (resJson.message) {
				alert(resJson.message);
			}
		}
	}

	onLogin = async () => {
		const response = await fetch(this.state.apiURL + '/auth/login', {
			'method': 'POST',
			'body':  JSON.stringify({
				'email': this.state.email,
				'password': this.state.password
			}),
			'headers': this.state.defaultHeaders
		});
		const resJson = await response.json();

		if (resJson.success) {
			this.setState({
				loggedIn: true,
				sessionId: resJson.sessionId,
				defaultHeaders: {
					'Content-Type': 'application/json',
					'Cache-Control': 'max-age=0',
					'authentication': resJson.sessionId
				}
			});
			console.log(resJson);
		} else {
			if (resJson.message) {
				alert(resJson.message);
			}
		}
	}

	onCreateAccount = async () => {
		const response = await fetch(this.state.apiURL + '/user', {
			'method': 'POST',
			'body': JSON.stringify({
				'email': this.state.createEmail,
				'password': this.state.createPass,
				'password2': this.state.createPass2
			}),
			'headers': this.state.defaultHeaders
		});

		const resJson = await response.json();

		if (resJson.success) {
			// log in automatically:
			this.setState({
				email: this.state.createEmail,
				password: this.state.createPass
			});
			this.onLogin();
		} else {
			if (resJson.message) {
				alert(resJson.message);
			}
		}
	}


	render() {
		return (
			<div className="App">
				{this.state.loggedIn ?
					<div>
						<NavBar changeState={this.changeState} appState={this.state}></NavBar>
						
						{this.state.menuOption === 'Donations' ?
						<Donations changeState={this.changeState} appState={this.state}></Donations>:null}

						{this.state.menuOption === 'About' ?
						<About changeState={this.changeState} appState={this.state}></About>:null}

						<div align='center' className='footer'>
							Welcome {this.state.email} 
							Api {this.state.apiStatus} 
							<input type="checkbox" onChange={this.onDebug}></input> Debug mode
							<button onClick={this.onLogout}>Log Out</button>
						</div>
					</div>
					:
					<div>
						Log In<br></br>
						<input type="text" name="email" placeholder="Email" onChange={this.handleChange}></input><br></br>
						<input type="password" name="password" placeholder="Password" onChange={this.handleChange}></input><br></br>
						<button onClick={this.onLogin}>Log In</button><br></br>
						<br></br>
						Create Account<br></br>
						<input type="text" name="createEmail" placeholder="Email" onChange={this.handleChange}></input><br></br>
						<input type="password" name="createPass" placeholder="Password" onChange={this.handleChange}></input><br></br>
						<input type="password" name="createPass2" placeholder="Retype Password" onChange={this.handleChange}></input><br></br>
						<button onClick={this.onCreateAccount}>Create Account</button><br></br>
					</div>
				}
			</div>
		);
	}
}

export default App;
