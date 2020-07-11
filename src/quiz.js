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
	);

	const userId = 1;

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

	$question1.querySelectorAll('.quiz-month').forEach($month => {
		$month.addEventListener('click', e => {
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

	document.querySelectorAll('#questions .card').forEach($card => {
		$card.addEventListener('click', e => {
			e.preventDefault();
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

				getItems('places.get', response => {
					// console.log(response);
					renderQuizList(response);
				}, {
					month: monthValue,
					question2: question2,
					question3: question3,
				});
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	$favoritesBtn.addEventListener('click', () => {
		hide($favoritesBtn);
		show($quizListBtn);
		getItems('favorites.get', response => {
			// console.log(response);
			renderQuizList(response);
		}, {
			user_id: userId,
		});
	});

	$quizListBtn.addEventListener('click', () => {
		hide($quizListBtn);
		show($favoritesBtn);
		getItems('places.get', response => {
			// console.log(response);
			renderQuizList(response);
		}, {
			month: monthValue,
			question2: question2,
			question3: question3,
		});
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
		}).then(result => {
			if (result.value) {
				monthValue = null;
				$question1.classList.remove('animate__fadeOut');
				$question2.classList.remove('animate__fadeOut');
				$question31.classList.remove('animate__fadeOut');
				$question32.classList.remove('animate__fadeOut');
				show($question1);
				hide($resultScreen, $cardsArea); // $stackCardsArea
			}
		});
	});

	const renderQuizList = response => {
		$placesCards.innerHTML = '';
		for (const place of response) {
			const $newPlaceCard = $placeCardTemplate.cloneNode(true);
			$newPlaceCard.removeAttribute('id');
			$newPlaceCard.dataset.id = place.id;
			$newPlaceCard.querySelector('.card-img-top').src = `places/${place.id}/1.webp`;
			$newPlaceCard.querySelector('.country').innerText = place.country;
			$newPlaceCard.querySelector('.place').innerText = place.name;
			$newPlaceCard.querySelector('.description').innerText = place.description;
			$newPlaceCard.querySelector('.season').innerText = place.season_mini_description;
			let classList;
			if (place.season === 1) classList = 'success'; else classList = 'warning';
			$newPlaceCard.querySelector('.season').classList.add(`text-${classList}`);
			const $placeLike = $newPlaceCard.querySelector('.place-like');
			$placeLike.addEventListener('click', e => {
				const placeId = $placeLike.closest('.card').dataset.id;
				if ( ! $placeLike.classList.contains('liked')) {
					console.log('add favorites', placeId);
					$placeLike.classList.add('animate__heartBeat');
					$placeLike.classList.add('liked');
					const handleAnimationEnd = () => {
						$placeLike.removeEventListener('animationend', handleAnimationEnd);
						$placeLike.classList.remove('animate__heartBeat');
						$placeLike.classList.remove('btn-light');
						$placeLike.classList.add('btn-dark');
					};
					$placeLike.addEventListener('animationend', handleAnimationEnd);
					socket.emit('favorites.set', {
						place_id: placeId,
						user_id: userId,
					}, response => {
						console.log(response);
					});
				}
				else {
					console.log('remove favorites', placeId);
					$placeLike.classList.remove('liked');
					$placeLike.classList.add('animate__flip');
					const handleAnimationEnd = () => {
						$placeLike.removeEventListener('animationend', handleAnimationEnd);
						$placeLike.classList.remove('animate__flip');
						$placeLike.classList.remove('btn-dark');
						$placeLike.classList.add('btn-light');
					};
					$placeLike.addEventListener('animationend', handleAnimationEnd);
					socket.emit('favorites.remove', {
						place_id: placeId,
						user_id: userId,
					}, response => {
						console.log(response);
					});
				}
			});
			// place.favorites = 8;
			if (place.favorites) {
				if (place.favorites === parseInt(monthValue)) {
					$placeLike.classList.add('liked');
					$placeLike.classList.add('btn-dark');
				}
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
			$placesCards.appendChild($newPlaceCard);
			show($newPlaceCard);
			// TODO: find another fix for max-height
			/* start fix max-height */
			setTimeout(() => {
				const $childrens = $newPlaceCard.querySelector('.card-img-overlay').children;
				let totalHeight = 0;
				for (let i = 0; i < $childrens.length; i++)
					totalHeight += $childrens[i].offsetHeight;
				$newPlaceCard.querySelector('.card-img-top').style.maxHeight = totalHeight - 25;
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
