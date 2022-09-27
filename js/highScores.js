// localStorage bestScore list

const MAX_HIGH_SCORES = 5;
// var CURR_SCORE = gGame.secsPassed
// var CURR_SCORE = gGame.isOn ? gGame.secsPassed : ' null';

// const NAME = prompt(
//   'We want to add you to the score list:) Please enter your name:'
// );

const easyHighScoresList = document.getElementById('easyHighScoresList');
const mediumHighScoresList = document.getElementById('mediumHighScoresList');
const hardHighScoresList = document.getElementById('hardHighScoresList');

const easyHighScores = JSON.parse(localStorage.getItem('easyHighScores')) || [];
const mediumHighScores =
  JSON.parse(localStorage.getItem('mediumHighScores')) || [];
const hardHighScores = JSON.parse(localStorage.getItem('hardHighScores')) || [];

// var level;

// switch (gLevel.SIZE) {
//   case 4:
//     level = 'easy';
//     break;
//   case 8:
//     level = 'medium';
//     break;
//   case 12:
//     level = 'hard';
//     break;
// }

// const SCORE = {
//   level: level,
//   score: gGame.secsPassed,
//   name: NAME,
// };

function saveScore(gGame) {
  var name = prompt(
    'We want to add you to the score list:) Please enter your name:'
  );

  var currUserScore = {
    level: gLevel.SIZE,
    score: gGame.secsPassed,
    name: name,
  };
  if (gLevel.SIZE === 4) {
    easyHighScores.push(currUserScore);
    easyHighScores.sort((a, b) => b.score - a.score);
    easyHighScores.splice(5);
    localStorage.setItem('easyHighScores', JSON.stringify(easyHighScores));
    easyHighScoresList.innerHTML = easyHighScores
      .map((SCORE) => {
        return `<li class="high-score"> ${SCORE.name} - ${SCORE.score}</li>`;
      })
      .join('');
  } else if (gLevel.SIZE === 8) {
    mediumHighScores.push(currUserScore);
    mediumHighScores.sort((a, b) => b.score - a.score);
    mediumHighScores.splice(5);
    localStorage.setItem('mediumHighScores', JSON.stringify(mediumHighScores));

    mediumHighScoresList.innerHTML = mediumHighScores
      .map((SCORE) => {
        return `<li class="high-score"> ${SCORE.name} - ${SCORE.score}</li>`;
      })
      .join('');
  } else if (gLevel.SIZE === 12) {
    hardHighScores.push(currUserScore);
    hardHighScores.sort((a, b) => b.score - a.score);
    hardHighScores.splice(5);
    localStorage.setItem('hardHighScores', JSON.stringify(hardHighScores));
    hardHighScoresList.innerHTML = hardHighScores
      .map((SCORE) => {
        return `<li class="high-score"> ${SCORE.name} - ${SCORE.score}</li>`;
      })
      .join('');
  }
}
