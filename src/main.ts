import '../styles/style.scss';
import * as he from 'he';

const startButton = document.getElementById('startButton')!;
const questionContainer = document.getElementById('questionContainer')!;
const scoreBox = document.getElementById('scoreBox')!;
const apiUrl = 'https://opentdb.com/api.php?amount=10&difficulty=easy';
const mediumDifficultyApiUrl =
  'https://opentdb.com/api.php?amount=10&difficulty=medium';

let currentQuestionIndex = 0;
let score = 0;

//interface for questions object
interface Question {
  questionText: string;
  answerChoices: string[];
  correctAnswerIndex: number;
}

//empty array for questions
let questions: Question[] = [];

//parse quotes correctly
function decodeHTMLEntities(text: string): string {
  return he.decode(text);
}

//fetch questions from API
async function fetchQuestionsFromAPI(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results.map((result: any) => {
      const decodeQuestionText = decodeHTMLEntities(result.question); //parse question text
      const decodedAnswerChoices =
        result.incorrect_answers.map(decodeHTMLEntities);
      const decodedCorrectAnswer = decodeHTMLEntities(result.correct_answer);

      const question: Question = {
        questionText: decodeQuestionText,
        answerChoices: [...decodedAnswerChoices, decodedCorrectAnswer],
        correctAnswerIndex: result.incorrect_answers.length,
      };
      return question;
    });
    startGame();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

//medium difficulty questions
async function fetchMediumDifficultyQuestions() {
  try {
    const response = await fetch(mediumDifficultyApiUrl);
    const data = await response.json();
    const mediumDifficultyQuestions: Question[] = data.results.map(
      (result: any) => {
        const decodeQuestionText = decodeHTMLEntities(result.question);
        const decodedAnswerChoices =
          result.incorrect_answers.map(decodeHTMLEntities);
        const decodedCorrectAnswer = decodeHTMLEntities(result.correct_answer);

        const question: Question = {
          questionText: decodeQuestionText,
          answerChoices: [...decodedAnswerChoices, decodedCorrectAnswer],
          correctAnswerIndex: result.incorrect_answers.length,
        };
        return question;
      }
    );
    return mediumDifficultyQuestions;
  } catch (error) {
    console.error('Error fetching medium difficulty questions:', error);
    return []; //return an empty array if there's an error fetching questions
  }
}

//function to display current question and its answer choices
async function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    //all questions have been displayed
    if (score >= 600) {
      questionContainer.textContent =
        'Congrats! You move on to the next round!';
      setTimeout(async () => {
        questionContainer.textContent = '';
        const mediumDifficultyQuestions =
          await fetchMediumDifficultyQuestions();
        questions = [...mediumDifficultyQuestions, ...questions];
        console.log('medium questions');
        currentQuestionIndex = 0; //reset the question index for the new set of questions
        showQuestion(); //start displaying the second set of questions
      }, 5000); //display message for 5 seconds
    } else {
      questionContainer.textContent = `Better luck next time! Your final score is: ${score}`;
    }
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

        //when the incorrect answer is selected the correct answer will show as green
        const correctAnswerButton =
          document.querySelectorAll<HTMLButtonElement>('#answerButton')[
            currentQuestion.correctAnswerIndex
          ];
        correctAnswerButton.style.backgroundColor = 'green';
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

//event listener that starts the game when the button is clicked
startButton.addEventListener('click', () => {
  fetchQuestionsFromAPI(apiUrl); //questions are fetched after button is clicked
  console.log('easy questions');
});
