var container = document.querySelector("#main-container");
var countdown = 75;
var scoresList = [];
intervalID = null;

var placeIndex = 0;

// set questions up and put them in a list
const q1 = {
  question: "Commonly use data types DO NOT include: ",
  ansOptions: ['1. strings','2. booleans','3. alerts','4. numbers'],
  correct: '3',
}

const q2 = {
  question: "The condition in an if / else statement is enclosed within ______.",
  ansOptions: ['1. quotes','2. curly brackets','3. parentheses','4. square brackets'],
  correct: '3',
}

const q3 = {
  question: "Arrays in JavaScript can be used to store ______.",
  ansOptions: ['1. numbers and strings','2. other arrays','3. booleans','4. all of the above'],
  correct: '4',
}

var questionsList = [q1,q2,q3];

// clear everything in the main container (we do this a lot)
function clearMainContainer()
{
    container.innerHTML = "";
}

// Update the count down every 1 second
function timeCalc () {
  
  countdown -= 1;
  // Display the result in the top corner
  document.getElementById("time-value").innerHTML = countdown;

  // If the count down is finished, go to score screen
  if (countdown < 0) {
    clearInterval(intervalID);
    countdown = 0;
    document.getElementById("time-value").innerHTML = countdown;
    enterScore();
  }
}

// display the main intro screen with the start button and high scores button
function quizIntro () {
    placeIndex = 0;
    clearMainContainer();
    document.querySelector("#high-scores-link").classList.remove("hidden");
    document.querySelector("#time-text").hidden = false;
    document.querySelector("#time-value").hidden = false;

    var headerText = document.createElement('h1');
    var descText = document.createElement('p');
    var btn = document.createElement('button');

    headerText.innerText = "Coding Quiz Challenge";    
    descText.innerText = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";
    btn.innerHTML = "Start Quiz";
    btn.classList.add('button');
    btn.addEventListener("click", function() {
      countdown = 75;
      document.getElementById("time-value").innerHTML = countdown;
      intervalID = setInterval(timeCalc, 1000);
      quizQuestion(0);
    });
    
    container.appendChild(headerText);
    container.appendChild(descText);
    container.appendChild(btn);
}

// display a question with multiple choice options depending on the counter to keep track of where we are
function quizQuestion (qNumber) {
  placeIndex = qNumber + 1;
  clearMainContainer();
  var questionText = document.createElement('h1');
  var buttonDiv = document.createElement('div');
  var btn1 = document.createElement('button');
  var btn2 = document.createElement('button');
  var btn3 = document.createElement('button');
  var btn4 = document.createElement('button');

  questionText.innerText = questionsList[qNumber].question;
  btn1.innerHTML = questionsList[qNumber].ansOptions[0];
  btn1.name ='1';
  btn1.classList.add('button');
  btn2.innerHTML = questionsList[qNumber].ansOptions[1];
  btn2.name ='2';
  btn2.classList.add('button');
  btn3.innerHTML = questionsList[qNumber].ansOptions[2];
  btn3.name ='3';
  btn3.classList.add('button');
  btn4.innerHTML = questionsList[qNumber].ansOptions[3];
  btn4.name ='4';
  btn4.classList.add('button');

  buttonDiv.appendChild(btn1);
  buttonDiv.appendChild(btn2);
  buttonDiv.appendChild(btn3);
  buttonDiv.appendChild(btn4);

  // wrong answers subtract 10 seconds, correct answers don't, display next question or score input screen
  buttonDiv.addEventListener("click", function(event) {
    if (event.target.name === questionsList[qNumber].correct) {
      console.log('correct');
    } else {
      console.log('incorrect');
      countdown -= 10;
    }
    qNumber += 1;
    if (qNumber < questionsList.length) {
      quizQuestion(qNumber);
    } else {
      if (intervalID) {
        clearInterval(intervalID);        
        document.getElementById("time-value").innerHTML = countdown;
        enterScore();
      }
    }
  });

  container.appendChild(questionText);
  container.appendChild(buttonDiv);
}

// allow user to enter initials to pair with score and save it
function enterScore() {
  placeIndex = questionsList.length + 1
  clearMainContainer();
  var headerText = document.createElement('h1');
  var descText = document.createElement('p');
  var input = document.createElement("input");  
  var btn = document.createElement('button');
  var entryBoxLabel = document.createElement('label');

  input.type = "text";
  input.id = "initials"
  entryBoxLabel.htmlFor = 'initials';
  entryBoxLabel.appendChild(document.createTextNode('Enter Initials: '));
  headerText.innerText = "All Done!";    
  descText.innerText = ("Your final score is " + countdown + ".") ;
  btn.innerHTML = "Submit";
  btn.classList.add('button');

  // save score + initials on submit button click
  btn.addEventListener("click", function() {
    scoresList = JSON.parse(localStorage.getItem('scores')) || [];
    scoresList.push({initials: document.getElementById('initials').value, time: countdown});
    localStorage.setItem('scores', JSON.stringify(scoresList));
    placeIndex = 100;
    highScores(placeIndex);
  });
  
  container.appendChild(headerText);
  container.appendChild(descText);
  container.appendChild(entryBoxLabel);  
  container.appendChild(input);
  container.appendChild(btn);
}

// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function compare( a, b ) {
  if ( a.time > b.time ){
    return -1;
  }
  if ( a.time < b.time ){
    return 1;
  }
  return 0;
}

// display high scores list
function highScores(fromPlace) {
  clearMainContainer();
  var highScoreLink = document.querySelector("#high-scores-link");
  highScoreLink.classList.add("hidden");
  document.querySelector("#time-text").hidden = true;
  document.querySelector("#time-value").hidden = true;

  var headerText = document.createElement('h1');
  var back = document.createElement('button');
  var clearScores = document.createElement('button');

  headerText.innerText = "Highscores";
  container.appendChild(headerText);
  
  // load scores from local storage and parse and sort by score
  var scoresList = JSON.parse(localStorage.getItem('scores')) || [];
  scoresList.sort(compare);
  console.log(scoresList);
  for (var i = 0; i < scoresList.length; i++){
    var score = document.createElement('p');
    score.innerText = ((i+1) + '.' + scoresList[i].initials + ' - ' + scoresList[i].time);
    container.appendChild(score);
  }

  back.innerHTML = "Go Back";
  clearScores.innerHTML = "Clear Highscores";
  back.classList.add('button');
  clearScores.classList.add('button');
  clearScores.addEventListener("click", function() {
    localStorage.clear();
    highScores();
  });

  // back button goes to spot that user came from
  back.addEventListener("click", function() {
    // from here (shouldn't be an issue) or from start page
    if (fromPlace === 0 || fromPlace === 100) {
      countdown = 0;
      document.getElementById("time-value").innerHTML = countdown;
      quizIntro();
    }
    // from any given question
    else if (fromPlace <= questionsList.length) {      
      document.querySelector("#high-scores-link").classList.remove("hidden");
      document.querySelector("#time-text").hidden = false;
      document.querySelector("#time-value").hidden = false;
      intervalID = setInterval(timeCalc, 1000);
      quizQuestion(fromPlace - 1);
    }
    // from enter score page
    else {      
      document.querySelector("#high-scores-link").classList.remove("hidden");
      document.querySelector("#time-text").hidden = false;
      document.querySelector("#time-value").hidden = false;
      enterScore();
    }
  });
  
  container.appendChild(back);
  container.appendChild(clearScores);
}

// button to get to high scores page
document.querySelector("#high-scores-link").addEventListener("click", function() {  
  clearInterval(intervalID); 
  highScores(placeIndex);
});

// run start page on load
quizIntro();