Swal = Swal.mixin({
	buttonsStyling: false,
	confirmButtonText: 'Да',
	cancelButtonText: 'Нет',
});

const camelCase = str => {
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
	agrs.forEach($htmlElement => {
		const nameConst = camelCase($htmlElement);
		window[`$${nameConst}`] = document.querySelector($htmlElement);
	});
};

const hide = (...agrs) => {
	agrs.forEach(el => {
		el.classList.add('d-none');
	});
};

const show = (...agrs) => {
	agrs.forEach(el => {
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
	socket.emit(method, data, response => {
		loadingHide();
		console.log(response);
		callback(response.items);
	});
};
