# Idle Clicker Game Project Document

**Technologies**: HTML, Tailwind CSS, JavaScript  
**Core Features**: Clicking Mechanics, Idle Progression, Upgrade System, Prestige System, LocalStorage Persistence

---

## Game Layout Structure
```html
<div class="grid grid-cols-3 min-h-screen bg-gray-100"> 
    <!-- Left Column - Clicker Interface --> 
    <div class="p-4 border-r"> 
        <h2 class="text-2xl font-bold mb-4">Total Points</h2> 
        <div id="points-display" class="text-4xl mb-4">0</div> 
        <button id="click-button" class="w-32 h-32 rounded-full bg-blue-500 hover:bg-blue-600 active:translate-y-1 active:scale-95 transition-all duration-75"> Click Me! </button> 
    </div> 
    <!-- Middle Column - Current Upgrades --> 
    <div class="p-4 border-r"> 
        <h2 class="text-2xl font-bold mb-4">Active Upgrades</h2> 
        <div id="active-upgrades"></div> 
    </div> 
    <!-- Right Column - Purchasable Upgrades --> 
    <div class="p-4"> 
        <h2 class="text-2xl font-bold mb-4">Store</h2> 
        <div id="upgrade-store"></div> <div class="mt-8"> 
            <button id="prestige-btn" class="bg-purple-500 text-white px-4 py-2 rounded hidden"> Prestige (Requires 1M points) </button> 
        </div> 
    </div> 
</div> 
```

## Core Mechanics Implementation

### 1. Clicking Mechanics

### Features:

- Visual feedback on click (scale + position shift)

- Points increment per click

- Dynamic color changes

```javascript 
let points = 0;
const clickButton = document.getElementById('click-button');

clickButton.addEventListener('mousedown', () => {
  points += 1 + clickMultiplier;
  updateDisplay();
});

clickButton.addEventListener('mouseup', () => {
  clickButton.classList.remove('active:scale-90');
});
```
### 2. Idle Progression

### Implementation:

```javascript
let lastActiveTime = Date.now();

function calculateIdleTime() {
  const now = Date.now();
  const idleSeconds = (now - lastActiveTime) / 1000;
  lastActiveTime = now;
  return idleSeconds;
}

function applyIdleGains() {
  const idleTime = calculateIdleTime();
  points += idleTime * autoPointsPerSecond;
  updateDisplay();
}

// Run on page load
window.addEventListener('load', applyIdleGains);
```

### 3. Upgrade System

### Upgrade Structure:

```javascript
const upgrades = [
  {
    id: 1,
    name: "Auto-Clicker",
    cost: 50,
    multiplier: 0.1,
    type: "auto"
  },
  {
    id: 2,
    name: "Power Click",
    cost: 100,
    multiplier: 1,
    type: "click"
  }
];

function purchaseUpgrade(upgradeId) {
  const upgrade = upgrades.find(u => u.id === upgradeId);
  if (points >= upgrade.cost) {
    points -= upgrade.cost;
    if (upgrade.type === "auto") {
      autoPointsPerSecond += upgrade.multiplier;
    } else {
      clickMultiplier += upgrade.multiplier;
    }
    upgrade.cost = Math.floor(upgrade.cost * 1.5);
    updateStore();
  }
}
```

### 4. Persistence System

### LocalStorage Management:

```javascript
function saveGame() {
  const gameState = {
    points,
    upgrades,
    lastActiveTime: Date.now()
  };
  localStorage.setItem('gameSave', JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem('gameSave');
  if (saved) {
    const gameState = JSON.parse(saved);
    points = gameState.points;
    upgrades = gameState.upgrades;
    lastActiveTime = gameState.lastActiveTime;
  }
}

// Auto-save every 30 seconds
setInterval(saveGame, 30000);
```

###5. Prestige System

### Implementation:

```javascript
let prestigePoints = 0;

document.getElementById('prestige-btn').addEventListener('click', () => {
  if (points >= 1000000) {
    prestigePoints += Math.floor(points / 1000000);
    points = 0;
    upgrades.forEach(u => u.cost = 50);
    updatePrestigeDisplay();
    saveGame();
  }
});

function updatePrestigeDisplay() {
  const btn = document.getElementById('prestige-btn');
  btn.classList.toggle('hidden', points < 1000000);
}
```

### Progression Balancing

- Early Game: First 5 upgrades cost 50-500 points

- Mid Game: Next tier unlocks at 1,000 points (2x multiplier)

- Late Game: Prestige unlocks at 1M points (1% bonus per prestige)

### Asset Swapping System

```css
/* Easy color/image swapping */
.upgrade-item {
  --bg-color: theme('colors.blue.200');
  background-color: var(--bg-color);
}

/* For future image implementation */
.upgrade-item.with-image {
  background-image: var(--custom-image);
  background-size: cover;
}
```

### Development Roadmap

1. Implement core clicking mechanics

2. Add idle progression calculations

3. Build upgrade store UI

4. Implement save/load functionality

5. Add prestige system

6. Polish animations and UI feedback

7. Balance progression curves

> Next Steps: Start with the core HTML structure, then implement the click handler and basic point system before moving to more complex features like idle progression and upgrades.

