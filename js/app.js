import {
  parseUniqueQuestions,
  prepareQuestions
} from './parser.js';

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const output = document.getElementById('output');
const info = document.getElementById('info');
const randomBtn = document.getElementById('randomBtn');
const loadBasicBtn = document.getElementById('loadPresetBtn');

let loadedData = null; // Тут вопросы и ответы

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('hover');
});

dropzone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropzone.classList.remove('hover');
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('hover');
  if (e.dataTransfer.files.length) {
    readFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    readFile(fileInput.files[0]);
  }
});

randomBtn.addEventListener('click', () => {
  if (!loadedData) return;

  const { questions, answers } = loadedData;
  const total = questions.length;
  const count = Math.min(5, total);

  // Выбираем случайные индексы без повторов
  const indices = [];
  while (indices.length < count) {
    const r = Math.floor(Math.random() * total);
    if (!indices.includes(r)) indices.push(r);
  }

  const selectedQuestions = indices.map(i => questions[i]);
  const selectedAnswers = indices.map(i => answers[i]);

  // Перемешиваем вопросы и ответы, обновляем индекс правильного
  const prepared = prepareQuestions({ questions: selectedQuestions, answers: selectedAnswers });

  localStorage.setItem('quizData', JSON.stringify(prepared));
  window.location.href = 'test.html';
});

loadBasicBtn.addEventListener('click', () => {
  fetch('assets/preset_test.txt')
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки');
      return response.blob();
    })
    .then(blob => {
      const file = new File([blob], 'preset_test.txt', { type: 'text/plain' });
      readFile(file);
    })
    .catch(error => {
      output.textContent = `Ошибка: ${error.message}`;
    });
});


function readFile(file) {
  if (!file.type.match('text.*')) {
    output.textContent = 'Ошибка: поддерживаются только текстовые файлы (.txt)';
    info.textContent = '';
    randomBtn.style.display = 'none';
    loadedData = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const result = parseUniqueQuestions(text);

    loadedData = result;

    const totalQuestions = result.questions.length;
    info.textContent = `Всего уникальных вопросов: ${totalQuestions}`;
    randomBtn.style.display = totalQuestions > 0 ? 'inline-block' : 'none';
  };
  reader.onerror = () => {
    output.textContent = 'Ошибка чтения файла';
    info.textContent = '';
    randomBtn.style.display = 'none';
    loadedData = null;
  };

  reader.readAsText(file);
}