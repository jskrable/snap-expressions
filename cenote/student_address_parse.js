var fs = require('fs');

fs.readFile('Downloads/exe_CUSSP output0.json', 'utf8', function(err, contents) {
    data = JSON.parse(contents);
});


function parseList(data) {
	var info = {};
	var counter = 0;
	data.forEach(row => {
		var name = row['@name'];
		var val = row['@value'];
		if (name in info) {
			name = name + counter;
			counter++;
		} else {
			counter = 0;
		};
		info[name] = val;
	});
	return info;
}

function parsePhones(data) {
	var types = ['local', 'home', 'cell', 'sevis','campus'];
	var phones = [];

	types.forEach(type => {
		var lines = Object.keys(data)
			.filter(x => x.toLowerCase().indexOf(type + 'phone') > -1)
			.map(y => data[y]);

		if (lines[0].length == 3) {
			var number = '(' + lines[0] + ')' + lines[1].replace('/','');
		} else {
			var number = lines.join(' ');
		}
		var phone = {
			'type': type,
			'number': number
		};
		if (phone.number != null && phone.number.trim() != '') {phones.push(phone);};
	});

	return phones;
}

function parseAddresses(data) {
	var types = ['local','home']
	var domRegExp = /([A-Za-z]+)(, )([A-Z]+)( )([0-9]+)/gmi

	var addresses = [];
	types.forEach(type => {
		var lines = Object.keys(data)
			.filter(x => x.toLowerCase().indexOf(type + 'add') > -1)
			.map(y => data[y]);

		//console.log('lines=' + lines)
		var other = lines.pop();
		//console.log('other=' + other)

		if (other.search(domRegExp) > -1) {
			domestic = true;
			other = other.replace(',','').split(' ');
			var city = other[0];
			var state = other[1];
			var postalCode = other[2];
			var country = 'U.S.A.';
		} else {
			var country = other;
		}

		var address = {
			'street': lines.join(' '),
			'city': city,
			'state': state,
			'postalCode': postalCode,
			'country': country
		}
		//console.log('address=' + JSON.stringify(address))

		addresses.push(address);		
	})

	return addresses;

}


var contactInfoList = data.map(x => {
	var response = x['soap-env:Body']['n0:bu_uis_output']['n0:parameters']['n0:param'];
	var infoObj = parseList(response);
	var addresses = parseAddresses(infoObj);
	var phones = parsePhones(infoObj);
	
});