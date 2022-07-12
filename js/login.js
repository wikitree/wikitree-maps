// modified from the examples at wikitree-api and wikitree-dynamic tree

$(document).ready(() => {
	// get URL of app to return to after logging in
	$('#returnURL').val(window.location.href);

	// read cookie values
	const userName = readCookie('WikiTreeAPI_userName');
	const userId = readCookie('WikiTreeAPI_userId');

	// get authcode if there is one
	const u = new URLSearchParams(window.location.search);
	const authcode = u.get('authcode');

	if (typeof userName != 'undefined' && userName != null && userName != '') {
		// user is logged in
		$('#logged-out').hide();
		$('#logged-in').show();
		$('#logged-in-id').text(userName);
	} else if (typeof authcode != 'undefined' && authcode != null && authcode != '') {
		// we need to confirm the authcode
		$.ajax({
			url: 'https://api.wikitree.com/api.php',
			xhrFields: { withCredentials: true },
			type: 'POST',
			dataType: 'json',
			data: { action: 'clientLogin', authcode: authcode }
		}).done((data) => {
			if (data.clientLogin.result == 'Success') {
				// set cookies
				setCookie('WikiTreeAPI_userName', data.clientLogin.username, { path: '/' });
				setCookie('WikiTreeAPI_userId', data.clientLogin.userid, { path: '/' });
				const urlPieces = [ location.protocol, '//', location.host, location.pathname ];
				const url = urlPieces.join('');
				window.location = url;
			} else {
				// the login failed
				console.log('Login failed.');
			}
		});
	}
});

function setCookie(key, value, options) {
	if (options === undefined) {
		options = {};
	}

	if (value === null) {
		options.expires = -1;
	}
	if (typeof options.expires === 'number') {
		const days = options.expires;
		options.expires = new Date();
		options.expires.setDate(options.expires.getDate() + days);
	}
	value = String(value);
	return (document.cookie = [
		encodeURIComponent(key),
		'=',
		value,
		options.expires ? '; expires=' + options.expires.toUTCString() : '',
		options.path ? '; path=' + options.path : '',
		options.domain ? '; domain=' + options.domain : '',
		options.secure ? '; secure' : ''
	].join(''));
}

function readCookie(key) {
	const cookies = document.cookie.split('; ');

	let result = key ? null : {};

	for (let i = 0, l = cookies.length; i < l; i++) {
		const parts = cookies[i].split('=');
		let name = parts.shift();
		name = decodeURIComponent(name.replace(/\+/g, ' '));
		let value = parts.join('=');
		value = decodeURIComponent(value.replace(/\+/g, ' '));

		if (key && key === name) {
			result = value;
			break;
		}
		if (!key) {
			result[name] = value;
		}
	}
	return result;
}

// does a getProfile for the logged in user to test that the login worked
function testLogin() {
	const userName = readCookie('WikiTreeAPI_userName');

	if (userName) {
		$.ajax({
			url: 'https://api.wikitree.com/api.php',
			xhrFields: { withCredentials: true },
			type: 'POST',
			dataType: 'json',
			data: {
				action: 'getProfile',
				key: userName
			}
		}).then((data) => {
			console.log(data);
		});
	} else {
		console.log('Not logged in.');
	}
}
