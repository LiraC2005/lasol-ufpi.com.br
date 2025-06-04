const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");
const selectDifficulty = document.querySelector(".select-difficulty");

// Tela inicial do quiz
const quizInicio = document.querySelector('.quiz-inicio');
selectDifficulty.style.display = "none";
content.style.display = "none";
contentFinish.style.display = "none";

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

let tempoLimite = 0; // em segundos
let tempoRestante = 0;

function startTimer() {
  tempoRestante = tempoLimite;
  updateTimerDisplay();
  totalScore = 0;
  pointsSpan.textContent = `Pontos: ${totalScore}`;
  timerInterval = setInterval(() => {
    tempoRestante--;
    updateTimerDisplay();
    if (tempoRestante <= 0) {
      stopTimer();
      finishTimeout();
    }
  }, 1000);
}

// Função auxiliar para exibir minutos e segundos
function updateTimerDisplay() {
  const min = Math.floor(tempoRestante / 60);
  const sec = tempoRestante % 60;
  timerSpan.textContent = `Tempo restante: ${min}min ${sec}s`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showDifficulty() {
  quizInicio.style.display = "flex";
  quizInicio.style.backgroundColor = "#01134c";
  selectDifficulty.style.display = "none";
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

function finishTimeout() {
  pointsSpan.textContent = "";
  textFinish.innerHTML = `Tempo esgotado!<br>Você acertou ${questionsCorrect} de ${filteredQuestions.length}<br>Pontuação: ${totalScore}`;
  content.style.display = "none";
  contentFinish.style.display = "flex";
}

document.querySelectorAll(".select-difficulty button").forEach((btn) => {
  btn.onclick = (e) => {
    const level = e.target.getAttribute("data-difficulty");
    let questionsByLevel = questions.filter((q) => q.difficulty === level);
    if (questionsByLevel.length === 0) {
      alert("Não há perguntas para este nível.");
      return;
    }
    // Para maratona, sorteia 30 questões, para os outros níveis, 10
    const quantidade = (level === "maratona") ? 30 : 10;
    filteredQuestions = shuffle([...questionsByLevel]).slice(0, quantidade);
    currentIndex = 0;
    questionsCorrect = 0;
    totalScore = 0;

    // Define o tempo limite por dificuldade
    if (level === "facil") tempoLimite = 120;         // 2 minutos
    else if (level === "medio") tempoLimite = 180;    // 3 minutos
    else if (level === "dificil") tempoLimite = 240;  // 4 minutos
    else if (level === "maratona") tempoLimite = 600; // 10 minutos
    else tempoLimite = 0; // sem limite

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
  let score = Math.max(100 - timeSpent * 1, 10);

  // Se for maratona, cada questão vale 1/3 dos pontos
  const level = filteredQuestions[0]?.difficulty;
  if (level === "maratona") {
    score = Math.floor(score / 3);
    if (score < 3) score = 3; // mínimo de 3 pontos por questão
  }

  let pontosAntes = totalScore;
  if (isCorrect) {
    questionsCorrect++;
    totalScore += score;
    // Limita a pontuação máxima em 1000 para maratona
    if (level === "maratona" && totalScore > 1000) {
      totalScore = 1000;
    }
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
  textFinish.innerHTML = `${timerSpan.textContent}<br>você acertou ${questionsCorrect} de ${filteredQuestions.length}<br>Pontuação: ${totalScore}`;
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

  // Embaralha as respostas antes de exibir
  const shuffledAnswers = shuffle([...item.answers]);

  shuffledAnswers.forEach((answer) => {
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

// Ao clicar em "Iniciar", mostra a escolha de dificuldade
document.querySelector('.btn-iniciar-quiz').onclick = function() {
  quizInicio.style.display = 'none';
  selectDifficulty.style.display = 'flex';
  content.style.display = "none";
  contentFinish.style.display = "none";
};

