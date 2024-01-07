import React, {Component} from 'react';
import _ from "lodash";
import {Link} from "react-router-dom";

const asyncComponent = (importComponent,config={}) => {
	return class extends Component {
		state = {
			component: null
		}

		componentDidMount() {
			importComponent()
				.then(cmp => {
					this.setState({component: cmp.default});
				});
		}

		render() {
			const C = this.state.component;
			return C ? <C {...this.props} {...config}/> : null;
		}
	}
};


const contains = (a, obj) => {
	let i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}



const withAnyRoles = (config, module = undefined, needSuper = false) => {
	if (config.isSuper) {
		return true;
	} else if (needSuper) {
		return false;
	} else if (module) {
		return _.includes(config.modules, module);
	} else {
		return true;
	}
}


const withModule = (config, module = undefined, needSuper = false) => {
	if (config.isSuper) {
		return true;
	} else if (needSuper) {
		return false;
	} else if (module) {
		return _.includes(config.modules, module);
	} else {
		return true;
	}
}

const CheckMobile = (number) => {
	if (number.length === 10) {
		if (isNaN(parseInt(number))) {
			return "Not Defined"
		} else {
			return number
		}
	} else {
		return "Not Defined"
	}


}


const StringToJson = (r, cb) => {
	let list = r.split(`\n`);
	let baseData = [];
	let line1 = list[0].split(",");
	for (let i = 1; i < list.length; i++) {
		let line2 = list[i].split(",");
		if(list[i]===""){
			continue;
		}
		let obj = {};
		for (let j = 0; j < line2.length; j++) {
			obj[line1[j]] = line2[j];
		}
		baseData.push(obj);
	}

	cb(baseData);
}

function splitCSVButIgnoreCommasInDoublequotes(str) {
	//split the str first
	//then merge the elments between two double quotes
	var delimiter = ',';
	var quotes = '"';
	var elements = str.split(delimiter);
	var newElements = [];
	for (var i = 0; i < elements.length; ++i) {
		if (elements[i].indexOf(quotes) >= 0) {//the left double quotes is found
			var indexOfRightQuotes = -1;
			var tmp = elements[i];
			//find the right double quotes
			for (var j = i + 1; j < elements.length; ++j) {
				if (elements[j].indexOf(quotes) >= 0) {
					indexOfRightQuotes = j;
					break;
				}
			}
			//found the right double quotes
			//merge all the elements between double quotes
			if (-1 !== indexOfRightQuotes) {
				for (let j = i + 1; j <= indexOfRightQuotes; ++j) {
					tmp = tmp + delimiter + elements[j];
				}
				newElements.push(tmp);
				i = indexOfRightQuotes;
			}
			else { //right double quotes is not found
				newElements.push(elements[i]);
			}
		}
		else {//no left double quotes is found
			newElements.push(elements[i]);
		}
	}

	return newElements;
}

const parseJson = data => {
	let parse = data.data;
	let lines = parse.split("\n");
	let newData = [];
	let headers =[];
	for(var i =0;i<lines.length-1;i++){
		if(i===0){
			headers = mapHeaders(lines[i]);
		}else{
			let line = lines[i];
			let split = line.split("|");
			let item = {};
			for(var a = 0;a<split.length;a++){
				let lineData = split[a];
				let header = headers[a];
				item[header.key] = getValue(header.type,lineData);
			}
			newData.push(item);
		}
	}
	data.data = newData;
	return data;
}

const getValue = (header,value) => {
	if(header==="number"){
		return  parseInt(value,10);
	}else if(header==="double"){
		return parseFloat(value,10);
	}else if(header==="bool"){
		return value === "true";
	}else if(header==="owner"){
		let owner = {};
		let values = value.split(">");
		if(values.length<4){
			owner.ownerId = values[0];
			owner.ownerType = values[1];
			owner.ownerName = values[2];
		}else{
			owner.officeName = values[0];
			owner.departmentName = values[1];
			owner.gradeName = values[2];
			owner.ownerEmail = values[3];
			owner.ownerId = values[4];
			owner.ownerType = values[5];
			owner.ownerName = values[6];
		}
		return owner;
	}
	return value;
}

const mapHeaders = (header) => {
	let headers = [];
	let allHeaders = header.split('|');
	for(var i =0;i<allHeaders.length;i++){
		let item = allHeaders[i];
		let split = item.split("@");
		headers.push({
			key:split[0],
			type:split[1]
		})
	}
	return headers;
}


const SortExpenses = (a, b) => {
	return b.date - a.date;
}


const TEXTCOLOR = "#232323";

const TransactionUtils = item => {
	if (item.transactionType === "WALLETPAID") {
		return (
			<p className="bottom">
				Booked by <Link
				to={`/app/organisation/${item.owner.ownerType.toLowerCase()}/${item.owner.ownerId}`}>{item.owner.ownerName}</Link> through
				Eka(Company Wallet)
			</p>
		)
	}
	else if (item.transactionType === "COMPANYPAID") {
		return (
			<p className="bottom">
				Booked by <Link
				to={`/app/organisation/${item.owner.ownerType.toLowerCase()}/${item.owner.ownerId}`}>{item.owner.ownerName}</Link> through
				External System(Company Mis Paid)
			</p>
		)
	}
	else if (item.transactionType === "PETTYPAID") {
		return (
			<p className="bottom">
				Done through advance payment by <Link
				to={`/app/organisation/${item.owner.ownerType.toLowerCase()}/${item.owner.ownerId}`}>{item.owner.ownerName}</Link>
			</p>
		)
	} else if (item.transactionType === "QRPAID") {
		return (
			<p className="bottom">
				Done through Dice QR by <Link
				to={`/app/organisation/${item.owner.ownerType.toLowerCase()}/${item.owner.ownerId}`}>{item.owner.ownerName}</Link>
			</p>
		)
	}
	else if (item.transactionType === "SELFPAID") {
		return (

			<p className="bottom">
				Paid by <Link
				to={`/app/organisation/${item.owner.ownerType.toLowerCase()}/${item.owner.ownerId}`}>{item.owner.ownerName}</Link>
			</p>

		)
	}
	else if (item.transactionType === "TRANSFER") {
		return (
			<p className="bottom">
				Transfer through Dice
			</p>
		)
	} else if (item.transactionType === "REFUND") {
		return (
			<p className="bottom">
				Refunded against booking #{item.refundId}
			</p>
		)
	}
}

export {
	parseJson,SortExpenses,TEXTCOLOR,TransactionUtils,
	asyncComponent,contains,withAnyRoles,withModule,CheckMobile, StringToJson , splitCSVButIgnoreCommasInDoublequotes
};
