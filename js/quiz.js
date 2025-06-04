let quizData = null;
let currentIndex = 0;
let score = 0;
let canAnswer = true;

window.onload = () => {
  const data = localStorage.getItem('quizData');
  if (!data) {
    alert('Нет данных для теста. Вернитесь на предыдущую страницу.');
    window.location.href = 'example.html';
    return;
  }

  quizData = JSON.parse(data);
  showQuestion();
};

function showQuestion() {
  canAnswer = true;
  const container = document.getElementById('quizContainer');
  container.innerHTML = '';

  if (currentIndex >= quizData.length) {
    finishQuiz();
    return;
  }

  const q = quizData[currentIndex];

  const questionElem = document.createElement('div');
  questionElem.className = 'question';
  questionElem.textContent = `Вопрос ${currentIndex + 1}: ${q.question}`;
  container.appendChild(questionElem);

  const optionsList = document.createElement('ul');
  optionsList.className = 'options';

  q.answers.forEach((answer, index) => {
    const optionItem = document.createElement('li');
    optionItem.className = 'option';
    optionItem.textContent = answer;
    optionItem.onclick = () => handleAnswer(index, optionItem);
    optionsList.appendChild(optionItem);
  });

  container.appendChild(optionsList);

  const progress = document.createElement('div');
  progress.id = 'progress';
  progress.textContent = `Вопрос ${currentIndex + 1} из ${quizData.length}`;
  container.appendChild(progress);
}

function handleAnswer(selectedIndex, optionElement) {
  if (!canAnswer) return; // блокируем повторный клик

  canAnswer = false;

  const correctIndex = quizData[currentIndex].correctAnswerIndex;

  // Подсветка правильного и выбранного ответов
  const options = document.querySelectorAll('.option');

  options.forEach((opt, i) => {
    if (i === correctIndex) {
      opt.classList.add('correct');
    }
    if (i === selectedIndex && selectedIndex !== correctIndex) {
      opt.classList.add('wrong');
    }
    // Блок кликов
    opt.style.pointerEvents = 'none';
  });

  if (selectedIndex === correctIndex) {
    score++;
  }

  // Переход к следующему вопросу
  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 800);
}

function finishQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
      <div id="result">Тест завершён! Ваш результат: ${score} из ${quizData.length}</div>
      <div class="finish-buttons">
        <button id="restartButton" class="button">Пройти снова</button>
        <button id="returnButton" class="button">Вернуться</button>
      </div>
    `;
  
    document.getElementById('restartButton').onclick = () => {
      currentIndex = 0;
      score = 0;
      showQuestion();
    };
  
    document.getElementById('returnButton').onclick = () => {
      window.location.href = 'example.html';
    };
  }
  
