Swal = Swal.mixin({
	buttonsStyling: false,
	confirmButtonText: 'Да',
	cancelButtonText: 'Нет',
	focusConfirm: false,
});

const camelCase = (str) => {
	str = str.replace(/[=\[\]"]/g, ' ').replace(/  +/g, ' ').replace(/[#\.]/g, '');
	str = str.replace(/-([a-z])/g, (_m, l) => {
		return l.toUpperCase();
	});
	return str.replace(/ ([a-z])/g, (_m, l) => {
		return l.toUpperCase();
	});
};

const initHtmlElements = (...agrs) => {
	/* document.addEventListener('DOMContentLoaded', () => {
	}); */
	agrs.forEach(($htmlElement) => {
		const nameConst = camelCase($htmlElement);
		window[`$${nameConst}`] = document.querySelector($htmlElement);
	});
};

const hide = (...agrs) => {
	agrs.forEach((el) => {
		el.classList.add('d-none');
	});
};

const show = (...agrs) => {
	agrs.forEach((el) => {
		el.classList.remove('d-none');
	});
};

const $loader = document.getElementById('loader');
const loadingShow = () => {
	$loader.style.display = 'block';
};
const loadingHide = () => {
	$loader.style.display = 'none';
};

const getItems = (method, callback, data = {}) => {
	loadingShow();
	const loadingHideTimerId = setTimeout(() => {
		loadingHide();
	}, 5000);
	socket.emit(method, data, (response) => {
		loadingHide();
		clearTimeout(loadingHideTimerId);
		console.log(response);
		callback(response);
	});
};
