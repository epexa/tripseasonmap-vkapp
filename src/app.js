const urlParams = new URLSearchParams(window.location.search);
const vkApiVersion = '5.120';

let platformId;

vkBridge.send('VKWebAppInit');

vkBridge.send('VKWebAppGetClientVersion')
		.then((data) => {
			platformId = data.platform;
		});

/* const platformId = urlParams.get('vk_platform'); */

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

let currentScreen = 'questions'; /* eslint prefer-const: 0 */
let monthValue;
let question2;
let question3;

document.addEventListener('DOMContentLoaded', () => {

	initHtmlElements(
		'#welcome',
		'#quiz-page',
		'#quiz-list-btn',
		'#favorites-btn',
		'#select-month',
		'#prev-month',
		'#next-month',
		'#second-filter1',
		'#second-filter2',
		'#third-filter-block',
		'#third-filter1',
		'#third-filter2',
	);

});

document.addEventListener('DOMContentLoaded', () => {

	if (localStorage.runs) localStorage.runs++;
	else localStorage.runs = 1;

	if ( ! localStorage.welcome) {
		localStorage.welcome = 1;
		SwalWelcome = Swal.mixin({
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
		}).then(() => {
			SwalWelcome.fire({
				html: '<h1>Ответьте на <b>три</b> вопроса и сформируйте свой персональный список мест для путешествия!</h1>',
				confirmButtonText: 'Давайте начнём!',
			}).then(() => {
				setTimeout(() => { show($quizPage); }, 1000); // ёбанный баг на айфоне!
			});
		});
	}
	else {
		// console.log(urlParams.get('vk_is_favorite') === '0', localStorage.runs);
		if (urlParams.get('vk_is_favorite') === '0' && localStorage.runs % 2 === 0) {
			Swal.fire({
				title: 'С возвращением!',
				html: 'Вы можете добавить приложение в избранное, чтобы было легче его находить.',
				icon: 'success',
				showCancelButton: true,
				customClass: {
					actions: 'btn-group',
					confirmButton: 'btn btn-success btn-lg',
					cancelButton: 'btn btn-outline-danger btn-lg',
					popup: 'animate__animated animate__fadeIn', // animate__zoomIn
				},
				showCloseButton: true,
				showLoaderOnConfirm: true,
				confirmButtonText: 'Хорошая идея!',
				cancelButtonText: 'Позже',
				grow: 'fullscreen',
				backdrop: '#fff',
				showCloseButton: false,
			}).then((result) => {
				if (result.value) {
					const accessFavorites = () => {
						vkBridge.send('VKWebAppAddToFavorites')
								.then((data) => {
									console.log(data);
									socket.emit('vk-user.set', {
										favorites: 1,
									});
									thanksMessage();
									show($quizPage);
								})
								.catch((error) => {
									console.log(error);
									if (error.error_data.error_code === 4) {
										Swal.fire({
											title: 'Вы уверены?',
											html: 'Очень жаль... Вы не разрешили добавить приложение в избранное :(',
											icon: 'question',
											showCancelButton: true,
											customClass: {
												actions: 'btn-group',
												confirmButton: 'btn btn-success btn-lg',
												cancelButton: 'btn btn-outline-danger btn-lg',
											},
											showCloseButton: true,
											showLoaderOnConfirm: true,
											confirmButtonText: 'Я передумал, разрешаю!',
											cancelButtonText: 'Да',
										}).then((result) => {
											if (result.value) accessFavorites();
											else show($quizPage);
										});
									}
									else showVkError(error);
								});
					};
					accessFavorites();
				}
				else setTimeout(() => { show($quizPage); }, 1000); // ёбанный баг на айфоне!
			});
		}
		else show($quizPage);
	}

	// TODO: find another fix ios viewport
	/* start fix ios viewport */
	const fixIosViewport = () => {
		setTimeout(() => {
			if (platformId) {
				if (platformId === 'ios') { // ios, android, web
					const styleSheet = document.createElement('style');
					styleSheet.type = 'text/css';
					styleSheet.innerText = `
						#quiz-page, #result-screen, .fixed-top {
							/* Высота статус-бара в iOS 10 */
							padding-top: 20px !important;

							/* Высота статус-бара в iOS 11.0 */
							padding-top: constant(safe-area-inset-top) !important;

							/* Высота статус-бара в iOS 11+ */
							padding-top: env(safe-area-inset-top) !important;
						}
					`;
					document.head.appendChild(styleSheet);
				}
			}
			else fixIosViewport();
		}, 100);
	};
	fixIosViewport();
	/* end fix ios viewport */

});

const showVkError = (error) => {
	console.log(error);
	const swalParams = {
		title: 'Упс... Попробуйте ещё раз!',
		html: error.error_data.error_reason.error_msg,
		icon: 'error',
		showCloseButton: true,
		timer: 5000,
		timerProgressBar: true,
		customClass: {
			confirmButton: 'btn btn-success btn-lg',
		},
		confirmButtonText: 'Понятно...',
	};
	if (error.error_data.error_code === 4) {
		swalParams.title = 'Хм... Нужен доступ!';
		swalParams.html = 'Чтобы получить необходимые данные, нужно разрешить доступ!';
		swalParams.icon = 'warning';
	}
	Swal.fire(swalParams);
};

const thanksMessage = () => {
	Swal.fire({
		title: 'Спасибо!',
		icon: 'success',
		showCloseButton: true,
		toast: true,
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
	});
};
