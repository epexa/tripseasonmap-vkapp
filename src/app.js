const socketShowError = (errorMessage = null) => {
	console.log(errorMessage);
};

// const socket = io.connect('ws://127.0.0.1:8888', {
const socket = io.connect('wss://api.tripseasonmap.com', {
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
socket.on('error', (err) => {
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
		SwalWelcome = Swal.mixin({
			width: '50%',
			imageUrl: 'graphics/logo.svg',
			customClass: {
				image: 'w-50',
				confirmButton: 'btn btn-success btn-lg',
			},
			showClass: {
				popup: 'animate__animated animate__fadeIn', // animate__zoomIn
			},
			grow: 'fullscreen',
			backdrop: '#fff',
		});
		SwalWelcome.fire({
			html: $welcome.innerHTML,
			confirmButtonText: 'Отлично!',
		}).then((result) => {
			SwalWelcome.fire({
				html: '<h1>Ответьте на <b>три</b> вопроса и сформируйте свой персональный список мест для путешествия!</h1>',
				confirmButtonText: 'Давайте начнём!',
			}).then((result) => {
				show($quizPage);
			});
		});
	}
	else show($quizPage);

});
