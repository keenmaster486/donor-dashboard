import React, {Component} from 'react';

import './Donations.css';

class Donations extends Component {
	constructor() {
		super();
		this.state = {
			'file': null,
			'donations': [],
			'filterAnon': false
		};
	}

	componentDidMount() {
		this.getDonations();
	}

	getDonations = async () => {
		const response = await fetch(this.props.appState.apiURL + '/donation/all', {
			'method': 'GET',
			'headers': this.props.appState.defaultHeaders
		});
		const resJson = await response.json();
		this.setState({
			donations: await resJson
		});
	}

	onFileChange = (e) => {
		console.log(e.target.files[0]);
		this.setState({
			'file': e.target.files[0]
		});
	}

	onDelete = async () => {
		await fetch(this.props.appState.apiURL + '/donation/deleteAll', {
			'method': 'POST',
			'headers': this.props.appState.defaultHeaders
		});
		this.getDonations();
	}

	onFilterAnon = (e) => {
		this.setState({
			'filterAnon': !!e.target.checked
		});
	}

	onUpload = async () => {
		if (!this.state.file) {
			return;
		}

		const parsedCsv = await this.parseCsv(await this.state.file.text());
		
		const response = await fetch(this.props.appState.apiURL + '/donation/uploadBatch', {
			'method': 'POST',
			'body': await JSON.stringify(parsedCsv),
			'headers': this.props.appState.defaultHeaders
		});

		const resJson = await response.json();

		if (resJson.totalItems) {
			this.setState({
				'uploaded': resJson
			});

			this.getDonations();
		}
	}

	parseCsv = (text) => {
		let rows = text.split('\n');
		const header = rows[0].split(',');
		rows.splice(0, 1);
		rows = rows.map((row) => {
			const cells = row.split(',');
			const object = {};
			for (let i = 0; i < header.length; i++) {
				object[header[i]] = cells[i];
			}
			return object;
		});
		rows = rows.filter((row) => {
			return row[header[0]] && row[header[0]] !== '';
		});
		return rows;
	}

	render() {
		return (
			<div className="donationsContainer">
				<div className="donationsHeader">
					Donations
				</div>
				<div className="sectionRow">
					<div className="statRow">
						Total Donation Value: {this.state.donations.reduce((total, current) => {return total + current.amount;}, 0)}
					</div>
				</div>
				<div className="sectionRow">
					<div>CSV file uploader</div>
					<input type="file" onChange={this.onFileChange}></input><br></br>
					<button onClick={this.onUpload}>Upload this file</button>
				</div>
				{this.props.appState.debug ?
					<div className="sectionRow">
						<button onClick={this.onDelete}>Delete all donation records (debug)</button>
					</div>:null
				}
				<div className="sectionRow">
					<input type="checkbox" onChange={this.onFilterAnon}></input> Filter anonymous donors
				</div>
				{this.state.uploaded ?
					<div className="sectionRow afterUpload">
						CSV successfully uploaded. Stats from this file:
						<div className="statRow">
							Total Items: {this.state.uploaded.totalItems}
						</div>
						<div className="statRow">
							Total Value: {this.state.uploaded.totalValue}
						</div>
						<div className="statRow">
							Percentage anonymous donors: {this.state.uploaded.percentageAnon}%
						</div>
					</div>:null
				}
				<div className="donationsTableContainer">
					<table border="1" className="donationsTable">
						<thead>
							<tr>
								<td className="rowLabel"></td>
								<td>Donor ID</td>
								<td>Donor Name</td>
								<td>Donor Email</td>
								<td>Donor Gender</td>
								<td>Donor Address</td>
								<td>Donation Amount</td>
							</tr>
						</thead>
						<tbody>
							{this.state.donations ?
								this.state.donations.filter((item) => {
									return !this.state.filterAnon || !!item.name;
								}).map((item, index) => {
									return (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{item.id}</td>
											<td>{item.name || 'Anonymous'}</td>
											<td>{item.email || 'Anonymous'}</td>
											<td>{item.gender || 'Anonymous'}</td>
											<td>{item.address || 'Anonymous'}</td>
											<td>${item.amount}</td>
										</tr>
									);
								}):null
							}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Donations;