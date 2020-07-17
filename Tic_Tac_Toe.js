(function() {
  "use strict";
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
      if (checkSuccess()) {
        model.endGameStatus = WIN;
      } else if (checkTie()) {
        model.endGameStatus = TIE;
      }
      if (model.status == ONE_PLAYER) {
        let avaliableCheckers = [];
        for (let i = 0; i < model.checkerStatus.length; i++) {
          if (model.checkerStatus[i] == 0) {
            avaliableCheckers.push(i);
          }
        }
        let choice  = Math.floor(Math.random() * avaliableCheckers.length);
        model.checkerStatus[avaliableCheckers[choice]] = 2;
        model.turn = 1;
      }
      render();
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
        if (model.turn == 1) {
          id("turn").innerText = "Please make a move."
        }
      } else {
        if (model.turn == 1) {
          id("turn").innerText = "Player 1, please make a move."
        } else {
          id("turn").innerText = "Player 2, please make a move."
        }
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
          id("outcome").innerText = "You won!";
        } else {
          id("outcome").innerText = "You lost!";
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