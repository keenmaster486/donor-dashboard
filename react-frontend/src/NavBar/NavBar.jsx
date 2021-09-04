import React, {Component} from 'react';

import './NavBar.css';

class NavBar extends Component {
	constructor() {
		super();
		this.state = {
			// nothing here yet
		};
	}

	onDonationsClick = (value) => {
		this.props.changeState({
			'menuOption': 'Donations'
		});
	}

	onAboutClick = (value) => {
		this.props.changeState({
			'menuOption': 'About'
		});
	}

	render() {
		return (
			<div className="navBarContainer">
				<span className="navBarTitle">Donor Dashboard</span>
				<div className="menuItem" onClick={this.onDonationsClick}>Donations</div>
				<div className="menuItem" onClick={this.onAboutClick}>About</div>
			</div>
		);
	}
}

export default NavBar;