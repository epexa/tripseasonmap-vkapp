const socketShowError = (errorMessage = null) => {
	console.log(errorMessage);
};

// const socket = io.connect('ws://127.0.0.1:8888', {
const socket = io.connect('wss://tripseasonmap.com', {
	reconnection: true,
	reconnectionDelay: 10000,
	timeout: 300000,
});
socket.on('connect_error', () => {
	socketShowError('Connection: <strong>doesn\'t work.</strong>');
});
socket.on('reconnecting', () => {
	socketShowError('Connection: <strong>reconnecting...</strong>');
});
socket.on('connect_timeout', () => {
	socketShowError('Connection: <strong>doesn\'t work... Please reload page!</strong>');
});
socket.on('reconnect', () => {
	socketShowError();
});
socket.on('error', err => {
	err = JSON.parse(err);
	console.log('error', err);
	Swal.fire({
		showCloseButton: true,
		showConfirmButton: false,
		toast: true,
		position: 'top',
		timer: 3000,
		icon: 'error',
		title: err.message,
	});
});

document.addEventListener('DOMContentLoaded', () => {

	initHtmlElements(
		'#welcome',
		'#quiz-page',
	);

});

document.addEventListener('DOMContentLoaded', () => {

	if ( ! localStorage.welcome) {
		localStorage.welcome = 1;
		Swal.fire({
			showCloseButton: true,
			html: $welcome.innerHTML,
			confirmButtonText: 'Отлично! Давайте начнём!',
			width: '50%',
			imageUrl: 'graphics/logo.svg',
			customClass: {
				image: 'w-25',
				confirmButton: 'btn btn-success btn-lg',
			},
		}).then(result => {
			show($quizPage);
		});
	}
	else show($quizPage);

});
