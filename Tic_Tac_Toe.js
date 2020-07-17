(function() {
  "use strict";

  window.addEventListener("load", init);

  const  CHECKER_NUM = 9;
  let steps = 0;
  let inGame = true; // keep track of the status of the game
  let avaliableCheckers = [];

  function init() {
    setUpView();
    id("start").addEventListener("click", setUpGameboard);
    id("playagain").addEventListener("click", setUpView);
  }

  function setUpView() {
    clearGameboard();
    id("outcome").style.display = "none";
    id("playagain").style.display = "none";
    id("choosePlayer").style.display = "block";
    id("turn").style.display = "none";
  }

  function setUpGameboard() {
    clearIntro();
    inGame = true;
    let row = 0;
    let col = 0;
    let index = 1;
    for (let i = 0; i < CHECKER_NUM; i++) {
      let checker = document.createElement("div");
      checker.classList.add("checker");
      checker.id = "checker" + index;
      index++;
      checker.style.left = col * 100 + "px";
      checker.style.top = row * 100 + "px";
      col++;
      if (col == 3) {
        col = 0;
      }
      if (i % 3 == 2) {
        row++;
      }
      id("gameboard").appendChild(checker);
      avaliableCheckers.push(checker);
    }
    assignPlayer();
  }

  function clearIntro() {
    id("choosePlayer").style.display = "none";
  }

  function assignPlayer() {
    let choice = qs('input[name="player"]:checked').value;
    id("turn").style.display = "block";
    let checkers = qsa(".checker");
    if (choice == "friend") {
      id("turn").innerText = "Player 1, please make a move.";
      for (let i = 0; i < checkers.length; i++) {
        checkers[i].addEventListener("click", move);
      }
    } else {
      id("turn").innerText = "Please make a move.";
      for (let i = 0; i < checkers.length; i++) {
        checkers[i].addEventListener("click", playWithComp);
      }
    }
  }

  function playWithComp() {
    if (inGame && this.innerText == "") {
      steps++;
      let index = avaliableCheckers.indexOf(this);
      avaliableCheckers.splice(index, 1);
      this.innerText = "O";
      if (checkSuccess()) {
        endGame("You won!");
      } else if (checkTie()) {
        endGame("You achieved a tie.");
      } else {
        compMove();
      }
    }
  }

  function clearGameboard() {
    id("gameboard").innerHTML = "";
    steps = 0;
  }

  function compMove() {
    steps++;
    let size = avaliableCheckers.length;
    let choice = Math.floor(Math.random() * size);
    let checker = avaliableCheckers[choice];
    checker.innerText = "X";
    avaliableCheckers.splice(choice, 1);
    if (checkSuccess()) {
      endGame("You lost!");
    } else if (checkTie()) {
      endGame("You achieved a tie.");
    } else {
      id("turn").innerText = "Please make a move.";
    }
  }

  function move() {
    // only make the move when the spot is still avaliable and game is not ended
    if (inGame && this.innerText == "") {
      steps++;
      let index = avaliableCheckers.indexOf(this);
      avaliableCheckers.splice(index, 1);
      if (steps % 2 == 0) {
        this.innerText = "X";
      } else {
        this.innerText = "O";
      }
      if (checkSuccess()) {
        let player = steps % 2;
        let msg = "";
        if (player == 1) {
          msg = "Player 1 won!";
        } else {
          msg = "Player 2 won!";
        }
        endGame(msg);
      } else if (checkTie()) {
        endGame("You achieved a tie.");
      } else {
        id("turn").innerText = "Player " + (steps % 2 + 1) + ", please make a move.";
      }
    }
  }

  function checkSuccess() {
    return checkHorizontal() || checkVertical() || checkDiagnol();
  }

  function checkTie() {
    return avaliableCheckers.length == 0;
  }

  function checkHorizontal() {
    let row = 3;
    for (let i = 0; i < row; i++) {
      if (id("checker" + (i * 3 + 1)).innerText == "") {
        continue;
      }
      if (id("checker" + (i * 3 + 1)).innerText == id("checker" + (i * 3 + 2)).innerText &&
          id("checker" + (i * 3 + 2)).innerText == id("checker" + (i * 3 + 3)).innerText) {
        return true;
      }
    }
    return false;
  }

  function checkVertical() {
    let col = 3;
    for (let i = 1; i <= col; i++) {
      if (id("checker" + i).innerText == "") {
        continue;
      }
      if (id("checker" + i).innerText == id("checker" + (i + 3)).innerText &&
          id("checker" + (i + 3)).innerText == id("checker" + (i + 6)).innerText) {
        return true;
      }
    }
    return false;
  }

  function checkDiagnol() {
    if (id("checker1").innerText != "") {
      if (id("checker1").innerText == id("checker5").innerText &&
         id("checker5").innerText == id("checker9").innerText) {
        return true;
      }
    }
    if (id("checker3").innerText != "") {
      if (id("checker3").innerText == id("checker5").innerText &&
          id("checker5").innerText == id("checker7").innerText) {
        return true;
      }
    }
    return false;
  }

  function endGame(msg) {
    id("turn").style.display = "none";
    id("outcome").style.display = "block";
    id("outcome").innerText = msg;
    id("playagain").style.display = "inline-block";
    id("turn").style.display = "none";
    avaliableCheckers = [];
    inGame = false;
  }

  /*----------------------------- Helper Functions ------------------------- */
  function id(query) {
    return document.getElementById(query);
  }

  function qs(query) {
    return document.querySelector(query);
  }

  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();