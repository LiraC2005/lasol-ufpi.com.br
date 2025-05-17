const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");
const selectDifficulty = document.querySelector(".select-difficulty");

import questions from "./questions.js";

let currentIndex = 0;
let questionsCorrect = 0;
let filteredQuestions = [];

// Timer
const timerSpan = document.createElement("span");
timerSpan.className = "timer";
timerSpan.style.marginBottom = "10px";
let timerInterval = null;
let seconds = 0;
content.insertBefore(timerSpan, content.firstChild);

function startTimer() {
  seconds = 0;
  timerSpan.textContent = "Tempo: 0s";
  timerInterval = setInterval(() => {
    seconds++;
    timerSpan.textContent = `Tempo: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showDifficulty() {
  selectDifficulty.style.display = "flex";
  content.style.display = "none";
  contentFinish.style.display = "none";
  timerSpan.textContent = "";
}

function hideDifficulty() {
  selectDifficulty.style.display = "none";
  content.style.display = "flex";
}

// Função para embaralhar um array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.querySelectorAll(".select-difficulty button").forEach(btn => {
  btn.onclick = (e) => {
    const level = e.target.getAttribute("data-difficulty");
    // Filtra as questões pela dificuldade e embaralha, pegando as 10 primeiras
    const questionsByLevel = questions.filter(q => q.difficulty === level);
    if (questionsByLevel.length === 0) {
      alert("Não há perguntas para este nível.");
      return;
    }
    filteredQuestions = shuffle([...questionsByLevel]).slice(0, 10);
    currentIndex = 0;
    questionsCorrect = 0;
    hideDifficulty();
    startTimer();
    loadQuestion();
  };
});

btnRestart.onclick = () => {
  showDifficulty();
  stopTimer();
};

function nextQuestion(e) {
  if (e.target.getAttribute("data-correct") === "true") {
    questionsCorrect++;
  }

  if (currentIndex < filteredQuestions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    finish();
  }
}

function finish() {
  stopTimer();
  textFinish.innerHTML = `você acertou ${questionsCorrect} de ${filteredQuestions.length}<br>Tempo: ${seconds}s`;
  content.style.display = "none";
  contentFinish.style.display = "flex";
}

function loadQuestion() {
  spnQtd.innerHTML = `${currentIndex + 1}/${filteredQuestions.length}`;
  const item = filteredQuestions[currentIndex];
  answers.innerHTML = "";
  question.innerHTML = item.question;

  item.answers.forEach((answer) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
      ${answer.option}
    </button>
    `;

    answers.appendChild(div);
  });

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", nextQuestion);
  });
}

// Inicialização: mostra a seleção de dificuldade
showDifficulty();