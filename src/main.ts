import '../styles/style.scss';

const startButton = document.getElementById('startButton')!;
const questionContainer = document.getElementById('questionContainer')!;
const scoreBox = document.getElementById('scoreBox')!;

let currentQuestionIndex = 0;
let score = 0;

//interface for questions object
interface Question {
  questionText: string;
  answerChoices: string[];
  correctAnswerIndex: number;
}

//question data
const questions: Question[] = [
  {
    questionText: 'What is the capitol of France?',
    answerChoices: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswerIndex: 1,
  },
  {
    questionText: 'What is the largest planet in our solar system?',
    answerChoices: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswerIndex: 2,
  },
  {
    questionText: 'What is the largest continent on the planet?',
    answerChoices: ['Australia', 'South America', 'Asia', 'Africa'],
    correctAnswerIndex: 2,
  },
  {
    questionText:
      '"The Da Vinci Code" opens with a murder in which famous museum?',
    answerChoices: ['The Getty', 'Rijksmuseum', 'Vatican Museum', 'The Louvre'],
    correctAnswerIndex: 3,
  },
  {
    questionText:
      'How old was Queen Elizabeth II when she was crowned the Queen of England?',
    answerChoices: ['27', '33', '15', '42'],
    correctAnswerIndex: 0,
  },
  {
    questionText: 'What president was a licensed bartender?',
    answerChoices: [
      'Bill Clinton',
      'Abraham Lincoln',
      'Andrew Jackson',
      'Ronald Regan',
    ],
    correctAnswerIndex: 1,
  },
  {
    questionText:
      'Which Italian town is the setting for Shakespeares Romeo and Juliet?',
    answerChoices: ['Padua', 'Rome', 'Verona', 'Milan'],
    correctAnswerIndex: 2,
  },
  {
    questionText: 'How many floors does the Eiffel Tower have?',
    answerChoices: ['3', '0', '22', '17'],
    correctAnswerIndex: 0,
  },
  {
    questionText: "What is the Grinch's dog's name?",
    answerChoices: ['Jim', 'Max', 'Tom', 'Marvin'],
    correctAnswerIndex: 1,
  },
];

//function to display current question and its answer choices
function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    //all questions have been displayed
    questionContainer.textContent = 'Congratulations! You completed the game!';
    return;
  }

  //display the current text as regular text
  const questionElement = document.createElement('div');
  questionElement.textContent = currentQuestion.questionText;
  questionElement.id = 'questionEl';
  questionContainer.appendChild(questionElement);

  //display the answer choices as buttons
  for (let j = 0; j < currentQuestion.answerChoices.length; j++) {
    const answerButton = document.createElement('button');
    answerButton.textContent = currentQuestion.answerChoices[j];
    answerButton.id = 'answerButton';
    questionContainer.appendChild(answerButton);

    //add an event listener to handle the click of the answer buttons
    answerButton.addEventListener('click', () => {
      if (j === currentQuestion.correctAnswerIndex) {
        console.log('Correct answer selected!');
        answerButton.style.backgroundColor = 'green';
        score += 100;
        scoreBox.textContent = `Score: ${score}`;
      } else {
        console.log('Wrong answer selected!');
        answerButton.style.backgroundColor = 'red';
      }

      //disable all answer buttons temporarily to prevent multiple clicks
      const allAnswerButtons =
        document.querySelectorAll<HTMLButtonElement>('#answerButton');
      allAnswerButtons.forEach((button) => {
        button.disabled = true;
      });

      //wait 1 second before moving to the next question
      setTimeout(() => {
        //re-enable buttons
        allAnswerButtons.forEach((button) => {
          button.disabled = false;
        });

        //remove the current question and answer choices from the container
        questionContainer.innerHTML = '';

        //move on to the next question
        currentQuestionIndex++;
        showQuestion();
      }, 1500); //1.5 seconds
    });
  }
}

function startGame() {
  startButton.style.display = 'none';
  showQuestion();

  //show score box when the game is started
  scoreBox.style.display = 'block';
}

startButton.addEventListener('click', startGame);
