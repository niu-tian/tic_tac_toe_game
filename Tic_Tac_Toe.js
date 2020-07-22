(function() {
  "use strict";
  const AI_MODE = 1 // 0 -> random, 1 -> smart
  const CHECKER_NUM = 9;

  const INTRO = 0;
  const ONE_PLAYER = 1;
  const TWO_PLAYER = 2;

  const NOT_END = 0;
  const WIN = 1;
  const TIE = 2;


  /* ------------------------------ Model -------------------------------- */
  class DataModel {
    constructor() {
      this.reset();
      this.gameBoardSetup = false;
    }

    reset() {
      this.status = INTRO;
      this.checkerStatus = new Array(CHECKER_NUM).fill(0); // 0 -> blank, 1 -> O, 2 -> X
      this.turn = 1; // 1 -> player 1,  2 -> player 2
      this.endGameStatus = NOT_END;
    }
  }

  /* ---------------------------- Controller ------------------------------ */

  window.addEventListener("load", init);

  let model = new DataModel();

  function init() {
    render();
    id("start").addEventListener("click", changeModel);
    id("playagain").addEventListener("click", resetModel);
  }

  function changeModel() {
    let choice = qs('input[name="player"]:checked').value;
    if (choice == "friend") {
      model.status = TWO_PLAYER;
    } else {
      model.status = ONE_PLAYER;
    }
    render();
    model.gameBoardSetup = true;
  }

  function resetModel() {
    model.reset();
    render();
  }

  function move(index) {
    // only make the move when the spot is still avaliable and game is not ended
    if (model.endGameStatus == NOT_END && (model.status == ONE_PLAYER ||
        model.status == TWO_PLAYER) && model.checkerStatus[index] == 0) {
      if (model.turn == 1) {
        model.checkerStatus[index] = 1;
        model.turn = 2;
      } else {
        model.checkerStatus[index] = 2;
        model.turn = 1;
      }
      updateGameStatus();
      if (model.endGameStatus == NOT_END && model.status == ONE_PLAYER) {
        switch(AI_MODE) {
          case 0:
            aiMoveRandom();
            break;
          case 1:
            aiMove();
            break;
          default:
            aiMoveRandom();
        }
        model.turn = 1;
        updateGameStatus();
      }
      render();
    }
  }

  function validate(zeros, ones, twos) {
    for (let i = 0; i < zeros.length; i++) {
      if (model.checkerStatus[zeros[i]] != 0) return false;
    }
    for (let i = 0; i < ones.length; i++) {
      if (model.checkerStatus[ones[i]] != 1) return false;
    }
    for (let i = 0; i < twos.length; i++) {
      if (model.checkerStatus[twos[i]] != 2) return false;
    }
    return true;
  }

  function notOccupiedByO(index) {
    for (let i = 0; i < index.length; i++) {
      if (model.checkerStatus[index[i]] == 1) {
        return false;
      }
    }
    return true;
  }

  function aiMove() {
    // check if any 2 'X''s already form a row/column/diagnol
    for (let i = 0; i < model.checkerStatus.length; i++) {
      if (i % 3 == 0) {
        if (validate([i], [], [i + 1, i + 2])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 1], [], [i, i+ 2])) {
          model.checkerStatus[i + 1] = 2;
          return;
        }
        if (validate([i + 2], [], [i, i+ 1])) {
          model.checkerStatus[i + 2] = 2;
          return;
        }
      }
      if (i < 3) {
        if (validate([i], [], [i + 3, i+ 6])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 3], [], [i, i+ 6])) {
          model.checkerStatus[i + 3] = 2;
          return;
        }
        if (validate([i + 6], [], [i, i+ 3])) {
          model.checkerStatus[i + 6] = 2;
          return;
        }
      }
      if (i == 0) {
        if (validate([i], [], [i + 4, i+ 8])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 4], [], [i, i+ 8])) {
          model.checkerStatus[i + 4] = 2;
          return;
        }
        if (validate([i + 8], [], [i, i+ 4])) {
          model.checkerStatus[i + 8] = 2;
          return;
        }
      }
      if (i == 2) {
        if (validate([i], [], [i + 2, i+ 4])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 2], [], [i, i+ 4])) {
          model.checkerStatus[i + 2] = 2;
          return;
        }
        if (validate([i + 4], [], [i, i+ 2])) {
          model.checkerStatus[i + 4] = 2;
          return;
        }
      }
    }
    // check if any 2 'O''s already form a row/column/diagnol
    for (let i = 0; i < model.checkerStatus.length; i++) {
      if (i % 3 == 0) {
        if (validate([i], [i + 1, i + 2], [])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 1], [i, i + 2], [])) {
          model.checkerStatus[i + 1] = 2;
          return;
        }
        if (validate([i + 2], [i, i + 1], [])) {
          model.checkerStatus[i + 2] = 2;
          return;
        }
      }
      if (i < 3) {
        if (validate([i], [i + 3, i + 6], [])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 3], [i, i + 6], [])) {
          model.checkerStatus[i + 3] = 2;
          return;
        }
        if (validate([i + 6], [i, i + 3], [])) {
          model.checkerStatus[i + 6] = 2;
          return;
        }
      }
      if (i == 0) {
        if (validate([i], [i + 4, i + 8], [])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 4], [i, i + 8], [])) {
          model.checkerStatus[i + 4] = 2;
          return;
        }
        if (validate([i + 8], [i, i + 4], [])) {
          model.checkerStatus[i + 8] = 2;
          return;
        }
      }
      if (i == 2) {
        if (validate([i], [i + 2, i + 4], [])) {
          model.checkerStatus[i] = 2;
          return;
        }
        if (validate([i + 2], [i, i + 4], [])) {
          model.checkerStatus[i + 2] = 2;
          return;
        }
        if (validate([i + 4], [i, i + 2], [])) {
          model.checkerStatus[i + 4] = 2;
          return;
        }
      }
    }
    // check all avaliable spots, choose the one with largest probability to win
    let choice = -1;
    let maxProb = -1;
    for (let i = 0; i < model.checkerStatus.length; i++) {
      if (model.checkerStatus[i] == 0) {
        let prob = 0;
        if (i % 3 == 0) {
          if (notOccupiedByO([i + 1, i + 2])) {
            prob++;
          }
        }
        if (i % 3 == 1) {
          if (notOccupiedByO([i - 1, i + 1])) {
            prob++;
          }
        }
        if (i % 3 == 2) {
          if (notOccupiedByO([i - 1, i - 2])) {
            prob++;
          }
        }
        if (Math.floor(i / 3) == 0) {
          if (notOccupiedByO([i + 3, i + 6])) {
            prob++;
          }
        }
        if (Math.floor(i / 3) == 1) {
          if (notOccupiedByO([i - 3, i + 3])) {
            prob++;
          }
        }
        if (Math.floor(i / 3) == 2) {
          if (notOccupiedByO([i - 3, i - 6])) {
            prob++;
          }
        }
        if (i == 0) {
          if (notOccupiedByO([i + 4, i + 8])) {
            prob++;
          }
        }
        if (i == 4) {
          if (notOccupiedByO([i - 4, i + 4])) {
            prob++;
          }
          if (notOccupiedByO([i - 2, i + 2])) {
            prob++;
          }
        }
        if (i == 8) {
          if (notOccupiedByO([i - 4, i - 8])) {
            prob++;
          }
        }
        if (i == 2) {
          if (notOccupiedByO([i + 2, i + 4])) {
            prob++;
          }
        }
        if (i == 6) {
          if (notOccupiedByO([i - 2, i - 4])) {
            prob++;
          }
        }
        if (prob > maxProb) {
          maxProb = prob;
          choice = i;
        }
      }
    }
    model.checkerStatus[choice] = 2;
  }

  function aiMoveRandom() {
    let avaliableCheckers = [];
    for (let i = 0; i < model.checkerStatus.length; i++) {
      if (model.checkerStatus[i] == 0) {
        avaliableCheckers.push(i);
      }
    }
    let choice  = Math.floor(Math.random() * avaliableCheckers.length);
    model.checkerStatus[avaliableCheckers[choice]] = 2;
  }

  function updateGameStatus() {
    if (checkSuccess()) {
      model.endGameStatus = WIN;
    } else if (checkTie()) {
      model.endGameStatus = TIE;
    }
  }

  function checkSuccess() {
    return checkHorizontal() || checkVertical() || checkDiagnol();
  }

  function checkTie() {
    for (let i = 0; i < model.checkerStatus.length; i++) {
      if (model.checkerStatus[i] == 0) {
        return false;
      }
    }
    return true;
  }

  function checkHorizontal() {
    for (let i = 0; i < model.checkerStatus.length; i = i + 3) {
      if (model.checkerStatus[i] == 0) {
        continue;
      }
      if (model.checkerStatus[i] == model.checkerStatus[i + 1] &&
          model.checkerStatus[i + 1] == model.checkerStatus[i + 2]) {
        return true;
      }
    }
    return false;
  }

  function checkVertical() {
    for (let i = 0; i < 3; i++) {
      if (model.checkerStatus[i] == 0) {
        continue;
      }
      if (model.checkerStatus[i] == model.checkerStatus[i + 3] &&
          model.checkerStatus[i + 3] == model.checkerStatus[i + 6]) {
        return true;
      }
    }
    return false;
  }

  function checkDiagnol() {
    if (model.checkerStatus[0] != 0) {
      if (model.checkerStatus[0] == model.checkerStatus[4] &&
          model.checkerStatus[4] == model.checkerStatus[8]) {
            return true;
      }
    }
    if (model.checkerStatus[2] != 0) {
      if (model.checkerStatus[2] == model.checkerStatus[4] &&
          model.checkerStatus[4] == model.checkerStatus[6]) {
          return true;
      }
    }
    return false;
  }

  /* -------------------------------- View ---------------------------------- */
  function render() {
    displayIntro();
    displayGameBoard();
    displayTurn();
    displayOutcome();
  }

  function displayIntro() {
    if (model.status == INTRO) {
      id("chooseplayer").style.display = "block";
    } else {
      id("chooseplayer").style.display = "none";
    }
  }

  function displayGameBoard() {
    if (model.status == INTRO) {
      id("gameboard").style.display = "none";
    } else {
      id("gameboard").style.display = "inline-block";
      if (!model.gameBoardSetup) {
        setUpGameboard();
      }
      let checkers = qsa(".checker");
      for (let i = 0; i < model.checkerStatus.length; i++) {
        if (model.checkerStatus[i] == 1) {
          checkers[i].innerText = "O";
        } else if (model.checkerStatus[i] == 2) {
          checkers[i].innerText = "X";
        } else {
          checkers[i].innerText = "";
        }
      }
    }
  }

  function displayTurn() {
    if (model.status == ONE_PLAYER || model.status == TWO_PLAYER) {
      id("turn").style.display = "block";
      if (model.status == ONE_PLAYER) {
        id("turn").innerText = "Please make a move."
      } else {
        id("turn").innerText = "Player " + model.turn + ", please make a move."
      }
    } else {
      id("turn").style.display = "none";
    }
  }

  function displayOutcome() {
    if (model.endGameStatus == NOT_END) {
      id("playagain").style.display = "none";
      id("outcome").style.display = "none";
    } else {
      id("outcome").style.display = "block";
      id("playagain").style.display = "inline-block";
      id("turn").style.display = "none";
      if (model.endGameStatus == TIE) {
        id("outcome").innerText = "You achieved a tie.";
      } else if (model.status == ONE_PLAYER) {
        if (model.turn == 1) {
          id("outcome").innerText = "You lost!";
        } else {
          id("outcome").innerText = "You won!";
        }
      } else {
        if (model.turn == 1) {
          id("outcome").innerText = "Player 2 won!";
        } else {
          id("outcome").innerText = "Player 1 won!";
        }
      }
    }
  }

  function setUpGameboard() {
    for (let i = 0; i < CHECKER_NUM; i++) {
      let checker = document.createElement("div");
      checker.classList.add("checker");
      checker.style.left = (i % 3) * 100 + "px";
      checker.style.top = Math.floor(i / 3) * 100 + "px";
      id("gameboard").appendChild(checker);
    }
    let checkers = qsa(".checker");
    for (let i = 0; i < checkers.length; i++) {
      checkers[i].addEventListener("click", move.bind(checkers[i], i));
    }
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