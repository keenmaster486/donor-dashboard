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
			apiURL: 'http://localhost:3001',
			apiStatus: '',
			menuOption: 'Donations',
			defaultHeaders: {
				'Content-Type': 'application/json',
				'Cache-Control': 'max-age=0'
			}
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


	render()
	{
		return (
			<div className="App">
				<NavBar changeState={this.changeState} appState={this.state}></NavBar>
				
				{this.state.menuOption === 'Donations' ?
				<Donations changeState={this.changeState} appState={this.state}></Donations>:null}

				{this.state.menuOption === 'About' ?
				<About changeState={this.changeState} appState={this.state}></About>:null}

				<div align='center' className='footer'>
					Api Status: {this.state.apiStatus}
				</div>
			</div>
		);
	}
}

export default App;
