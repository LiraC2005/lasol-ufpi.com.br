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
let totalScore = 0;

// Timer
const timerSpan = document.createElement("span");
timerSpan.className = "timer";
timerSpan.style.marginBottom = "10px";
let timerInterval = null;
let seconds = 0;
let questionStartTime = 0;
content.insertBefore(timerSpan, content.firstChild);

// Pontuação acumulada
const pointsSpan = document.createElement("span");
pointsSpan.className = "question-points";
pointsSpan.style.fontSize = "1.1rem";
pointsSpan.style.fontWeight = "bold";
pointsSpan.style.marginBottom = "10px";
pointsSpan.style.display = "block";
content.insertBefore(pointsSpan, timerSpan.nextSibling);

function startTimer() {
  seconds = 0;
  timerSpan.textContent = "Tempo: 0s";
  totalScore = 0;
  pointsSpan.textContent = `Pontos: ${totalScore}`;
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
  pointsSpan.textContent = "";
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

document.querySelectorAll(".select-difficulty button").forEach((btn) => {
  btn.onclick = (e) => {
    const level = e.target.getAttribute("data-difficulty");
    // Filtra as questões pela dificuldade e embaralha, pegando as 10 primeiras
    const questionsByLevel = questions.filter((q) => q.difficulty === level);
    if (questionsByLevel.length === 0) {
      alert("Não há perguntas para este nível.");
      return;
    }
    filteredQuestions = shuffle([...questionsByLevel]).slice(0, 10);
    currentIndex = 0;
    questionsCorrect = 0;
    totalScore = 0;
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
  const btn = e.target;
  const isCorrect = btn.getAttribute("data-correct") === "true";

  // Calcula tempo gasto nesta questão
  const questionEndTime = Date.now();
  const timeSpent = Math.floor((questionEndTime - questionStartTime) / 1000); // em segundos

  // Pontuação: quanto mais rápido, mais pontos (máx 100, mínimo 10)
  let score = Math.max(100 - timeSpent * 10, 10);
  let pontosAntes = totalScore;
  if (isCorrect) {
    questionsCorrect++;
    totalScore += score;
  }
  // Mostra "+" se os pontos aumentarem
  if (totalScore > pontosAntes) {
    pointsSpan.textContent = `Pontos: ${totalScore}+${score}`;
  } else {
    pointsSpan.textContent = `Pontos: ${totalScore}`;
  }

  // Marca todos os botões: verde para corretos, vermelho para errados
  document.querySelectorAll(".answer").forEach((b) => {
    b.disabled = true;
    if (b.getAttribute("data-correct") === "true") {
      b.classList.add("btn-correct");
    } else {
      b.classList.add("btn-wrong");
    }
  });

  setTimeout(() => {
    document.querySelectorAll(".answer").forEach((b) => {
      b.classList.remove("btn-correct", "btn-wrong");
    });
    if (currentIndex < filteredQuestions.length - 1) {
      currentIndex++;
      loadQuestion();
    } else {
      finish();
    }
  }, 900);
}

function finish() {
  stopTimer();
  pointsSpan.textContent = "";
  textFinish.innerHTML = `você acertou ${questionsCorrect} de ${filteredQuestions.length}<br>Tempo: ${seconds}s<br>Pontuação: ${totalScore}`;
  content.style.display = "none";
  contentFinish.style.display = "flex";
}

function loadQuestion() {
  spnQtd.innerHTML = `${currentIndex + 1}/${filteredQuestions.length}`;
  const item = filteredQuestions[currentIndex];
  answers.innerHTML = "";
  question.innerHTML = item.question;

  // Exibe imagem se houver (centralizada)
  if (item.image) {
    question.innerHTML += `<br><div class="center-content"><img src="${item.image}" alt="imagem da questão" style="max-width:300px; margin:10px 0;"></div>`;
  }
  // Exibe tabela se houver (centralizada)
  if (item.table) {
    question.innerHTML += `<br><div class="center-content">${item.table}</div>`;
  }

  pointsSpan.textContent = `Pontos: ${totalScore}`;

  item.answers.forEach((answer) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
      ${answer.option}
    </button>
    `;

    answers.appendChild(div);
  });

  // Marca o início da contagem de tempo para esta questão
  questionStartTime = Date.now();

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", nextQuestion);
  });
}

// Inicialização: mostra a seleção de dificuldade
showDifficulty();