let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const currentScoreEl = document.getElementById("current-score");
const totalQuestionsEl = document.getElementById("total-questions");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadQuizData() {
    try {
        const response = await fetch('quizData.json');  
        quizData = await response.json();  
        shuffle(quizData);  
        totalQuestionsEl.textContent = quizData.length;  
        loadQuestion();  
    } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
    }
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;

    const options = [...currentQuestion.options];
    const correctAnswer = options[currentQuestion.answer];
    shuffle(options);
    currentQuestion.answer = options.indexOf(correctAnswer);

    answersEl.innerHTML = "";
    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => handleAnswer(index));  
        answersEl.appendChild(button);
    });
}

function handleAnswer(selectedIndex) {
    const currentQuestion = quizData[currentQuestionIndex];
    const buttons = answersEl.querySelectorAll("button");

    buttons.forEach((button, index) => {
        if (index === currentQuestion.answer) {
            button.classList.add("correct");  
        }
        if (index === selectedIndex && index !== currentQuestion.answer) {
            button.classList.add("wrong");  
        }
        if (index !== selectedIndex && index !== currentQuestion.answer) {
            button.classList.add("fade");  
        }
        button.classList.add("disabled");  
    });

    if (selectedIndex === currentQuestion.answer) {
        score++;
    }

    currentScoreEl.textContent = score;

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showScore();
        }
    }, 2000); 
}

function showScore() {
    questionEl.style.display = "none";
    answersEl.style.display = "none";
    scoreEl.style.display = "block";
    scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
}
loadQuizData();
