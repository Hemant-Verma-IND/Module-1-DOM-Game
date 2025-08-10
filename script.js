document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const gameZone = document.getElementById("game-zone");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const userBox = document.getElementById("user-box");
  const leaderboardList = document.getElementById("leaderboard-list");
  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const tipsBtn = document.getElementById("tips-btn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const playerNameInput = document.getElementById("player-name-input");
  const modalButtons = document.getElementById("modal-buttons");
  const countdownOverlay = document.getElementById("countdown-overlay");
  const countdownText = document.getElementById("countdown-text");
  const sounds = {
    correct: document.getElementById("correct-sound"),
    wrong: document.getElementById("wrong-sound"),
    music: document.getElementById("bg-music"),
    countdown: document.getElementById("countdown-sound"),
    speak: document.getElementById('alien-speak-sound'),
  };

  let timer,
    score = 0,
    timeLimit = 0,
    levelStartTime = 0,
    totalTimeElapsed = 0;
  let currentLevel = 1,
    nextNumber = 1,
    leaderboard = [],
    playerName = "";
  let isGameActive = false,
    isAudioUnlocked = false;
  let hasSeenGuide = false; 

  const unlockAudioAndScreen = () => {
    if (!isAudioUnlocked) {
      Object.values(sounds).forEach((s) => {
        s.volume = 0;
        s.play().catch(() => {});
        s.pause();
        s.currentTime = 0;
      });
      sounds.music.volume = 0.3;
      sounds.correct.volume = 0.6;
      sounds.wrong.volume = 0.6;
      sounds.countdown.volume = 1.0;
      isAudioUnlocked = true;
    }
    if (document.fullscreenElement === null)
      body.requestFullscreen().catch((err) => console.log(err.message));
  };
  const playSound = (key) => {
    if (!isAudioUnlocked || !sounds[key]) return;
    sounds[key].currentTime = 0;
    sounds[key].play().catch((e) => console.error(e.message));
  };

  const showModal = (title, text, type) => {
    modalTitle.textContent = title;
    modalText.innerHTML = text;
    modal.style.display = "flex";
    playerNameInput.style.display = type === "name" ? "block" : "none";
    modalButtons.innerHTML = "";
    
    if (type === "name") {
        playerNameInput.focus();
        modalButtons.innerHTML = '<button id="modal-submit-btn">Login</button>';
        document.getElementById("modal-submit-btn").onclick = () => {
            unlockAudioAndScreen();
            playerName = playerNameInput.value.trim() || "Agent";
            userBox.textContent = `V.I. Hello, ${playerName}`;
            const storyText = `In the year 2099, our core training simulation, the 'Sprint A.I.', has gone rogue. It's now a chaotic test of reflex and nerve.<br><br>Your mission is to infiltrate the system and prove human superiority. Stabilize the grid by neutralizing the numbered targets in perfect sequence. The A.I. will adapt, so be fast. Be flawless.<br><br>The fate of the program is in your hands.`;
            showModal("URGENT: Mission Briefing", storyText, "story");
        };
    } else if (type === "story") {
        if (!showModal.hasPlayedSpeak) {
            sounds.speak.loop = false;
            sounds.speak.volume = 1.0;
            sounds.speak.currentTime = 0;
            sounds.speak.play().catch(() => {});
            showModal.hasPlayedSpeak = true;
        }
        modalButtons.innerHTML =
        '<button id="modal-begin-btn">Acknowledge & Proceed</button>';
      document.getElementById("modal-begin-btn").onclick = () => {
        if (hasSeenGuide) {
          modal.style.display = "none";
          startNewGame();
        } else {
          const guideText = `<div class='guide-text'>
                        <strong>QUICK INTERFACE GUIDE:</strong><br><br>
                        - <strong>SCORE:</strong> Top-left. Tracks your performance.<br>
                        - <strong>TIMER:</strong> Below your score. Shows time remaining for the current level.<br>
                        - <strong>GAME ZONE:</strong> The large grid on your right. This is the battlefield.<br>
                        - <strong>LEADERBOARD:</strong> Bottom-left. See how you rank among other agents.<br>
                        </div>`;
          showModal("SYSTEM CALIBRATION", guideText, "guide");
        }
      };
    } else if (type === "guide") {
      hasSeenGuide = true; // Mark guide as seen
      modalButtons.innerHTML =
        '<button id="modal-start-game-btn">Initiate Simulation</button>';
      document.getElementById("modal-start-game-btn").onclick = () => {
        modal.style.display = "none";
        startNewGame();
      };
    } else if (type === "level_up") {
      modalButtons.innerHTML =
        '<button id="modal-next-level-btn">Engage Next Level</button>';
      document.getElementById("modal-next-level-btn").onclick = () => {
        modal.style.display = "none";
        runCountdown(() => startLevel(currentLevel));
      };
    } else if (type === "endgame") {
      const winMsg = `MISSION COMPLETE, ${playerName}!<br>The A.I. has been subdued.<br>Total Time: ${totalTimeElapsed.toFixed(
        2
      )}s<br>Final Score: ${score}`;
      const loseMsg = `SYSTEM OVERRUN. MISSION FAILED.<br>The A.I. proved too fast.<br>Final Score: ${score}`;
      modalTitle.textContent = isWinner ? "VICTORY" : "DEFEAT";
      modalText.innerHTML = isWinner ? winMsg : loseMsg;
      modalButtons.innerHTML = `<button id="modal-replay-btn">Re-Simulate</button><button id="modal-change-player-btn">New Agent</button>`;
      document.getElementById("modal-replay-btn").onclick = () => {
        modal.style.display = "none";
        startNewGame();
      };
      document.getElementById("modal-change-player-btn").onclick = () => {
        modal.style.display = "none";
        resetGameStats();
        showModal(
          "Neon Number Sprint",
          "Please enter your agent name.",
          "name"
        );
      };
    } else {
      modalButtons.innerHTML = '<button id="modal-close-btn">Roger.</button>';
      document.getElementById("modal-close-btn").onclick = () =>
        (modal.style.display = "none");
    }
  };

  const runCountdown = (callback) => {
    let count = 3;
    countdownOverlay.style.display = "flex";
    const nextCount = () => {
      if (count > 0) {
        countdownText.textContent = count;
        playSound("countdown");
        countdownText.classList.remove("countdown-zoom");
        void countdownText.offsetWidth;
        countdownText.classList.add("countdown-zoom");
        count--;
        setTimeout(nextCount, 1000);
      } else {
        countdownOverlay.style.display = "none";
        callback();
      }
    };
    nextCount();
  };

  const resetGameStats = () => {
    score = 0;
    currentLevel = 1;
    totalTimeElapsed = 0;
    updateScore(0);
    clearInterval(timer);
    isGameActive = false;
    sounds.music.pause();
    sounds.music.currentTime = 0;
  };
  const startNewGame = () => {
    resetGameStats();
    runCountdown(() => startLevel(1));
  };
  const startLevel = (level) => {
    isGameActive = true;
    playSound("music");
    currentLevel = level;
    nextNumber = 1;
    const numsPerLvl = [8, 12, 16, 20, 25];
    const timePerLvl = [15, 20, 25, 30, 40];
    timeLimit = timePerLvl[level - 1];
    gameZone.innerHTML = "";
    const nums = Array.from({ length: numsPerLvl[level - 1] }, (_, i) => i + 1);
    shuffleArray(nums).forEach((num) => {
      const block = document.createElement("div");
      block.className = "number-block";
      block.textContent = num;
      block.onclick = () => handleNumberClick(num, block);
      gameZone.appendChild(block);
    });
    startTimer();
  };
  const handleNumberClick = (num, element) => {
    if (!isGameActive || element.classList.contains("deactivated")) return;
    if (num === nextNumber) {
      updateScore(10);
      playSound("correct");
      element.classList.add("deactivated");
      nextNumber++;
      if (nextNumber > gameZone.children.length) {
        clearInterval(timer);
        totalTimeElapsed += (Date.now() - levelStartTime) / 1000;
        if (currentLevel === 5) {
          endGame(true);
        } else {
          currentLevel++;
          showModal(
            `ADAPTATION COMPLETE`,
            `The A.I. has increased complexity.`,
            "level_up"
          );
        }
      }
    } else {
      updateScore(-5);
      playSound("wrong");
    }
  };
  const startTimer = () => {
    clearInterval(timer);
    levelStartTime = Date.now();
    timer = setInterval(() => {
      const remaining = timeLimit - (Date.now() - levelStartTime) / 1000;
      if (remaining <= 0) {
        timeEl.textContent = "0.00";
        endGame(false);
      } else {
        timeEl.textContent = remaining.toFixed(2);
      }
    }, 50);
  };
  const endGame = (isWinner) => {
    clearInterval(timer);
    isGameActive = false;
    sounds.music.pause();
    if (!isWinner) totalTimeElapsed += timeLimit;
    updateLeaderboard(playerName, score, totalTimeElapsed);
    showModal("", "", "endgame", isWinner);
  };

  const updateScore = (points) => {
    score = Math.max(0, score + points);
    scoreEl.textContent = score;
  };
  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const updateLeaderboard = (name, scr, time) => {
    leaderboard.push({ name, score: scr, time: time.toFixed(2) });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    leaderboardList.innerHTML = leaderboard
      .slice(0, 5)
      .map((p) => `<li>${p.name} - ${p.score}pts (${p.time}s)</li>`)
      .join("");
  };
  startBtn.addEventListener("click", () => {
    unlockAudioAndScreen();
    if (hasSeenGuide) {
      startNewGame();
    } else {
      showModal(
        "Neon Number Sprint",
        "Please enter your agent name to begin.",
        "name"
      );
    }
  });
  stopBtn.addEventListener("click", () => {
    if (isGameActive) endGame(false);
  });
  tipsBtn.addEventListener("click", () =>
    showModal(
      "Mission Intel",
      "Neutralize targets in ascending order. Incorrect targets incur a score penalty. The A.I. will adapt between levels.",
      "info"
    )
  );

  showModal(
    "Human Number Sprint",
    "Please enter your agent name to begin.",
    "name"
  );
});
