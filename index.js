const logoAccess = document.querySelector(".logo-container");
const sectionSubject = document.querySelector(".subject-container");
const sectionQuestion = document.querySelector(".question-container");
const sectionCompleted = document.querySelector(".quiz-completed");
const htmlSubject = document.getElementById("html");
const cssSubject = document.getElementById("css");
const jsSubject = document.getElementById("js");
const accessibilitySubject = document.getElementById("accessibility");
const questionNumber = document.querySelector(".question-number");
const questionEl = document.getElementById("question");
const resListEl = document.getElementById("res-list");
const submitedBtn = document.getElementById("submited-answer");
const scoreEl = document.querySelector(".score");
const maxScoreEl = document.querySelector(".max-score");
const playAgainBtn = document.getElementById("play-again");
const errorMsg = document.querySelector(".error-msg");
const timerEl = document.getElementById("countdown");
const url = "data.json";
let quizzesData;
let selectedOption = null;
let submitedAnswer;
let canChoose;
let submitedEl;
let questionsG;
let answerOfQuestion;
let currentQuestion;
let numberOfQuestions;
let score;
let maxScore;
let timeoutRef = null;
let intervalRef = null;
let countUp;
let maxCountUp = 15;

function initialisation() {
    htmlSubject
    render("hidden", true, false, false);
    fetch(url).then((res) => {
        if (!res.ok) return console.log(res);

        return res.json();
    }).then((data) => {
        quizzesData = data.quizzes;
        console.log(quizzesData);
    }).catch((err) => {
        console.log(err);
    });
}

initialisation();

function render(logoVisibility, subjectDisplay, questionDisplay, completedDisplay, errorDisplay) {
    sectionSubject.classList.add("hide");
    sectionQuestion.classList.add("hide");
    sectionCompleted.classList.add("hide");
    errorMsg.classList.add("hide");
    logoAccess.style.visibility = logoVisibility;
    if (subjectDisplay === true) {
        sectionSubject.classList.remove("hide");
    }
    if (questionDisplay === true) {
        sectionQuestion.classList.remove("hide");
    }
    if (completedDisplay === true) {
        sectionCompleted.classList.remove("hide");
    }
}

htmlSubject.addEventListener("click", () => {
    const questions = [...quizzesData[0].questions];
    questionsG = questions;

    clearInterval(intervalRef);
    intervalRef = null;
    resetTimer();

    currentQuestion = 0;
    score = 0;

    numberOfQuestions = questionsG.length;

    const nOfQuestions = questionsG.length;
    render("visible", false, true, false);

    console.log(questionsG);

    getQuestionAndAnswer(questionsG);
});

cssSubject.addEventListener("click", () => {
    const questions = [...quizzesData[1].questions];
    questionsG = questions;

    clearInterval(intervalRef);
    intervalRef = null;
    resetTimer();

    currentQuestion = 0;
    score = 0;

    numberOfQuestions = questionsG.length;

    const nOfQuestions = questionsG.length;
    render("visible", false, true, false);

    console.log(questionsG);

    getQuestionAndAnswer(questionsG);
});

jsSubject.addEventListener("click", () => {
    const questions = [...quizzesData[2].questions];
    questionsG = questions;

    clearInterval(intervalRef);
    intervalRef = null;
    resetTimer();

    currentQuestion = 0;
    score = 0;

    numberOfQuestions = questionsG.length;

    const nOfQuestions = questionsG.length;
    render("visible", false, true, false);

    console.log(questionsG);

    getQuestionAndAnswer(questionsG);
});

accessibilitySubject.addEventListener("click", () => {
    const questions = [...quizzesData[3].questions];
    questionsG = questions;

    clearInterval(intervalRef);
    intervalRef = null;
    resetTimer();

    currentQuestion = 0;
    score = 0;

    numberOfQuestions = questionsG.length;

    const nOfQuestions = questionsG.length;
    render("visible", false, true, false);

    console.log(questionsG);

    getQuestionAndAnswer(questionsG);
});

playAgainBtn.addEventListener("click", () => {
    reset();
    resetSelectedOption();
    render("hidden", true, false, false);
});

function getQuestionAndAnswer(questionsVal) {
    console.log("question remaining: " + questionsVal.length);
    if (!questionsVal.length) {
        clearInterval(intervalRef);
        intervalRef = null;
        resetTimer();

        render("visible", false, false, true);
        scoreEl.innerHTML = score;
        maxScoreEl.innerHTML = `out of ${numberOfQuestions}`;
        questionsG = null;
        return;
    }
    const randomIndex = Math.floor(Math.random() * questionsVal.length);

    clearInterval(intervalRef);
    intervalRef = null;
    resetTimer();

    questionNumber.innerHTML = '';
    questionEl.innerHTML = '';
    resListEl.innerHTML = '';

    resetSelectedOption();

    for (const [key, question] of Object.entries(questionsVal)) {
        if (Number(key) === randomIndex) {
            currentQuestion++;
            answerOfQuestion = question.answer;
            questionNumber.innerHTML = `Question ${currentQuestion} of ${numberOfQuestions}`;
            questionEl.innerHTML = `${escapeHTML(question.question)}`;

            resListEl.innerHTML += `<li>
                        <div class="res-item"><span>A</span></div>${escapeHTML(question.options[0])}
                        <img src="./assets/images/icon-correct.svg" alt="correct icon">
                        <img src="./assets/images/icon-error.svg" alt="error icon">
                    </li>
                    <li>
                        <div class="res-item"><span>B</span></div>${escapeHTML(question.options[1])}
                        <img src="./assets/images/icon-correct.svg" alt="correct icon">
                        <img src="./assets/images/icon-error.svg" alt="error icon">
                    </li>
                    <li>
                        <div class="res-item"><span>C</span></div>${escapeHTML(question.options[2])}
                        <img src="./assets/images/icon-correct.svg" alt="correct icon">
                        <img src="./assets/images/icon-error.svg" alt="error icon">
                    </li>
                    <li>
                        <div class="res-item"><span>D</span></div>${escapeHTML(question.options[3])}
                        <img src="./assets/images/icon-correct.svg" alt="correct icon">
                        <img src="./assets/images/icon-error.svg" alt="error icon">
                    </li>`;
            questionsG.splice(randomIndex, 1);
            break;
        }
    }

    chooseOptions();

    console.log("timer is running");

    (async () => {
        canChoose = true;
        await waitingForAnswer().then(() => {
            canChoose = false;
            submitedBtn.removeEventListener("click", () => {});
            //console.log("true answer");
            score++;
            submitedEl.classList.add("correct");

            //reset interval
            clearInterval(intervalRef);
            intervalRef = null;
            resetTimer();

            (async () => {
                await sleep(2000);
                submitedEl.classList.remove("correct");
                submitedEl.classList.remove("selected-answer");
                getQuestionAndAnswer(questionsG);
            })();
        }).catch(() => {
            canChoose = false;
            submitedBtn.removeEventListener("click", () => {});
            //console.log("false answer");
            if (submitedEl)
                submitedEl.classList.remove("selected-answer");
            if (submitedEl && submitedAnswer) {
                submitedEl.classList.add("incorrect");
                submitedEl.classList.remove("selected-answer");
            }
            const el = findCorrectEl();
            el.classList.add("correction");

            //reset interval
            clearInterval(intervalRef);
            intervalRef = null;
            resetTimer();

            (async () => {
                await sleep(2000);
                el.classList.remove("correction");
                if (submitedEl && submitedAnswer) {
                    submitedEl.classList.remove("incorrect");
                }
                getQuestionAndAnswer(questionsG);
            })();
        });
    })();
}

async function waitingForAnswer() {
    return new Promise((resolve, reject) => {
        submitedBtn.addEventListener("click", () => {
            submitedAnswer = selectedOption;
            if (!selectedOption && !timeoutRef) {
                errorMsg.classList.remove("hide");
                timeoutRef = setTimeout(() => {
                    errorMsg.classList.add("hide");
                    timeoutRef = null;
                }, 2000);
                return;
            }
            if (selectedOption === answerOfQuestion) {

                resolve();
            }
            if (selectedOption && selectedOption !== answerOfQuestion) {

                reject();
            }
        });
        (async () => {
            await runTimer(100).catch(() => {
                reject();
            });
        })();
    });
}

function resetSelectedOption() {
    selectedOption = null;
    answerOfQuestion = null;
    submitedAnswer = null;
}

function reset() {
    selectedOption = null;
    submitedAnswer = null;
    submitedEl = null;
    answerOfQuestion = null;
    currentQuestion = null;
    numberOfQuestions = null;
    score = null;
    maxScore = null;
    timeoutRef = null;
}

function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

function findCorrectEl() {
    const options = document.getElementById("res-list").children;
    for (const option of Object.values(options)) {
        if (option.textContent.trim().slice(1) === answerOfQuestion) {
            return option;
        }
    }
}

function escapeHTML(value) {
    let str = value.trim();
    str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return str;
}

function chooseOptions() {
    const options = document.getElementById("res-list").children;
    const [
        a,
        b,
        c,
        d
    ] = options;
    a.addEventListener("click", () => {
        if (canChoose) {
            deselectAllOptions(options);
            a.classList.add("selected-answer");
            selectedOption = a.textContent.trim().slice(1);
            submitedEl = a;
        }
    });
    b.addEventListener("click", () => {
        if (canChoose) {
            deselectAllOptions(options);
            b.classList.add("selected-answer");
            selectedOption = b.textContent.trim().slice(1);
            submitedEl = b;
        }
    });
    c.addEventListener("click", () => {
        if (canChoose) {
            deselectAllOptions(options);
            c.classList.add("selected-answer");
            selectedOption = c.textContent.trim().slice(1);
            submitedEl = c;
        }
    });
    d.addEventListener("click", () => {
        if (canChoose) {
            deselectAllOptions(options);
            d.classList.add("selected-answer");
            selectedOption = d.textContent.trim().slice(1);
            submitedEl = d;
        }
    });
}

function deselectAllOptions(optionsVal) {
    for (const option of Object.values(optionsVal)) {
        option.classList.remove("selected-answer");
    }
}

function runTimer(intervalDuration) {
    countUp = 0;
    const incrementValue = intervalDuration / 1000;
    return new Promise((resolve, reject) => {
        intervalRef = setInterval(() => {
            countUp += incrementValue;
            countUp = roundedNumber(countUp);
            console.log(countUp);
            timerEl.style.width = `${(countUp*100)/maxCountUp}%`;
            if (countUp > maxCountUp) {
                clearInterval(intervalRef);
                intervalRef = null;

                reject();
            }
        }, intervalDuration);
    });
}

function roundedNumber(value) {
    return Math.round(value * 10) / 10;
}

function resetTimer() {
    countUp = 0;
    timerEl.style.width = `${(countUp*100)/maxCountUp}%`;
}
