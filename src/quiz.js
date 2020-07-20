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
		'#filter-form',
		'#select-month',
		'#prev-month',
		'#next-month',
		'#second-filter1',
		'#second-filter2',
		'#third-filter-block',
		'#third-filter1',
		'#third-filter2',
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

	let currentScreen = 'questions';

	let monthValue;

	$question1.querySelectorAll('.quiz-month').forEach(($month) => {
		$month.addEventListener('click', () => {
			monthValue = $month.dataset.id;
			$question1.classList.add('animate__fadeOut');
			const handleAnimationEnd = () => {
				$question1.removeEventListener('animationend', handleAnimationEnd);
				hide($question1);
				show($question2);
			};
			$question1.addEventListener('animationend', handleAnimationEnd);
			$selectMonth.value = monthValue;
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => { $month.blur(); }, 3000); // ёбанный айфон!
		});
	});

	let question2;
	let question3;

	let isFavorites = false;

	let placesLoaded = false;

	document.querySelectorAll('#questions .card').forEach(($card) => {
		$card.addEventListener('click', () => {
			if (placesLoaded) return;
			const answerId = parseInt($card.dataset.id);
			if (answerId === 1 || answerId === 2) {
				$question2.classList.add('animate__fadeOut');
				const handleAnimationEnd = () => {
					$question2.removeEventListener('animationend', handleAnimationEnd);
					hide($question2);
					if (answerId === 1) {
						show($question31);
						$secondFilter2.classList.remove('active');
						$secondFilter1.classList.add('active');
						$thirdFilter1.innerText = 'Горы и водопады';
						$thirdFilter2.innerText = 'Океан и море';
					}
					else {
						show($question32);
						$secondFilter1.classList.remove('active');
						$secondFilter2.classList.add('active');
						$thirdFilter1.innerText = 'Старинные';
						$thirdFilter2.innerText = 'Современные';
					}
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

				if (answerId === 3 || answerId === 5) {
					question3 = 1;
					$thirdFilter2.classList.remove('active');
					$thirdFilter1.classList.add('active');
				}
				else {
					question3 = 2;
					$thirdFilter1.classList.remove('active');
					$thirdFilter2.classList.add('active');
				}

				currentScreen = 'main';
				getPlaces();
				placesLoaded = true;
				setTimeout(() => { placesLoaded = false; }, 2000);
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	let requestTimeoutStarted = false;

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
				setTimeout(() => { placesLoaded = false; }, 2000);
			}
			else if ( ! requestTimeoutStarted) {
				requestTimeoutStarted = true;
				setTimeout(() => {
					requestTimeoutStarted = false;
					requestTimeout();
				}, 2000);
			}
		};
		requestTimeout();
	});

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
				setTimeout(() => { placesLoaded = false; }, 2000);
			}
			else if ( ! requestTimeoutStarted) {
				requestTimeoutStarted = true;
				setTimeout(() => {
					requestTimeoutStarted = false;
					requestTimeout();
				}, 2000);
			}
		};
		requestTimeout();
	};

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
		}).then((result) => {
			if (result.value) {
				currentScreen = 'questions';
				monthValue = null;
				$question1.classList.remove('animate__fadeOut');
				$question2.classList.remove('animate__fadeOut');
				$question31.classList.remove('animate__fadeOut');
				$question32.classList.remove('animate__fadeOut');
				show($question1, $quizListBtn, $filterForm);
				hide($favoritesBtn, $resultScreen, $cardsArea); // $stackCardsArea
				isFavorites = false;
				$placesCards.classList.remove('favorites');
				$cardsArea.style.marginTop = null;
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

	const $lightgallery = document.querySelector('#lightgallery');
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
	const lightgalleryOptions = {
		hideBarsDelay: 1000,
		getCaptionFromTitleOrAlt: false,
		preload: 3,
		showAfterLoad: false,
		download: false,
		actualSize: false,
		// autoplay: true,
		pause: 2000,
		dynamic: true,
		dynamicEl: [],
	};

	const showVkImages = (images) => {
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

	const thanksMessage = () => {
		Swal.fire({
			title: 'Спасибо!',
			icon: 'success',
			showCloseButton: true,
			toast: true,
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true,
		});
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
					message: 'Мне понравилось и я советую приложение Trip Season Map!\nvk.com/app7535937\n#tripseasonmap',
					attachments: `photo${place.vk_share_ru},https://vk.com/app7535937`,
					copyright: 'https://vk.com/app7535937',
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
						html: 'Вы будете перенаправлены в YouTube.<br>После просмотра видео, не забудьте вернуться и посмотреть другие места!',
						confirmButtonText: 'Конечно!',
						icon: 'warning',
						customClass: {
							confirmButton: 'btn btn-success btn-lg',
						},
					}).then(() => {
						$videoBtn.click();
					});
				}
			});

			const $photosBtn = $newPlaceCard.querySelector('.photos');
			$photosBtn.addEventListener('click', () => {
				// place.vk_photos = 'https://pp.userapi.com/c639229/v639229113/31b31/KLVUrSZwAM4.jpg;https://pp.userapi.com/c639229/v639229113/31b94/mWQwkgDjav0.jpg;https://pp.userapi.com/c639229/v639229113/31b3a/Lw2it6bdISc.jpg';
				const vkImagesArr = place.vk_photos.split(';');
				showVkImages(vkImagesArr);
			});

			$placesCards.appendChild($newPlaceCard);
			show($newPlaceCard);

			// TODO: find another fix for max-height
			/* start fix max-height */
			setTimeout(() => {
				const $childrens = $newPlaceCard.querySelector('.card-img-overlay').children;
				let totalHeight = 0;
				for (let i = 0; i < $childrens.length; i++)
					totalHeight += $childrens[i].offsetHeight;
				$newPlaceCard.querySelector('.card-img-top').style.height = `${totalHeight + 40}px`;
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
			setTimeout(() => { placesLoaded = false; }, 2000);
		}
		else if ( ! requestTimeoutStarted) {
			requestTimeoutStarted = true;
			setTimeout(() => {
				requestTimeoutStarted = false;
				trigger($selectMonth, 'change');
			}, 2000);
		}
	});

	const trigger = (element, event) => {
		const evt = document.createEvent('HTMLEvents');
		evt.initEvent(event, true, true);
		return ! element.dispatchEvent(evt);
	};

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
			$thirdFilterBlock.classList.add('animate__flip');
			const handleAnimationEnd = () => {
				$thirdFilterBlock.removeEventListener('animationend', handleAnimationEnd);
				$thirdFilterBlock.classList.remove('animate__flip');
			};
			$thirdFilterBlock.addEventListener('animationend', handleAnimationEnd);
			$thirdFilter1.innerText = 'Горы и водопады';
			$thirdFilter2.innerText = 'Океан и море';
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question2 !== 1) {
						question2 = 1;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, 2000);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, 2000);
				}
			};
			requestTimeout();
		}
	});
	$secondFilter2.addEventListener('click', () => {
		if ( ! $secondFilter2.classList.contains('active')) {
			$secondFilter1.classList.remove('active');
			$secondFilter2.classList.add('active');
			$thirdFilterBlock.classList.add('animate__flip');
			const handleAnimationEnd = () => {
				$thirdFilterBlock.removeEventListener('animationend', handleAnimationEnd);
				$thirdFilterBlock.classList.remove('animate__flip');
			};
			$thirdFilterBlock.addEventListener('animationend', handleAnimationEnd);
			$thirdFilter1.innerText = 'Старинные';
			$thirdFilter2.innerText = 'Современные';
			const requestTimeout = () => {
				if ( ! placesLoaded) {
					if (question2 !== 2) {
						question2 = 2;
						getPlaces();
					}
					placesLoaded = true;
					setTimeout(() => { placesLoaded = false; }, 2000);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, 2000);
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
					setTimeout(() => { placesLoaded = false; }, 2000);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, 2000);
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
					setTimeout(() => { placesLoaded = false; }, 2000);
				}
				else if ( ! requestTimeoutStarted) {
					requestTimeoutStarted = true;
					setTimeout(() => {
						requestTimeoutStarted = false;
						requestTimeout();
					}, 2000);
				}
			};
			requestTimeout();
		}
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

	if (urlParams.get('vk_are_notifications_enabled') === '0' && ! localStorage.notificationsAsk) {
		const handleScroll = () => {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				// console.log('bottom', currentScreen, urlParams.get('vk_are_notifications_enabled') === '0');
				if (currentScreen === 'main') {
					window.removeEventListener('scroll', handleScroll);
					Swal.fire({
						html: 'Мы постоянно обновляем приложение и добавляем новые места! Разрешите уведомления и мы будем вам сообщать об обновлениях и о наших новостях раз в неделю!',
						confirmButtonText: 'Конечно!',
						icon: 'warning',
						customClass: {
							confirmButton: 'btn btn-success btn-lg',
						},
					}).then(() => {
						const accessNotifications = () => {
							vkBridge.send('VKWebAppAllowNotifications')
									.then((data) => {
										console.log(data);
										socket.emit('vk_user.set', {
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
