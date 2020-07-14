document.addEventListener('DOMContentLoaded', () => {

	initHtmlElements(
		'#question1',
		'#question2',
		'#question31',
		'#question32',
		'#result-screen',
		'#cards-area',
		'#place-card-template',
		'#places-cards',
		'#stack-places-cards',
		'#stack-place-card-template',
		'#stack-cards-area',
		'#favorites-btn',
		'#quiz-list-btn',
		'#no-places-results',
		'#no-favorites-results',
	);

	/* const stack = swing.Stack({
		allowedDirections: [ swing.Direction.LEFT, swing.Direction.RIGHT ],
	});
	stack.on('throwout', e => {
		e.target.classList.remove('in-deck');
		if (e.throwDirection === swing.Direction.RIGHT) {
			console.log('like');
		}
		else if (e.throwDirection === swing.Direction.LEFT) {
			console.log('dislike');
		}
	}); */

	let monthValue;

	$question1.querySelectorAll('.quiz-month').forEach(($month) => {
		$month.addEventListener('click', (e) => {
			e.preventDefault();
			monthValue = $month.dataset.id;
			$question1.classList.add('animate__fadeOut');
			const handleAnimationEnd = () => {
				$question1.removeEventListener('animationend', handleAnimationEnd);
				hide($question1);
				show($question2);
			};
			$question1.addEventListener('animationend', handleAnimationEnd);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	let question2;
	let question3;

	let isFavorites = false;

	let placesLoaded = false;

	document.querySelectorAll('#questions .card').forEach(($card) => {
		$card.addEventListener('click', (e) => {
			e.preventDefault();
			if (placesLoaded) return;
			const answerId = parseInt($card.dataset.id);
			if (answerId === 1 || answerId === 2) {
				$question2.classList.add('animate__fadeOut');
				const handleAnimationEnd = () => {
					$question2.removeEventListener('animationend', handleAnimationEnd);
					hide($question2);
					if (answerId === 1) show($question31);
					else show($question32);
				};
				$question2.addEventListener('animationend', handleAnimationEnd);
				question2 = answerId;
			}
			if (answerId >= 3 && answerId <= 6) {
				$question31.classList.add('animate__fadeOut');
				$question32.classList.add('animate__fadeOut');
				const handleAnimationEnd = () => {
					$question31.removeEventListener('animationend', handleAnimationEnd);
					$question32.removeEventListener('animationend', handleAnimationEnd);
					hide($question31, $question32);
					show($resultScreen, $cardsArea); // $stackCardsArea
				};
				$question31.addEventListener('animationend', handleAnimationEnd);
				$question32.addEventListener('animationend', handleAnimationEnd);

				if (answerId === 3 || answerId === 5) question3 = 1; else question3 = 2;

				getPlaces();
				placesLoaded = true;
				setTimeout(() => { placesLoaded = false; }, 2000);
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	$favoritesBtn.addEventListener('click', () => {
		hide($favoritesBtn, $noPlacesResults);
		show($quizListBtn);
		$placesCards.innerHTML = '';
		isFavorites = true;
		getItems('favorites.get', (response) => {
			// console.log(response);
			if (response.items && response.items.length) {
				hide($noFavoritesResults);
				renderQuizList(response.items);
			}
			else show($noFavoritesResults);
		}, {
			url: window.location.href,
		});
	});

	const getPlaces = () => {
		$placesCards.innerHTML = '';
		isFavorites = false;
		getItems('places.get', (response) => {
			// console.log(response);
			if (response.items && response.items.length) {
				hide($noPlacesResults);
				renderQuizList(response.items);
			}
			else show($noPlacesResults);
		}, {
			month: monthValue,
			question2: question2,
			question3: question3,
			url: window.location.href,
		});
	};

	$quizListBtn.addEventListener('click', () => {
		hide($quizListBtn, $noFavoritesResults);
		show($favoritesBtn);
		getPlaces();
	});

	document.querySelector('#quiz-restart').addEventListener('click', () => {
		Swal.fire({
			title: 'Начать сначала',
			html: 'Вы уверены, что хотите начать сначала?',
			icon: 'question',
			showCancelButton: true,
			customClass: {
				actions: 'btn-group',
				confirmButton: 'btn btn-success btn-lg',
				cancelButton: 'btn btn-outline-danger btn-lg',
			},
			showCloseButton: true,
			showLoaderOnConfirm: true,
		}).then((result) => {
			if (result.value) {
				monthValue = null;
				$question1.classList.remove('animate__fadeOut');
				$question2.classList.remove('animate__fadeOut');
				$question31.classList.remove('animate__fadeOut');
				$question32.classList.remove('animate__fadeOut');
				show($question1);
				hide($resultScreen, $cardsArea); // $stackCardsArea
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});
	});

	// TODO: find another fix for card width
	/* start fix card width */
	const setCardsWidth = () => {
		setTimeout(() => {
			const screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
			if (screenWidth > 0) {
				const styleSheet = document.createElement('style');
				styleSheet.type = 'text/css';
				styleSheet.innerText = `#cards-area .card img { width: ${screenWidth}px !important; }`;
				document.head.appendChild(styleSheet);
			}
			else setCardsWidth();
		}, 100);
	};
	setCardsWidth();
	/* end fix card width */

	const renderQuizList = (response) => {
		for (const place of response) {
			const $newPlaceCard = $placeCardTemplate.cloneNode(true);
			$newPlaceCard.removeAttribute('id');
			$newPlaceCard.dataset.id = place.id;
			$newPlaceCard.querySelector('source').srcset = `places/${place.id}/1.webp`;
			$newPlaceCard.querySelector('img').src = `places/${place.id}/1.jpg`;
			$newPlaceCard.querySelector('.country').innerText = place.country;
			$newPlaceCard.querySelector('.place').innerText = place.name;
			$newPlaceCard.querySelector('.description').innerText = place.description;
			$newPlaceCard.querySelector('.season').innerText = place.season_mini_description;
			let classList;
			if (place.season === 1) classList = 'success'; else classList = 'warning';
			$newPlaceCard.querySelector('.season').classList.add(`text-${classList}`);
			const $placeLike = $newPlaceCard.querySelector('.place-like');
			$placeLike.addEventListener('click', (e) => {
				const placeId = $placeLike.closest('.card').dataset.id;
				const favoriteMonth = $placeLike.dataset.month;
				if ( ! $placeLike.classList.contains('liked')) {
					// console.log('add favorites', placeId);
					$placeLike.classList.add('animate__heartBeat');
					$placeLike.classList.add('liked');
					const handleAnimationEnd = () => {
						$placeLike.removeEventListener('animationend', handleAnimationEnd);
						$placeLike.classList.remove('animate__heartBeat');
						$placeLike.classList.remove('text-secondary');
						$placeLike.classList.add('text-danger');
					};
					$placeLike.addEventListener('animationend', handleAnimationEnd);
					socket.emit('favorites.set', {
						place_id: placeId,
						month: favoriteMonth,
						url: window.location.href,
					}, (response) => {
						// console.log(response);
					});
				}
				else {
					// console.log('remove favorites', placeId);
					$placeLike.classList.remove('liked');
					$placeLike.classList.add('animate__flip');
					const handleAnimationEnd = () => {
						$placeLike.removeEventListener('animationend', handleAnimationEnd);
						$placeLike.classList.remove('animate__flip');
						$placeLike.classList.remove('text-danger');
						$placeLike.classList.add('text-secondary');
					};
					$placeLike.addEventListener('animationend', handleAnimationEnd);
					socket.emit('favorites.remove', {
						place_id: placeId,
						month: favoriteMonth,
						url: window.location.href,
					}, (response) => {
						// console.log(response);
					});
				}
			});
			// place.favorites = 8;
			if (place.favorites) {
				$placeLike.dataset.month = place.favorites;
				if (isFavorites || place.favorites === parseInt(monthValue)) {
					$placeLike.classList.add('liked');
					$placeLike.classList.remove('text-secondary');
					$placeLike.classList.add('text-danger');
				}
				if (isFavorites) {
					const $favoritesMonth = $newPlaceCard.querySelector('.month');
					let monthText;
					switch (place.favorites) {
						case 1: monthText = 'январе'; break;
						case 2: monthText = 'феврале'; break;
						case 3: monthText = 'марте'; break;
						case 4: monthText = 'апреле'; break;
						case 5: monthText = 'мае'; break;
						case 6: monthText = 'июне'; break;
						case 7: monthText = 'июле'; break;
						case 8: monthText = 'августе'; break;
						case 9: monthText = 'сентябре'; break;
						case 10: monthText = 'октярбре'; break;
						case 11: monthText = 'ноябре'; break;
						case 12: monthText = 'декабе'; break;
					}
					$favoritesMonth.innerText = `В ${monthText}`;
					show($favoritesMonth);
				}
			}
			else $placeLike.dataset.month = monthValue;
			$placesCards.appendChild($newPlaceCard);
			show($newPlaceCard);
			// TODO: find another fix for max-height
			/* start fix max-height */
			setTimeout(() => {
				const $childrens = $newPlaceCard.querySelector('.card-img-overlay').children;
				let totalHeight = 0;
				for (let i = 0; i < $childrens.length; i++)
					totalHeight += $childrens[i].offsetHeight;
				$newPlaceCard.querySelector('.card-img-top').style.height = `${totalHeight - 25}px`;
			}, 1000);
			/* end fix max-height */
			/* const $newStackPlaceCard = $stackPlaceCardTemplate.cloneNode(true);
			$newStackPlaceCard.removeAttribute('id');
			$newStackPlaceCard.querySelector('.card-img-top').src = `places/${place.id}/1.webp`;
			$newStackPlaceCard.querySelector('.country').innerText = place.country;
			$newStackPlaceCard.querySelector('.place').innerText = place.name;
			$newStackPlaceCard.querySelector('.description').innerText = place.description;
			$newStackPlaceCard.querySelector('.season').innerText = place.season_mini_description;
			$stackPlacesCards.appendChild($newStackPlaceCard);
			show($newStackPlaceCard);
			stack.createCard($newStackPlaceCard); */

		};
	};

	/* const getLastStackCard = () => {
		let lastStackCard;
		const $stackCards = $stackPlacesCards.querySelectorAll('.card.in-deck');
		const $lastCard = $stackCards[$stackCards.length - 1];
		if ($lastCard) lastStackCard = stack.getCard($lastCard);
		return lastStackCard;
	};

	document.querySelector('#stack-like').addEventListener('click', () => {
		const lastStackCard = getLastStackCard();
		lastStackCard.throwOut(1, 0);
	});

	document.querySelector('#stack-dislike').addEventListener('click', () => {
		const lastStackCard = getLastStackCard();
		lastStackCard.throwOut(-1, 0);
	}); */

});
