// Game State Variables
let points = 0;
let clickMultiplier = 0; // Starts at 0, base click adds 1 point. Upgrades add to this.
let autoPointsPerSecond = 0;
let prestigePoints = 0;
let lastActiveTime = Date.now();
let totalPointsAccumulated = 0; // New variable to track total earned points in this run
const PRESTIGE_REQUIREMENT = 1000000;
const PRESTIGE_BONUS_RATE = 0.01; // 1% bonus per prestige point

// DOM Element References
const pointsDisplay = document.getElementById('points-display');
const prestigePointsDisplay = document.getElementById('prestige-points-display');
const clickButton = document.getElementById('click-button');
const upgradeStoreContainer = document.getElementById('upgrade-store');
const activeUpgradesContainer = document.getElementById('active-upgrades');
const prestigeButton = document.getElementById('prestige-btn');
const saveButton = document.getElementById('save-btn');
const saveStatusElement = document.getElementById('save-status'); // Added save status element reference
const resetLink = document.getElementById('reset-link'); // Added reset link reference
const accumulatedPointsDisplay = document.getElementById('accumulated-points-display'); // Added accumulated points display reference
const pointsSuffixDisplay = document.getElementById('points-suffix'); // New suffix element
const accumulatedPointsSuffixDisplay = document.getElementById('accumulated-points-suffix'); // New suffix element

// Initial Upgrade Data (based on PRD, costs might need balancing later)
// We'll make a deep copy later when loading/resetting to avoid mutation issues.
const initialUpgrades = [
    { id: 1, name: "Auto-Clicker Mk1", cost: 50,   baseCost: 50,   multiplier: 0.1, type: "auto", purchased: 0, description: "Generates 0.1 points per second." },
    { id: 2, name: "Power Click Mk1",   cost: 100,  baseCost: 100,  multiplier: 1,   type: "click", purchased: 0, description: "Adds 1 point to each click." },
    { id: 3, name: "Auto-Clicker Mk2", cost: 500,  baseCost: 500,  multiplier: 1,   type: "auto", purchased: 0, description: "Generates 1 point per second." },
    { id: 4, name: "Power Click Mk2",   cost: 1000, baseCost: 1000, multiplier: 5,   type: "click", purchased: 0, description: "Adds 5 points to each click." },
    // Added Mid/Late Game Upgrades
    { id: 5, name: "Optimization Algorithm Mk1", cost: 10000, baseCost: 10000, multiplier: 0.05, type: "auto_percent", purchased: 0, description: "Increases total points per second by 5%." },
    { id: 6, name: "Ergonomic Mouse Mk1",      cost: 20000, baseCost: 20000, multiplier: 0.05, type: "click_percent", purchased: 0, description: "Increases total points per click by 5%." },
    { id: 7, name: "Quantum Computing Cloud",   cost: 500000,baseCost: 500000,multiplier: 0.10, type: "auto_percent", purchased: 0, description: "Increases total points per second by 10%." },
    // Add higher tier example
    { id: 8, name: "Optimization Algorithm Mk2", cost: 500000, baseCost: 500000, multiplier: 0.07, type: "auto_percent", purchased: 0, description: "Increases total points per second by 7%." },
    // Add more upgrades as needed following the PRD's progression ideas
];

// Make a working copy of upgrades for the current game session
let upgrades = JSON.parse(JSON.stringify(initialUpgrades));


// --- Core Functions ---

// Function to update the points display
function updateDisplay() {
    const formattedPoints = formatNumberShort(points);
    pointsDisplay.textContent = formattedPoints.value;
    pointsSuffixDisplay.textContent = formattedPoints.suffixWord || '\u00A0'; // Use nbsp if suffix is empty

    // Update prestige display to show current bonus
    const prestigeBonusPercent = (prestigePoints * PRESTIGE_BONUS_RATE * 100).toFixed(1);
    prestigePointsDisplay.textContent = `Prestige Points: ${prestigePoints.toLocaleString()} (+${prestigeBonusPercent}% Bonus)`;
    
    // Update accumulated points display
    if (accumulatedPointsDisplay) {
        const formattedAccumulated = formatNumberShort(totalPointsAccumulated);
        accumulatedPointsDisplay.textContent = formattedAccumulated.value;
        accumulatedPointsSuffixDisplay.textContent = formattedAccumulated.suffixWord || '\u00A0';
    }
    
    updatePrestigeDisplay(); // Check if prestige button should be shown
    updateStoreAvailability(); // Grey out unaffordable upgrades
    updateStoreVisibility(); // Add call to update visibility
}

// Function to update the prestige button visibility
function updatePrestigeDisplay() {
    prestigeButton.classList.toggle('hidden', !canPrestige());
    const formattedRequirement = formatNumberShort(PRESTIGE_REQUIREMENT);
    // Combine value and suffix for the button text
    prestigeButton.textContent = `Prestige (${formattedRequirement.value}${formattedRequirement.suffixWord ? ' ' + formattedRequirement.suffixWord : ''} points)`;
}

// --- Clicking Mechanics ---
clickButton.addEventListener('mousedown', () => {
    // Base points per click is 1, plus any multiplier from upgrades
    const pointsEarned = 1 + clickMultiplier;
    points += pointsEarned;
    totalPointsAccumulated += pointsEarned; // Increment accumulator
    updateDisplay();
    // Add a simple visual feedback by quickly scaling
    clickButton.classList.add('scale-90');
});

clickButton.addEventListener('mouseup', () => {
    // Remove the scaling effect
    clickButton.classList.remove('scale-90');
});

// Make sure display is updated initially
updateDisplay();

// --- Idle Progression ---

// Calculates time elapsed since last active moment (in seconds)
function calculateIdleTime() {
    const now = Date.now();
    // If lastActiveTime is somehow in the future (shouldn't happen), return 0
    if (now <= lastActiveTime) return 0;
    const idleSeconds = (now - lastActiveTime) / 1000;
    return idleSeconds;
}

// Applies gains based on idle time - called on load
function applyIdleGains() {
    const idleTime = calculateIdleTime();
    if (idleTime > 0) {
        const earnedPoints = idleTime * autoPointsPerSecond;
        points += earnedPoints;
        totalPointsAccumulated += earnedPoints; // Increment accumulator
        console.log(`Applied ${earnedPoints.toLocaleString()} points from ${idleTime.toFixed(1)} seconds of idle time.`);
        // No need to update lastActiveTime here, the game loop will handle it.
        updateDisplay(); // Update display after applying gains
    }
    // Set/reset lastActiveTime for the next save/load cycle
    lastActiveTime = Date.now();
}


// --- Game Loop ---
let lastTickTime = Date.now(); // Use a separate variable for loop timing

function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastTickTime) / 1000; // Time difference in seconds

    // Add points based on auto-generation rate and time elapsed
    const earnedPoints = autoPointsPerSecond * deltaTime;
    points += earnedPoints;
    totalPointsAccumulated += earnedPoints; // Increment accumulator

    lastTickTime = now;
    updateDisplay();
}

// Run the game loop every 100 milliseconds for smooth updates
setInterval(gameLoop, 100);

// Call applyIdleGains once initially in case there's saved data (we'll integrate this properly with loadGame later)
// applyIdleGains(); // Will be called within loadGame

// --- Upgrade System ---

// Function to render upgrades in the store
function renderStore() {
    upgradeStoreContainer.innerHTML = ''; // Clear existing store items
    upgrades.forEach(upgrade => {
        const upgradeElement = document.createElement('div');
        upgradeElement.dataset.upgradeId = upgrade.id;
        upgradeElement.className = 'border p-3 rounded bg-white shadow-sm flex justify-between items-center';
        const formattedCost = formatNumberShort(upgrade.cost);
        upgradeElement.innerHTML = `
            <div>
                <h4 class="font-semibold">${upgrade.name} (Level ${upgrade.purchased})</h4>
                <p class="text-sm text-gray-600">${upgrade.description}</p>
                <p class="text-sm text-gray-800 font-medium">Cost: ${formattedCost.value}${formattedCost.suffixWord ? ' ' + formattedCost.suffixWord : ''}</p>
            </div>
            <button data-id="${upgrade.id}" class="buy-upgrade-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Buy
            </button>
        `;
        upgradeStoreContainer.appendChild(upgradeElement);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.buy-upgrade-btn').forEach(button => {
        button.addEventListener('click', () => purchaseUpgrade(parseInt(button.dataset.id)));
    });
    updateStoreAvailability(); // Ensure availability is set correctly after rendering
}

// Function to update which upgrades can be bought
function updateStoreAvailability() {
    document.querySelectorAll('.buy-upgrade-btn').forEach(button => {
        const upgradeId = parseInt(button.dataset.id);
        const upgrade = upgrades.find(u => u.id === upgradeId);
        button.disabled = points < upgrade.cost;
    });
}

// **NEW FUNCTION**
// Function to update the visibility of upgrades in the store based on progress
function updateStoreVisibility() {
    const revealThreshold = 0.75; // Show upgrade when points reach 75% of its cost

    upgrades.forEach(upgrade => {
        const element = upgradeStoreContainer.querySelector(`[data-upgrade-id="${upgrade.id}"]`);
        if (!element) return; // Skip if element not found

        // Always show first two upgrades (IDs 1 and 2)
        if (upgrade.id <= 2) {
            element.classList.remove('hidden');
            return;
        }

        // For upgrades 3+, check if TOTAL ACCUMULATED points meet the threshold
        const isVisible = totalPointsAccumulated >= (upgrade.cost * revealThreshold);
        element.classList.toggle('hidden', !isVisible);
    });
}

// Function to handle purchasing an upgrade
function purchaseUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) {
        console.error("Upgrade not found:", upgradeId);
        return;
    }

    if (points >= upgrade.cost) {
        points -= upgrade.cost;
        upgrade.purchased += 1;

        // Increase cost for the next purchase (e.g., 15% increase)
        const oldCost = upgrade.cost; // Store old cost for comparison if needed
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.purchased));

        // Recalculate BOTH multipliers after any purchase, as percentages affect totals
        autoPointsPerSecond = calculateTotalAutoPPS();
        clickMultiplier = calculateTotalClickMultiplier();

        console.log(`Purchased ${upgrade.name}. New cost: ${upgrade.cost}. Level: ${upgrade.purchased}`);
        console.log(`New PPS: ${autoPointsPerSecond.toFixed(2)}, New Click Bonus: ${clickMultiplier.toFixed(2)}`); // Log new rates

        // --- Update UI without full re-render ---
        // Find the specific element in the store
        const storeElement = upgradeStoreContainer.querySelector(`[data-upgrade-id="${upgrade.id}"]`);
        if (storeElement) {
            // Update the level display in the heading
            const headingElement = storeElement.querySelector('h4');
            if (headingElement) {
                headingElement.textContent = `${upgrade.name} (Level ${upgrade.purchased})`;
            }
            // Update the cost display
            const costElement = storeElement.querySelector('p.text-gray-800'); // Find the cost paragraph
            if (costElement) {
                 const formattedCost = formatNumberShort(upgrade.cost);
                 costElement.textContent = `Cost: ${formattedCost.value}${formattedCost.suffixWord ? ' ' + formattedCost.suffixWord : ''}`; // Combine value and suffix
            }
        } else {
            console.warn('Could not find store element to update for ID:', upgrade.id);
             // Fallback to re-rendering if specific element update fails?
            renderStore(); 
        }

        // Update the middle panel (Active Upgrades)
        renderActiveUpgrades(); 
        // Update points, button states, and store visibility
        updateDisplay(); 

        // --- End UI Update --- 

    } else {
        console.log("Not enough points to buy", upgrade.name);
        // Optionally provide visual feedback (e.g., shake the button)
    }
}

// Helper function to calculate total Auto PPS from all purchased upgrades
function calculateTotalAutoPPS() {
    // Calculate base PPS from flat upgrades
    const basePPS = upgrades
        .filter(u => u.type === 'auto' && u.purchased > 0)
        .reduce((total, u) => total + (u.multiplier * u.purchased), 0);

    // Calculate total percentage multiplier from relevant upgrades
    const percentMultiplier = upgrades
        .filter(u => u.type === 'auto_percent' && u.purchased > 0)
        .reduce((multiplier, u) => multiplier * (1 + (u.multiplier * u.purchased)), 1); // Start multiplier at 1

    // Calculate PPS after upgrade multipliers
    let calculatedPPS = basePPS * percentMultiplier;

    // Apply Prestige Bonus
    const prestigeMultiplier = 1 + (prestigePoints * PRESTIGE_BONUS_RATE);
    calculatedPPS *= prestigeMultiplier;

    return calculatedPPS;
}

// Helper function to calculate total Click Multiplier from all purchased upgrades
function calculateTotalClickMultiplier() {
    // Calculate base click bonus from flat upgrades
    const baseClickBonus = upgrades
        .filter(u => u.type === 'click' && u.purchased > 0)
        .reduce((total, u) => total + (u.multiplier * u.purchased), 0);

    // Calculate total percentage multiplier from relevant upgrades
    const percentMultiplier = upgrades
        .filter(u => u.type === 'click_percent' && u.purchased > 0)
        .reduce((multiplier, u) => multiplier * (1 + (u.multiplier * u.purchased)), 1); // Start multiplier at 1

    // Calculate click bonus after upgrade multipliers
    let calculatedClickBonus = baseClickBonus * percentMultiplier;

    // Apply Prestige Bonus
    const prestigeMultiplier = 1 + (prestigePoints * PRESTIGE_BONUS_RATE);
    calculatedClickBonus *= prestigeMultiplier;

    // Note: The actual points per click is (1 + calculatedClickMultiplier)
    return calculatedClickBonus;
}


// Function to render the currently owned upgrades
function renderActiveUpgrades() {
    activeUpgradesContainer.innerHTML = ''; // Clear current list
    const purchasedUpgrades = upgrades.filter(u => u.purchased > 0);

    if (purchasedUpgrades.length === 0) {
        activeUpgradesContainer.innerHTML = '<p class="text-gray-500">No upgrades purchased yet.</p>';
        return;
    }

    purchasedUpgrades.forEach(upgrade => {
        const elem = document.createElement('div');
        elem.className = 'border-b pb-1 mb-1';
        let effect = '';
        // Format effect string based on upgrade type
        switch (upgrade.type) {
            case 'auto':
                effect = `+${(upgrade.multiplier * upgrade.purchased).toLocaleString(undefined, {maximumFractionDigits: 1})} points/sec (flat)`;
                break;
            case 'click':
                effect = `+${(upgrade.multiplier * upgrade.purchased).toLocaleString()} points/click (flat)`;
                break;
            case 'auto_percent':
                // Calculate the total percentage bonus from this specific upgrade line
                const totalAutoPercentBonus = (Math.pow(1 + upgrade.multiplier, upgrade.purchased) - 1) * 100;
                // effect = `+${(upgrade.multiplier * upgrade.purchased * 100).toFixed(1)}% PPS`; // Simpler, less accurate for stacking levels
                 effect = `+${totalAutoPercentBonus.toFixed(1)}% total PPS`;
                break;
            case 'click_percent':
                 // Calculate the total percentage bonus from this specific upgrade line
                const totalClickPercentBonus = (Math.pow(1 + upgrade.multiplier, upgrade.purchased) - 1) * 100;
                // effect = `+${(upgrade.multiplier * upgrade.purchased * 100).toFixed(1)}% PPC`; // Simpler, less accurate for stacking levels
                effect = `+${totalClickPercentBonus.toFixed(1)}% total Click Power`;
                break;
            default:
                effect = 'Unknown effect';
        }

        elem.innerHTML = `<span class="font-medium">${upgrade.name} (Level ${upgrade.purchased})</span>: <span class="text-green-700">${effect}</span>`;
        activeUpgradesContainer.appendChild(elem);
    });
}


// Initial setup calls
renderStore();
renderActiveUpgrades();
updateStoreVisibility(); // Initial visibility check

// --- Persistence System (LocalStorage) ---

let saveStatusTimeoutId = null; // Variable to hold the timeout ID

function saveGame(isAutoSave = false) { // Add parameter to distinguish auto/manual save
    const gameState = {
        points: points,
        clickMultiplier: clickMultiplier,
        autoPointsPerSecond: autoPointsPerSecond,
        prestigePoints: prestigePoints,
        upgrades: upgrades, // Save the current state of upgrades (costs, purchased levels)
        lastActiveTime: Date.now(), // Save the timestamp for idle calculation
        totalPointsAccumulated: totalPointsAccumulated // Save the accumulated points
    };
    try {
        localStorage.setItem('idleClickerSave', JSON.stringify(gameState));
        // console.log("Game Saved"); // Keep console log for debugging if needed

        // Display feedback in the UI
        if (saveStatusElement) {
            const message = isAutoSave ? "Game auto-saved" : "Game Saved!";
            saveStatusElement.textContent = message;

            // Clear any existing timeout to prevent message flickering
            if (saveStatusTimeoutId) {
                clearTimeout(saveStatusTimeoutId);
            }

            // Set a new timeout to clear the message after 2.5 seconds
            saveStatusTimeoutId = setTimeout(() => {
                if (saveStatusElement) {
                    saveStatusElement.textContent = '\u00A0'; // Use non-breaking space to maintain height
                }
                saveStatusTimeoutId = null;
            }, 2500);
        }
    } catch (error) {
        console.error("Failed to save game:", error);
        if (saveStatusElement) {
            saveStatusElement.textContent = "Save Failed!";
             // Optionally clear this error message too after a while
             if (saveStatusTimeoutId) clearTimeout(saveStatusTimeoutId);
             saveStatusTimeoutId = setTimeout(() => {
                 if (saveStatusElement) saveStatusElement.textContent = '\u00A0';
                 saveStatusTimeoutId = null;
             }, 3500);
        }
    }
}

function loadGame() {
    try {
        const savedState = localStorage.getItem('idleClickerSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);

            // Restore game state variables
            points = gameState.points || 0;
            prestigePoints = gameState.prestigePoints || 0;
            lastActiveTime = gameState.lastActiveTime || Date.now(); // Important for idle calculation
            totalPointsAccumulated = gameState.totalPointsAccumulated || 0; // Load accumulated points

            // Restore upgrades - carefully merge in case new upgrades were added in code
            const loadedUpgrades = gameState.upgrades || [];
            upgrades = JSON.parse(JSON.stringify(initialUpgrades)).map(initialUpgrade => {
                const savedUpgrade = loadedUpgrades.find(u => u.id === initialUpgrade.id);
                // If found in save, use saved data, otherwise use initial data
                return savedUpgrade ? { ...initialUpgrade, ...savedUpgrade } : initialUpgrade;
            });

            // Recalculate multipliers based on loaded upgrade levels
            clickMultiplier = calculateTotalClickMultiplier();
            autoPointsPerSecond = calculateTotalAutoPPS();

            console.log("Game Loaded");

            // IMPORTANT: Apply idle gains AFTER loading the state
            applyIdleGains(); // This will use the loaded lastActiveTime

            // Update UI with loaded state
            updateDisplay();
            renderStore();
            renderActiveUpgrades();
        } else {
            console.log("No saved game found.");
            // Initialize everything fresh if no save exists (already done by initial variable setup)
            // Make sure lastActiveTime is current if no save
            lastActiveTime = Date.now();
            totalPointsAccumulated = 0; // Ensure accumulator is 0 on fresh start
        }
    } catch (error) {
        console.error("Failed to load game:", error);
        // Handle potential errors during loading/parsing
        // Reset to default state might be a safe fallback
        resetGame(); // Define a reset function if needed
    }
}

// Add event listeners for Save button (pass false for isAutoSave)
saveButton.addEventListener('click', () => saveGame(false));

// Auto-save interval (pass true for isAutoSave)
setInterval(() => saveGame(true), 300000); // Changed interval to 5 minutes (300,000 ms)

// Initial load attempt when the script runs
window.addEventListener('load', loadGame);


// --- Prestige System ---

function canPrestige() {
    return points >= PRESTIGE_REQUIREMENT;
}

function performPrestige() {
    if (!canPrestige()) {
        console.log("Not enough points to prestige.");
        return;
    }

    // Calculate prestige points earned (example: 1 per million points, maybe add sqrt for diminishing returns)
    const prestigeEarned = Math.floor(points / PRESTIGE_REQUIREMENT);
    prestigePoints += prestigeEarned;

    console.log(`Prestiged! Earned ${prestigeEarned} prestige points. Total: ${prestigePoints}`);

    // Reset core game state
    points = 0;
    totalPointsAccumulated = 0; // Reset accumulator on prestige
    clickMultiplier = 0; // Reset base multipliers
    autoPointsPerSecond = 0;
    lastActiveTime = Date.now(); // Reset timer

    // Reset upgrades to their initial state (costs, purchased levels)
    upgrades = JSON.parse(JSON.stringify(initialUpgrades));

    // Recalculate multipliers to apply new prestige bonus
    autoPointsPerSecond = calculateTotalAutoPPS();
    clickMultiplier = calculateTotalClickMultiplier();

    // Update UI
    updateDisplay();
    renderStore();
    renderActiveUpgrades();

    // Save the game state immediately after prestige
    saveGame();
}

// Add event listener for the Prestige button
prestigeButton.addEventListener('click', performPrestige);


// --- Helper Functions ---

// Function to format large numbers into a value and a word suffix (e.g., { value: "1.23", suffixWord: "Million" })
function formatNumberShort(number) {
    number = Math.floor(number);

    const suffixes = [
        // Add more if needed (e.g., Sextillion, Septillion)
        { value: 1e18, word: "Quintillion" },
        { value: 1e15, word: "Quadrillion" },
        { value: 1e12, word: "Trillion" },
        { value: 1e9,  word: "Billion" },
        { value: 1e6,  word: "Million" }
    ];

    for (let i = 0; i < suffixes.length; i++) {
        if (number >= suffixes[i].value) {
            const shortValue = (number / suffixes[i].value).toFixed(2);
            return { value: shortValue, suffixWord: suffixes[i].word };
        }
    }

    // If below 1 million, return standard formatting and empty suffix word
    return { value: number.toLocaleString(), suffixWord: "" };
}

// Reset game function (useful for errors or explicit reset)
function resetGame() {
    console.warn("Resetting game state to defaults.");
    points = 0;
    prestigePoints = 0;
    totalPointsAccumulated = 0; // Reset accumulator on reset
    clickMultiplier = 0;
    autoPointsPerSecond = 0;
    lastActiveTime = Date.now();
    upgrades = JSON.parse(JSON.stringify(initialUpgrades));

    // Recalculate multipliers (will be 0)
    autoPointsPerSecond = calculateTotalAutoPPS();
    clickMultiplier = calculateTotalClickMultiplier();

    // Update UI
    updateDisplay();
    renderStore();
    renderActiveUpgrades();
    localStorage.removeItem('idleClickerSave'); // Clear save data on reset
    console.log("Game Reset and Save Cleared.");
    // Optionally display a reset confirmation message briefly
    if (saveStatusElement) {
        saveStatusElement.textContent = "Game Reset!";
        if (saveStatusTimeoutId) clearTimeout(saveStatusTimeoutId);
        saveStatusTimeoutId = setTimeout(() => {
             if (saveStatusElement) saveStatusElement.textContent = '\u00A0';
             saveStatusTimeoutId = null;
         }, 2500);
    }
}

// Final initial UI updates after all functions are defined
updateDisplay();
renderStore();
renderActiveUpgrades();

// Reset link listener
if (resetLink) {
    resetLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent navigating to #
        if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            resetGame();
        }
    });
} 