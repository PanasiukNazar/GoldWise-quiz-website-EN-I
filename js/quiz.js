const QUESTIONS = [
    {
        label: 'How old are you?',
        answers: ['Under 18', '18-29', '30-49', '45-55', '50 and above'],
    },
    {
        label: 'How familiar are you with investing?',
        answers: [
            'I’m just starting',
            'I have some experience',
            'I’m an experienced investor',
            'I’ve been investing for years',
        ],
    },
    {
        label: 'What stage of your financial journey are you in?',
        answers: [
            'Just starting out, building my financial foundation',
            'Have some experience, looking to grow furthe',
            'Established, seeking to diversify and maximize returns',
            'Nearing or in retirement, aiming for stability',
        ],
    },
    {
        label: 'What is your primary approach to building long-term financial security?',
        answers: [
            'Focus on steady growth with minimal risk.',
            'Pursue high returns, even if it means taking on more risk.',
            'Prioritize a balanced mix of stable and aggressive investments.',
            'Preserve wealth and protect against market volatility.',
        ],
    },
    {
        label: 'What are your financial objectives?',
        answers: [
            'Build a financial safety net for emergencies',
            'Ensure support for you and your family',
            'Achieve financial independence',
            'Remodel or purchase a home',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="img/quiz.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <h2 class="title">Test Your Knowledge on Gold and Investing</h2>
                    <h3 class="sub-title">Discover How Much You Know About Gold</h3>
                    <p class="text">Are you ready to challenge yourself and explore the world of gold and investing?</p>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Start</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">

            <div class="row quiz-content text-center">

                <div class="row justify-content-center mt-4" style="margin: 0 auto;">
                    <div class="progress col-md-6" style="padding-left: 0 !important; padding-right: 0 !important;">
                        <div class="progress-bar" style="width: ${questionsStep.getProgress()}%">${questionsStep.getProgress()}%</div>
                    </div>
                </div>

                <h3>${question.label}</h3>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer col-md-12 col-lg-5 border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>

            </div>
        </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToNextQuestion':
                return questionsStep.goToNextQuestion();
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        questionsStep.questionIndex -= 1;
        questionsStep.render();
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content form-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                    <h2 class="title">Form of communication</h2>
                    <h3 class="mb-4">Please fill out the feedback form</h3>
                    <form>
                        <input class="form-control" name="name" type="name" placeholder="Name">
                        <input class="form-control" name="Surname" type="name" placeholder="Surname">
                        <input class="form-control" name="email" id="email2" type="email" placeholder="E-Mail">
                        <div id="validation" style="color: red"></div>
                        <input class="form-control" name="phone" type="number" id="phone" placeholder="Phone">
                        <div id="checkbox">
                            <input type="checkbox">
                            <label>I agree with the <a class="form-link" href="terms-of-use.html">terms of use and the privacy policy</a></label>
                        </div>
                         <div id="checkbox">
                            <input type="checkbox" checked disabled>
                            <label>I agree to the email newsletter</label>
                        </div>

                        
                        ${Object.keys(quiz.answers)
                            .map(
                                (question) =>
                                    `<input name="${question}" value="${quiz.answers[question]}" hidden>`,
                            )
                            .join('')}
                
                        <button data-action="submitAnswers" class="btn btn-primary w-100 py-2 first-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'submitAnswers') {
            // Get the input value
            const emailInput = document.getElementById('email2').value;

            // Regular expression for basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Test the input against the regular expression
            if (emailRegex.test(emailInput)) {
                document.getElementById('validation').textContent = '';
                window.location.href = 'thanks.html';
                localStorage.setItem('quizDone', true);
                document.getElementById('quiz-page').classList.add('hide');
            } else {
                document.getElementById('validation').textContent =
                    'Invalid e-mail address. Please enter a valid e-mail address.';
            }
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
