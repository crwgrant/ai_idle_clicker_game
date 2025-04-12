# Idle Clicker Game

This project is a simple idle clicker game built using HTML, Tailwind CSS, and vanilla JavaScript, based on the specifications outlined in the `PRD.md` document. It was developed collaboratively with the assistance of an AI programming partner.

## Overview

The game allows players to generate points by clicking a button. These points can then be spent on upgrades that either increase the points earned per click or automatically generate points over time (idle progression). The game features persistence using `localStorage`, allowing progress to be saved and automatically loaded when the game is revisited. A prestige system allows players to reset their progress for potential future bonuses after reaching a certain point threshold. A reset option is also available.

## Core Features (from PRD.md)

*   **Technologies**: HTML, Tailwind CSS, JavaScript
*   **Layout**: A responsive three-column layout:
    *   Left: Clicker interface (button, points display, prestige points, save button, save status, reset link).
    *   Middle: Display for currently active/purchased upgrades.
    *   Right: Store for purchasing new upgrades and the prestige button.
*   **Clicking Mechanics**:
    *   Generate points by clicking the main button.
    *   Visual feedback on click.
    *   Points per click increase with relevant upgrades.
*   **Idle Progression**:
    *   Automatically generates points over time based on purchased upgrades.
    *   Calculates and applies points earned while the game was inactive (offline progress).
*   **Upgrade System**:
    *   Purchase upgrades from the store using points.
    *   Upgrades increase either click power or points per second (flat or percentage).
    *   Upgrade costs increase after each purchase.
    *   Active upgrades are displayed separately.
*   **Prestige System**:
    *   Option to reset progress (points, upgrades) after reaching 1 million points.
    *   Earns prestige points upon reset, which grant a percentage bonus to PPS and PPC.
*   **Persistence**:
    *   Game state (points, upgrades, prestige points, last active time) is saved to `localStorage`.
    *   **Auto-Save**: Automatically saves progress every 5 minutes, with visual feedback.
    *   **Manual Save**: Option to save manually via a button, with visual feedback.
    *   **Auto-Load**: Automatically loads saved data when the game starts or the page is refreshed.
    *   **Manual Reset**: Option to completely reset game progress via a link (requires confirmation).

## How to Play

1.  Open the `index.html` file in a web browser.
2.  Click the "Click Me!" button to earn points.
3.  Use points to buy upgrades from the Store section on the right.
4.  Upgrades will either increase points per click or generate points automatically.
5.  Your progress is saved automatically every 5 minutes and when you manually click "Save Game". A status message will appear briefly.
6.  If you close and reopen the game, your progress will be loaded automatically.
7.  Reach 1 million points to unlock the Prestige option.
8.  Use the "Reset Game" link below the "Save Game" button if you wish to start over completely (confirmation required).

## Development Notes

This game was developed iteratively based on the `PRD.md` document:

1.  **Foundation**: Set up `index.html` structure, basic CSS (`style.css` with Tailwind directives), and `script.js`.
2.  **Core Logic**: Implemented JavaScript functions for:
    *   Click handling and point updates.
    *   Idle point calculation and game loop (`setInterval`).
    *   Upgrade definition (including percentage types), purchasing, cost scaling, and UI rendering (`renderStore`, `renderActiveUpgrades`).
    *   Persistence using `localStorage` (`saveGame`, `loadGame`, auto-save, auto-load on `window.load`).
    *   Prestige mechanism (`performPrestige`) and bonus calculation.
3.  **Refinement & Debugging**:
    *   Addressed JavaScript errors (e.g., `ReferenceError` by reordering constant definition).
    *   Adjusted auto-save interval and added visual feedback.
    *   Added more upgrade types (percentage-based).
    *   Fixed Store panel scrolling issue using nested relative/absolute positioning.
    *   Modified the UI based on user feedback (removed unnecessary Load button, relocated Save button, adjusted padding).
    *   Added a confirmation-protected "Reset Game" link. 