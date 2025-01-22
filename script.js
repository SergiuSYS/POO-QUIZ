let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const currentScoreEl = document.getElementById("current-score");
const totalQuestionsEl = document.getElementById("total-questions");

// Funcție pentru amestecarea unui array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Încărcăm datele din fișierul JSON
async function loadQuizData() {
    try {
        const response = await fetch('quizData.json'); // Încarcă fișierul JSON
        quizData = await response.json(); // Parsează JSON-ul
        shuffle(quizData); // Amestecăm întrebările
        totalQuestionsEl.textContent = quizData.length; // Afișăm numărul total de întrebări
        loadQuestion(); // Începe să încarce prima întrebare
    } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
    }
}

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;

    // Amestecăm opțiunile și actualizăm indexul răspunsului corect
    const options = [...currentQuestion.options];
    const correctAnswer = options[currentQuestion.answer];
    shuffle(options);
    currentQuestion.answer = options.indexOf(correctAnswer);

    // Afișăm opțiunile
    answersEl.innerHTML = "";
    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => handleAnswer(index)); // Pasăm indexul
        answersEl.appendChild(button);
    });
}

function handleAnswer(selectedIndex) {
    const currentQuestion = quizData[currentQuestionIndex];
    const buttons = answersEl.querySelectorAll("button");

    // Colorează butoanele și aplică fade doar pe butoanele albastre
    buttons.forEach((button, index) => {
        if (index === currentQuestion.answer) {
            button.classList.add("correct"); // Răspuns corect devine verde
        }
        if (index === selectedIndex && index !== currentQuestion.answer) {
            button.classList.add("wrong"); // Răspuns greșit devine roșu
        }
        if (index !== selectedIndex && index !== currentQuestion.answer) {
            button.classList.add("fade"); // Fade pentru restul
        }
        button.classList.add("disabled"); // Dezactivează toate butoanele
    });

    // Actualizează scorul
    if (selectedIndex === currentQuestion.answer) {
        score++;
    }

    // Actualizează scorul afișat
    currentScoreEl.textContent = score;

    // Trecem la următoarea întrebare după un scurt interval
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showScore();
        }
    }, 1000); // Pauză de 1 secundă pentru a vedea culorile
}

function showScore() {
    questionEl.style.display = "none";
    answersEl.style.display = "none";
    scoreEl.style.display = "block";
    scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
}

// Începem quiz-ul prin încărcarea datelor
loadQuizData();
