export function parseUniqueQuestions(text) {
  const lines = text.split('\n');
  const questions = [];
  const answers = [];

  let currentQuestion = '';
  let currentAnswers = [];

  function addQuestionIfUnique() {
    if (!currentQuestion) return;
    if (questions.includes(currentQuestion)) return;
    questions.push(currentQuestion);
    answers.push([...currentAnswers]);
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      addQuestionIfUnique();
      currentQuestion = trimmed.replace(/^([#?]{1,5})\s*/, '').trim();
      currentAnswers = [];
    } else if (trimmed.startsWith('?')) {
      currentAnswers.push(trimmed.replace(/^([#?]{1,5})\s*/, '').trim());
    } else {
      if (currentQuestion) currentQuestion += ' ' + trimmed;
    }
  }

  addQuestionIfUnique();

  return { questions, answers };
}

export function prepareQuestions(data) {
  const { questions, answers } = data;

  // Создаём массив пар [вопрос, ответы]
  const questionPairs = questions.map((q, i) => [q, answers[i]]);

  shuffleArray(questionPairs);

  // Преобразуем в нужный формат с перемешанными ответами и правильным индексом
  const prepared = questionPairs.map(([question, answerList]) => {
    const shuffledAnswers = [...answerList];
    const correctAnswer = shuffledAnswers[0];
    shuffleArray(shuffledAnswers);

    const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

    return {
      question,
      answers: shuffledAnswers,
      correctIndex: newCorrectIndex
    };
  });

  return prepared;
}

// Простой shuffle Fisher-Yates
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

