/* const initQuiz = () => {
	$questionsProgress.style.width = '0%';
	const handleAnimationEnd = () => {
		$quizMonthArea.removeEventListener('animationend', handleAnimationEnd);
	};
	$quizMonthArea.addEventListener('animationend', handleAnimationEnd);
}; */

document.addEventListener('DOMContentLoaded', () => {

	initHtmlElements(
		'#question1-first',
		'#question1-second',
		'#question1-third',
		'#questions-progress',
		'#quiz-month-area',
		'#question2',
		'#question2-first',
		'#question2-second',
		'#question2-third',
		'#question31',
		'#question31-first',
		'#question31-second',
		'#question31-third',
		'#question32',
		'#question32-first',
		'#question32-second',
		'#question32-third',
		'#result-screen',
		'#cards-area',
	);

	// initQuiz();
	$questionsProgress.style.width = '0%';

	$quizMonthArea.querySelectorAll('.quiz-month').forEach(($month) => {
		$month.addEventListener('click', () => {
			monthValue = $month.dataset.id;

			$question1First.classList.add('animate__fadeOut');
			/* const handleAnimationEnd = () => {
				$question1First.removeEventListener('animationend', handleAnimationEnd);
			};
			$question1First.addEventListener('animationend', handleAnimationEnd); */

			$question1Second.classList.remove('animate__delay-0_5s');
			$question1Second.classList.add('animate__fadeOut');
			const handleAnimationEnd2 = () => {
				$question1Second.removeEventListener('animationend', handleAnimationEnd2);
				$question1Second.classList.add('animate__delay-0_5s');
			};
			$question1Second.addEventListener('animationend', handleAnimationEnd2);

			$question1Third.classList.remove('animate__delay-1s');
			$question1Third.classList.add('animate__fadeOut');
			const handleAnimationEnd3 = () => {
				$question1Third.removeEventListener('animationend', handleAnimationEnd3);
				$question1Third.classList.add('animate__delay-1s');
				hide($question1First, $question1Second, $question1Third);
				$question1First.classList.remove('animate__fadeOut');
				$question1Second.classList.remove('animate__fadeOut');
				$question1Third.classList.remove('animate__fadeOut');
				show($question2First, $question2Second, $question2Third);
			};
			$question1Third.addEventListener('animationend', handleAnimationEnd3);

			$quizMonthArea.classList.add('animate__fadeOut');
			const handleAnimationEnd4 = () => {
				$quizMonthArea.removeEventListener('animationend', handleAnimationEnd4);
				$quizMonthArea.classList.remove('animate__fadeOut');
				hide($quizMonthArea);
				show($question2);
			};
			$quizMonthArea.addEventListener('animationend', handleAnimationEnd4);

			$selectMonth.value = monthValue;
			trigger($selectMonth, 'change');
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => { $month.blur(); }, 3000); // ёбанный айфон!

			$questionsProgress.style.width = '33%';
		});
	});

	$quizPage.querySelectorAll('.card').forEach(($card) => {
		$card.addEventListener('click', () => {
			if (placesLoaded) return;
			placesLoaded = true;
			setTimeout(() => { placesLoaded = false; }, 2000);
			const answerId = parseInt($card.dataset.id);
			if (answerId === 1 || answerId === 2) {
				question2 = answerId;
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

				$question2First.classList.add('animate__fadeOut');
				/* const handleAnimationEnd = () => {
					$question2First.removeEventListener('animationend', handleAnimationEnd);
				};
				$question2First.addEventListener('animationend', handleAnimationEnd); */

				$question2Second.classList.remove('animate__delay-0_5s');
				$question2Second.classList.add('animate__fadeOut');
				const handleAnimationEnd2 = () => {
					$question2Second.removeEventListener('animationend', handleAnimationEnd2);
					$question2Second.classList.add('animate__delay-0_5s');
				};
				$question2Second.addEventListener('animationend', handleAnimationEnd2);

				$question2Third.classList.remove('animate__delay-1s');
				$question2Third.classList.add('animate__fadeOut');
				const handleAnimationEnd3 = () => {
					$question2Third.removeEventListener('animationend', handleAnimationEnd3);
					$question2Third.classList.add('animate__delay-1s');
					hide($question2First, $question2Second, $question2Third);
					$question2First.classList.remove('animate__fadeOut');
					$question2Second.classList.remove('animate__fadeOut');
					$question2Third.classList.remove('animate__fadeOut');
					if (answerId === 1) show($question31First, $question31Second, $question31Third); else show($question32First, $question32Second, $question32Third);
				};
				$question2Third.addEventListener('animationend', handleAnimationEnd3);

				$question2.classList.add('animate__fadeOut');
				const handleAnimationEnd4 = () => {
					$question2.removeEventListener('animationend', handleAnimationEnd4);
					$question2.classList.remove('animate__fadeOut');
					hide($question2);
					if (answerId === 1) show($question31); else show($question32);
				};
				$question2.addEventListener('animationend', handleAnimationEnd4);

				$questionsProgress.style.width = '66%';
			}
			if (answerId >= 3 && answerId <= 6) {
				/* $question31.classList.add('animate__fadeOut');
				$question32.classList.add('animate__fadeOut');
				const handleAnimationEnd = () => {
					$question31.removeEventListener('animationend', handleAnimationEnd);
					$question32.removeEventListener('animationend', handleAnimationEnd);
					hide($quizPage);
					$question31.classList.remove('animate__fadeOut');
					$question32.classList.remove('animate__fadeOut');
					show($resultScreen, $cardsArea); // $stackCardsArea
				};
				$question31.addEventListener('animationend', handleAnimationEnd);
				$question32.addEventListener('animationend', handleAnimationEnd); */
				$quizPage.classList.add('animate__fadeOut');
				const handleAnimationEnd = () => {
					$quizPage.removeEventListener('animationend', handleAnimationEnd);
					hide($quizPage);
					$quizPage.classList.remove('animate__fadeOut');
					show($resultScreen, $cardsArea); // $stackCardsArea
				};
				$quizPage.addEventListener('animationend', handleAnimationEnd);

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

				$questionsProgress.style.width = '100%';

				currentScreen = 'main';
				getPlaces();
				/* placesLoaded = true;
				setTimeout(() => { placesLoaded = false; }, 2000); */

				setTimeout(() => { showQuote(); }, 10000);
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

});
