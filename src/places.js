const throttlingTimer = 300; // 2000

let placesLoaded = false;
let isFavorites = false;
let requestTimeoutStarted = false;

document.addEventListener('DOMContentLoaded', () => {

	initHtmlElements(
		'#lightgallery',
		'#place-card-template',
		'#places-cards',
		'#stack-places-cards',
		'#stack-place-card-template',
		'#stack-cards-area',
		'#filter-form',
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

	$favoritesBtn.addEventListener('click', () => {
		isFavorites = true;
		currentScreen = 'favorites';
		hide($favoritesBtn, $noPlacesResults, $filterForm);
		show($quizListBtn);
		$cardsArea.style.marginTop = '65px';
		$placesCards.innerHTML = '';
		$placesCards.classList.add('favorites');
		const requestTimeout = () => {
			if ( ! placesLoaded) {
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
				placesLoaded = true;
				setTimeout(() => { placesLoaded = false; }, throttlingTimer);
			}
			else if ( ! requestTimeoutStarted) {
				requestTimeoutStarted = true;
				setTimeout(() => {
					requestTimeoutStarted = false;
					requestTimeout();
				}, throttlingTimer);
			}
		};
		requestTimeout();
	});

	$quizListBtn.addEventListener('click', () => {
		currentScreen = 'main';
		hide($quizListBtn, $noFavoritesResults);
		show($favoritesBtn, $filterForm);
		$cardsArea.style.marginTop = null;
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
			onOpen: (toast) => {
				toast.querySelector('.swal2-confirm').blur();
				toast.querySelector('.swal2-close').blur();
			},
		}).then((result) => {
			if (result.value) {
				currentScreen = 'questions';
				monthValue = null;
				// $question2.classList.remove('animate__fadeOut');
				// $question31.classList.remove('animate__fadeOut');
				// $question32.classList.remove('animate__fadeOut');
				hide($resultScreen, $noPlacesResults, $noFavoritesResults, $cardsArea, $question31First, $question31Second, $question31Third, $question32First, $question32Second, $question32Third, $question2, $question31, $question32, $quizListBtn); // $stackCardsArea
				show($question1First, $question1Second, $question1Third, $quizMonthArea, $favoritesBtn, $filterForm);
				setTimeout(() => { show($quizPage); }, 1000); // ёбанный баг на айфоне!
				isFavorites = false;
				$placesCards.classList.remove('favorites');
				$cardsArea.style.marginTop = null;
				initQuiz();
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

	/* start only web, not mVK */
	const screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
	if (screenHeight > 1000) {
		$lightgallery.addEventListener('onSlideClick', () => {
			window.lgData[$lightgallery.getAttribute('lg-uid')].goToNextSlide();
		});
	}
	/* end only web, not mVK */
	$lightgallery.addEventListener('onBeforeOpen', () => {
		document.querySelector('html').style.overflowY = 'hidden';
	});
	$lightgallery.addEventListener('onCloseAfter', () => {
		window.lgData[$lightgallery.getAttribute('lg-uid')].destroy(true);
		lightgalleryOptions.dynamicEl = [];
		document.querySelector('html').style.overflowY = null;
	});

	$selectMonth.addEventListener('change', () => {
		if ($selectMonth.selectedIndex > 0) $prevMonth.removeAttribute('disabled');
		else $prevMonth.setAttribute('disabled', '');
		if ($selectMonth.selectedIndex < 11) $nextMonth.removeAttribute('disabled');
		else $nextMonth.setAttribute('disabled', '');
		if ( ! placesLoaded) {
			if (monthValue !== $selectMonth.value) {
				monthValue = $selectMonth.value;
				getPlaces();
			}
			placesLoaded = true;
			setTimeout(() => { placesLoaded = false; }, throttlingTimer);
		}
		else if ( ! requestTimeoutStarted) {
			requestTimeoutStarted = true;
			setTimeout(() => {
				requestTimeoutStarted = false;
				trigger($selectMonth, 'change');
			}, throttlingTimer);
		}
	});

	$prevMonth.addEventListener('click', () => {
		if ($selectMonth.selectedIndex > 0) {
			$selectMonth.selectedIndex--;
			trigger($selectMonth, 'change');
		}
	});

	$nextMonth.addEventListener('click', () => {
		if ($selectMonth.selectedIndex < 11) {
			$selectMonth.selectedIndex++;
			trigger($selectMonth, 'change');
		}
	});

	$secondFilter1.addEventListener('click', () => {
		if ( ! $secondFilter1.classList.contains('active')) {
			$secondFilter2.classList.remove('active');
			$secondFilter1.classList.add('active');
			$thirdFilter1.innerText = 'Горы и водопады';
			$thirdFilter2.innerText = 'Океан и море';
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question2 !== 1) {
						question2 = 1;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, throttlingTimer);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, throttlingTimer);
				}
			};
			requestTimeout();
		}
	});
	$secondFilter2.addEventListener('click', () => {
		if ( ! $secondFilter2.classList.contains('active')) {
			$secondFilter1.classList.remove('active');
			$secondFilter2.classList.add('active');
			$thirdFilter1.innerText = 'Старинные';
			$thirdFilter2.innerText = 'Современные';
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question2 !== 2) {
						question2 = 2;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, throttlingTimer);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, throttlingTimer);
				}
			};
			requestTimeout();
		}
	});

	$thirdFilter1.addEventListener('click', () => {
		if ( ! $thirdFilter1.classList.contains('active')) {
			$thirdFilter2.classList.remove('active');
			$thirdFilter1.classList.add('active');
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question3 !== 1) {
						question3 = 1;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, throttlingTimer);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, throttlingTimer);
				}
			};
			requestTimeout();
		}
	});
	$thirdFilter2.addEventListener('click', () => {
		if ( ! $thirdFilter2.classList.contains('active')) {
			$thirdFilter1.classList.remove('active');
			$thirdFilter2.classList.add('active');
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question3 !== 2) {
						question3 = 2;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, throttlingTimer);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, throttlingTimer);
				}
			};
			requestTimeout();
		}
	});

	if (urlParams.get('vk_are_notifications_enabled') === '0' && ! localStorage.notificationsAsk) {
		const handleScroll = () => {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				// console.log('bottom', currentScreen, urlParams.get('vk_are_notifications_enabled') === '0');
				if (currentScreen === 'main') {
					window.removeEventListener('scroll', handleScroll);
					Swal.fire({
						html: 'Мы постоянно обновляем приложение и добавляем новые места! Разрешите уведомления, и мы будем вам сообщать об обновлениях и о наших новостях раз в неделю!',
						confirmButtonText: 'Конечно!',
						icon: 'warning',
						customClass: {
							confirmButton: 'btn btn-success btn-lg',
						},
						onOpen: (toast) => {
							toast.querySelector('.swal2-confirm').blur();
						},
					}).then(() => {
						const accessNotifications = () => {
							vkBridge.send('VKWebAppAllowNotifications')
									.then((data) => {
										console.log(data);
										socket.emit('vk-user.set', {
											notifications: 1,
										});
										thanksMessage();
										delete localStorage.notificationsAsk;
									})
									.catch((error) => {
										console.log(error);
										if (error.error_data.error_code === 4) {
											Swal.fire({
												title: 'Вы уверены?',
												html: 'Очень жаль... Вы не разрешили уведомления :(',
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
												onOpen: (toast) => {
													toast.querySelector('.swal2-confirm').blur();
													toast.querySelector('.swal2-close').blur();
												},
											}).then((result) => {
												if (result.value) accessNotifications();
												else localStorage.notificationsAsk = 0;
											});
										}
										else showVkError(error);
									});
						};
						accessNotifications();
					});
				}
			};
		};
		window.addEventListener('scroll', handleScroll);
	}

	/* getAccessToken = (scope, callback) => {
		vkBridge.send('VKWebAppGetAuthToken', { app_id: 7535937, scope: scope })
				.then((data) => {
					console.log(data);
					callback(data, null);
				})
				.catch((error) => {
					showVkError(error);
					callback(null, error);
				});
	};

	const getAppUsers = (callback) => {
		if (localStorage.access_token_friends) {
			vkBridge.send('VKWebAppCallAPIMethod', {
				method: 'friends.getAppUsers',
				params: {
					v: vkApiVersion,
					access_token: localStorage.access_token_friends,
				},
			})
					.then((data) => {
						callback(data, null);
					})
					.catch((error) => {
						delete localStorage.access_token_friends;
						if (error.error_data.error_reason.error_code === 5) getAppUsers(callback);
						else {
							showVkError(error);
							callback(null, error);
						}
					});
		}
		else {
			console.log('need access_token');
			getAccessToken('friends', (accessToken, err) => {
				if ( ! err) {
					console.log(accessToken);
					localStorage.access_token_friends = accessToken.access_token;
					getAppUsers(callback);
				}
			});
		}
	};

	getAppUsers((result, error) => {
		console.log(result, error);
	}); */

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

const lightgalleryOptions = {
	hideBarsDelay: 1000,
	getCaptionFromTitleOrAlt: false,
	preload: 10,
	showAfterLoad: false,
	download: false,
	actualSize: false,
	// autoplay: true,
	pause: 2000,
	dynamic: true,
	dynamicEl: [],
};

const showImages = (images) => {
	if (platformId === 'ios' || platformId === 'android') {
		vkBridge.send('VKWebAppShowImages', {
			images: images,
		});
	}
	else {
		for (const image of images) {
			lightgalleryOptions.dynamicEl.push({
				src: image,
			});
		}
		lightGallery($lightgallery, lightgalleryOptions);
	}
};

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

		const $placeLikeBtn = $newPlaceCard.querySelector('.place-like');
		$placeLikeBtn.addEventListener('click', () => {
			const placeId = $placeLikeBtn.closest('.card').dataset.id;
			const favoriteMonth = $placeLikeBtn.dataset.month;
			if ( ! $placeLikeBtn.classList.contains('liked')) {
				// console.log('add favorites', placeId);
				$placeLikeBtn.classList.add('animate__heartBeat');
				$placeLikeBtn.classList.add('liked');
				const handleAnimationEnd = () => {
					$placeLikeBtn.removeEventListener('animationend', handleAnimationEnd);
					$placeLikeBtn.classList.remove('animate__heartBeat');
					$placeLikeBtn.classList.remove('text-secondary');
					$placeLikeBtn.classList.add('text-danger');
				};
				$placeLikeBtn.addEventListener('animationend', handleAnimationEnd);
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
				$placeLikeBtn.classList.remove('liked');
				$placeLikeBtn.classList.add('animate__flip');
				const handleAnimationEnd = () => {
					$placeLikeBtn.removeEventListener('animationend', handleAnimationEnd);
					$placeLikeBtn.classList.remove('animate__flip');
					$placeLikeBtn.classList.remove('text-danger');
					$placeLikeBtn.classList.add('text-secondary');
				};
				$placeLikeBtn.addEventListener('animationend', handleAnimationEnd);
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
			$placeLikeBtn.dataset.month = place.favorites;
			if (isFavorites || place.favorites === parseInt(monthValue)) {
				$placeLikeBtn.classList.add('liked');
				$placeLikeBtn.classList.remove('text-secondary');
				$placeLikeBtn.classList.add('text-danger');
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
					case 12: monthText = 'декабре'; break;
				}
				$favoritesMonth.innerText = `В ${monthText}`;
				show($favoritesMonth);
			}
		}
		else $placeLikeBtn.dataset.month = monthValue;

		const $placeShareBtn = $newPlaceCard.querySelector('.place-share');
		$placeShareBtn.addEventListener('click', () => {
			vkBridge.send('VKWebAppShowWallPostBox', {
				message: 'Мне нравится, и я советую приложение Trip Season Map!\nvk.com/tripseason\n#tripseasonmap',
				attachments: `photo${place.vk_share_ru},https://vk.com/tripseason`,
				copyright: 'https://vk.com/tripseason',
				services: 'facebook,twitter',
				/* lat: 23,
				long: 42, */
			}).then(() => {
				thanksMessage();
			});
		});
		if (isFavorites) show($placeShareBtn);

		const $videoBtn = $newPlaceCard.querySelector('.video');
		$videoBtn.href = `https://www.youtube.com/watch?v=${place.video}`;
		$videoBtn.addEventListener('click', (e) => {
			if ( ! localStorage.video) {
				e.preventDefault();
				localStorage.video = 1;
				Swal.fire({
					html: 'Вы будете перенаправлены на YouTube.<br>После просмотра видео не забудьте вернуться и посмотреть другие места!',
					confirmButtonText: 'Конечно!',
					icon: 'warning',
					customClass: {
						confirmButton: 'btn btn-success btn-lg',
					},
					onOpen: (toast) => {
						toast.querySelector('.swal2-confirm').blur();
					},
				}).then(() => {
					$videoBtn.click();
				});
			}
		});

		const $photosBtn = $newPlaceCard.querySelector('.photos');
		$photosBtn.addEventListener('click', () => {
			// place.vk_photos = 'https://pp.userapi.com/c639229/v639229113/31b31/KLVUrSZwAM4.jpg;https://pp.userapi.com/c639229/v639229113/31b94/mWQwkgDjav0.jpg;https://pp.userapi.com/c639229/v639229113/31b3a/Lw2it6bdISc.jpg';
			const imagesArr = place.vk_photos.split(';');
			showImages(imagesArr);
		});

		$placesCards.appendChild($newPlaceCard);
		show($newPlaceCard);

		// TODO: find another fix for max-height
		/* start fix max-height */
		setTimeout(() => {
			cardHeightResize($newPlaceCard);
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

	setTimeout(() => {
		$placesCards.querySelectorAll('.card').forEach(($card) => {
			cardHeightResize($card);
		});
	}, 2000);
};

const cardHeightResize = ($newPlaceCard) => {
	const $childrens = $newPlaceCard.querySelector('.card-img-overlay').children;
	let totalHeight = 0;
	for (let i = 0; i < $childrens.length; i++)
		totalHeight += $childrens[i].offsetHeight;
	$newPlaceCard.querySelector('.card-img-top').style.height = `${totalHeight + 40}px`;
};

const getPlaces = () => {
	isFavorites = false;
	$placesCards.innerHTML = '';
	$placesCards.classList.remove('favorites');
	const requestTimeout = () => {
		if ( ! placesLoaded) {
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
			placesLoaded = true;
			setTimeout(() => { placesLoaded = false; }, throttlingTimer);
		}
		else if ( ! requestTimeoutStarted) {
			requestTimeoutStarted = true;
			setTimeout(() => {
				requestTimeoutStarted = false;
				requestTimeout();
			}, throttlingTimer);
		}
	};
	requestTimeout();
};

let swalQuote;

const showQuote = () => {
	if ( ! swalQuote && Swal.isVisible()) {
		setTimeout(() => { showQuote(); }, 5000);
		return;
	}
	const timer = 20000;
	if ( ! localStorage.quote) localStorage.quote = 0;
	const text = quotes[localStorage.quote];
	if (quotes[parseInt(localStorage.quote) + 1]) localStorage.quote++; else localStorage.quote = 0;
	if (swalQuote && Swal.isVisible()) {
		swalQuote.update({ title: text });
		const increaseTime = timer - Swal.getTimerLeft();
		Swal.increaseTimer(increaseTime);
	}
	else {
		swalQuote = Swal.fire({
			title: text,
			showCloseButton: true,
			toast: true,
			showConfirmButton: false,
			timer: timer,
			timerProgressBar: true,
			position: 'bottom-start',
			width: '100%',
			customClass: {
				container: 'swal2-quote',
			},
			showClass: {
				popup: 'animate__animated animate__fadeInUp',
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutDown',
			},
			onOpen: (toast) => {
				toast.addEventListener('click', showQuote);
			},
		});
	}
};
