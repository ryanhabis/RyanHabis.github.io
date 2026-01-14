// ===== DICE ROLLER =====
let rollHistory = [];

function rollDice(sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    const rollEntry = {
        die: `d${sides}`,
        result: result,
        time: new Date().toLocaleTimeString()
    };
    
    rollHistory.unshift(rollEntry);
    
    // Update display
    document.getElementById('diceResult').innerHTML = 
        `🎲 <strong>d${sides}</strong> → <span style="font-size: 2em;">${result}</span>`;
    
    // Update history (show last 5 rolls)
    const historyText = rollHistory.slice(0, 5).map(roll => 
        `${roll.die}: ${roll.result}`
    ).join(', ');
    
    document.getElementById('rollHistory').textContent = `Previous: ${historyText}`;
    
    // Animation
    const resultElement = document.getElementById('diceResult');
    resultElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        resultElement.style.transform = 'scale(1)';
    }, 200);
}

// Quick roll buttons (alternative to onclick)
document.querySelectorAll('.dice-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const sides = parseInt(this.textContent.replace('D', ''));
        rollDice(sides);
    });
});

// ===== INITIATIVE TRACKER =====
let initiativeList = [];

function addCharacter() {
    const nameInput = document.getElementById('charName');
    const initInput = document.getElementById('charInit');
    
    const name = nameInput.value.trim();
    const initiative = parseInt(initInput.value);
    
    if (!name || isNaN(initiative)) {
        alert('Please enter both name and initiative value');
        return;
    }
    
    initiativeList.push({
        name: name,
        initiative: initiative,
        hp: 100, // Default HP
        status: 'Active'
    });
    
    // Sort by initiative (highest first)
    initiativeList.sort((a, b) => b.initiative - a.initiative);
    
    updateInitiativeDisplay();
    
    // Clear inputs
    nameInput.value = '';
    initInput.value = '';
    nameInput.focus();
}

function updateInitiativeDisplay() {
    const combatList = document.getElementById('combatList');
    combatList.innerHTML = '';
    
    initiativeList.forEach((char, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}. <strong>${char.name}</strong></span>
            <span>Initiative: ${char.initiative}</span>
            <span>HP: ${char.hp}</span>
            <span class="status">${char.status}</span>
            <button onclick="removeCharacter(${index})">✕</button>
        `;
        combatList.appendChild(li);
    });
}

function removeCharacter(index) {
    initiativeList.splice(index, 1);
    updateInitiativeDisplay();
}

// ===== PASSWORD PROTECTION =====
function checkPassword() {
    // Remove or comment this out to disable password
    const correctPassword = "gamenight"; // Change this!
    const enteredPassword = prompt("Enter the game night password:");
    
    if (enteredPassword !== correctPassword) {
        alert("Incorrect password. Redirecting to portfolio.");
        window.location.href = "/";
    }
}

// Uncomment the next line to enable password protection
// window.onload = checkPassword;

// ===== LOCAL STORAGE =====
function saveToLocalStorage() {
    localStorage.setItem('initiativeList', JSON.stringify(initiativeList));
    localStorage.setItem('rollHistory', JSON.stringify(rollHistory.slice(0, 10)));
}

function loadFromLocalStorage() {
    const savedInitiative = localStorage.getItem('initiativeList');
    const savedRolls = localStorage.getItem('rollHistory');
    
    if (savedInitiative) {
        initiativeList = JSON.parse(savedInitiative);
        updateInitiativeDisplay();
    }
    
    if (savedRolls) {
        rollHistory = JSON.parse(savedRolls);
        if (rollHistory.length > 0) {
            const lastRoll = rollHistory[0];
            document.getElementById('diceResult').textContent = 
                `Last roll: d${lastRoll.die} → ${lastRoll.result}`;
        }
    }
}

// Auto-save every 30 seconds
setInterval(saveToLocalStorage, 30000);

// Load saved data on page load
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);