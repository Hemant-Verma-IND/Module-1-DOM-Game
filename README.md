# Human Vs AI Number Sprint (Using DOM)

An interactive, fast-paced number sequencing game module designed to test reflexes and cognitive speed. Presented with a futuristic, neon-drenched aesthetic, players must click on numbers in ascending order against the clock. The game features a leveling system with increasing difficulty, a persistent leaderboard, and an engaging backstory to immerse the player.

<img width="1919" height="1076" alt="image" src="https://github.com/user-attachments/assets/803eb430-4ae8-4737-a70e-fac9ae651a07" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/68173d01-8740-45ec-bd44-04c2761b8ec3" />


## Table of Contents

- Features
- How to Play
- Installation
- Usage
- HTML Structure
- CSS Styling
- JavaScript Logic

## Features

- **Engaging Gameplay**: A simple yet addictive core mechanic of clicking numbers in the correct sequence.
- **Progressive Difficulty**: Five levels that increase the number of blocks and decrease the time available.
- **Interactive Modals**: A fully interactive guide and story-driven modals to onboard and engage the player.
- **Dynamic Leaderboard**: A leaderboard that updates in real-time and persists across sessions.
- **Immersive Audio**: Background music and sound effects that react to player actions.
- **Futuristic UI**: A neon-noir inspired interface with custom fonts and glowing effects.
- **Responsive Design**: The game interface adapts to different screen sizes.

## How to Play

1. **Login**: Enter your agent name to begin.
2. **Mission Briefing**: Read the mission briefing to understand the story.
3. **System Calibration**: A quick guide will walk you through the user interface.
4. **Start the Game**: Click the "Start" button and a countdown will begin.
5. **Click the Numbers**: Once the game starts, click the number blocks in ascending order (1, 2, 3, etc.).
6. **Beat the Clock**: Each level has a time limit. Complete the sequence before time runs out.
7. **Level Up**: After successfully completing a level, you can proceed to the next, more challenging level.
8. **Check the Leaderboard**: See how your score and time compare to other agents.

## Installation

To use this module in your own project, download the following files and place them in your project directory:

- `index.html`
- `style.css`
- `script.js`
- The `sounds` folder with all audio assets.

## Usage

This module is self-contained and can be easily integrated into any web project.

### HTML Structure

The main components of the `index.html` are:

- A header for the game title.
- A main container that holds the left panel and the game zone.
- The left panel displays player info, score, time, action buttons, and the leaderboard.
- The game zone is where the number blocks are dynamically generated.
- Modal overlays are used for user input, story, guides, and end-game screens.
- Audio elements are included for sound effects and music.

To use the module, you need to ensure the HTML file links to the `style.css` and `script.js` files correctly.

### CSS Styling

The `style.css` file contains all the styles for the game, including:

- A dark, neon theme with the "Orbitron" font.
- Styling for the main layout, information boxes, buttons, and game grid.
- Hover and deactivated states for the number blocks.
- Modal and countdown overlay styles.
- A zoom-fade animation for the countdown.

### JavaScript Logic

The `script.js` handles all the game's functionality. The core components are implemented using only up to the Document Object Model (DOM) API, without any external libraries or frameworks.
