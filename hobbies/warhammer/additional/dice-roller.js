// Dice Roller for Warhammer 40k
class DiceRoller {
    constructor() {
        this.history = [];
        this.currentRoll = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateHistoryCount();
    }

    setupEventListeners() {
        // Standard dice buttons
        document.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                this.rollDice(dice);
            });
        });

        // Custom roll button
        document.getElementById('custom-roll-btn').addEventListener('click', () => {
            const count = parseInt(document.getElementById('dice-count').value) || 1;
            const sides = parseInt(document.getElementById('dice-sides').value) || 6;
            this.rollCustomDice(count, sides);
        });

        // Roll all button
        document.getElementById('roll-all').addEventListener('click', () => {
            const dice = '1d6'; // Default roll
            this.rollDice(dice);
        });

        // Clear history
        document.getElementById('clear-results').addEventListener('click', () => {
            this.clearHistory();
        });

        // Battle scenario button
        document.getElementById('battle-scenario').addEventListener('click', () => {
            this.generateBattleScenario('random');
        });

        // Scenario type buttons
        document.querySelectorAll('.scenario-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.generateBattleScenario(type);
            });
        });
    }

    rollDice(diceString) {
        const [count, sides] = diceString.split('d').map(Number);
        this.rollCustomDice(count, sides);
    }

    rollCustomDice(count, sides) {
        const modifier = parseInt(document.getElementById('modifier').value) || 0;
        const advantage = document.getElementById('advantage').checked;
        const disadvantage = document.getElementById('disadvantage').checked;
        
        // Clear previous dice display
        const diceDisplay = document.getElementById('dice-display');
        diceDisplay.innerHTML = '';
        
        let rolls = [];
        let total = 0;
        
        // Roll the dice
        for (let i = 0; i < count; i++) {
            let roll = Math.floor(Math.random() * sides) + 1;
            
            // Handle advantage/disadvantage
            if (advantage || disadvantage) {
                let secondRoll = Math.floor(Math.random() * sides) + 1;
                if (advantage) {
                    roll = Math.max(roll, secondRoll);
                } else {
                    roll = Math.min(roll, secondRoll);
                }
            }
            
            rolls.push(roll);
            total += roll;
            
            // Create and animate dice element
            const diceElement = this.createDiceElement(roll, sides);
            diceDisplay.appendChild(diceElement);
            
            // Animate dice
            setTimeout(() => {
                diceElement.classList.add('rolling');
                setTimeout(() => {
                    diceElement.classList.remove('rolling');
                }, 500);
            }, i * 100);
        }
        
        // Apply modifier
        total += modifier;
        
        // Store current roll
        this.currentRoll = {
            dice: `${count}d${sides}`,
            rolls: rolls,
            modifier: modifier,
            total: total,
            timestamp: new Date().toLocaleTimeString()
        };
        
        // Add to history
        this.history.unshift(this.currentRoll);
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        // Update display
        this.updateDisplay();
        this.updateHistoryDisplay();
    }

    createDiceElement(value, sides) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = value;
        
        // Add special classes for critical rolls
        if (value === sides) {
            dice.classList.add('critical-success');
        } else if (value === 1) {
            dice.classList.add('critical-failure');
        }
        
        return dice;
    }

    updateDisplay() {
        if (!this.currentRoll) return;
        
        document.getElementById('total-result').textContent = this.currentRoll.total;
        document.getElementById('dice-used').textContent = this.currentRoll.dice;
        document.getElementById('modifier-used').textContent = this.currentRoll.modifier;
        document.getElementById('individual-rolls').textContent = this.currentRoll.rolls.join(', ');
        
        // Add visual feedback for high/low rolls
        const totalElement = document.getElementById('total-result');
        totalElement.classList.remove('critical-success', 'critical-failure');
        
        const maxPossible = parseInt(this.currentRoll.dice.split('d')[0]) * 
                           parseInt(this.currentRoll.dice.split('d')[1]) + 
                           this.currentRoll.modifier;
        const minPossible = parseInt(this.currentRoll.dice.split('d')[0]) + 
                           this.currentRoll.modifier;
        
        if (this.currentRoll.total === maxPossible) {
            totalElement.classList.add('critical-success');
        } else if (this.currentRoll.total === minPossible) {
            totalElement.classList.add('critical-failure');
        }
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.history.forEach((roll, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const maxPossible = parseInt(roll.dice.split('d')[0]) * 
                               parseInt(roll.dice.split('d')[1]) + 
                               roll.modifier;
            
            item.innerHTML = `
                <div>
                    <div class="history-dice">${roll.dice}${roll.modifier >= 0 ? '+' : ''}${roll.modifier}</div>
                    <div class="history-time">${roll.timestamp}</div>
                </div>
                <div class="history-result ${roll.total === maxPossible ? 'critical-success' : roll.total === (parseInt(roll.dice.split('d')[0]) + roll.modifier) ? 'critical-failure' : ''}">
                    ${roll.total}
                </div>
            `;
            
            historyList.appendChild(item);
        });
        
        this.updateHistoryCount();
    }

    updateHistoryCount() {
        document.getElementById('history-count').textContent = `(${this.history.length})`;
    }

    clearHistory() {
        this.history = [];
        this.currentRoll = null;
        document.getElementById('dice-display').innerHTML = '';
        document.getElementById('total-result').textContent = '-';
        document.getElementById('dice-used').textContent = '-';
        document.getElementById('modifier-used').textContent = '0';
        document.getElementById('individual-rolls').textContent = '-';
        this.updateHistoryDisplay();
    }

    generateBattleScenario(type) {
        const scenarios = {
            deployment: [
                "Dawn of War: Long table edges deployment",
                "Search and Destroy: Diagonal deployment",
                "Hammer and Anvil: Short table edges",
                "Front-line Warfare: Center line deployment",
                "Spearhead Assault: Corner deployment zones",
                "Crucible of Battle: Whole table deployment"
            ],
            mission: [
                "Purge the Enemy: Slay as many enemy units as possible",
                "No Mercy, No Respite: Hold objectives each turn",
                "Battlefield Supremacy: Control table quarters",
                "Warpcraft: Perform psychic actions",
                "Retrieval Mission: Secure ancient relics",
                "Assassination: Target enemy characters"
            ],
            objective: [
                "Secure No Man's Land: Hold central objective",
                "Behind Enemy Lines: Deploy in enemy zone",
                "Target Priority: Eliminate specific unit type",
                "Psyker's Bane: Deny the Witch",
                "Overwhelming Force: Table opponent in 3 turns",
                "Tactical Flexibility: Complete 3 different secondaries"
            ],
            twist: [
                "Sudden Death: Game ends turn 4, victory points doubled",
                "Reinforcements: Both players get 200pt reinforcement turn 3",
                "Psy-storm: All psychic tests at -2",
                "Night Fighting: All shooting at -1 to hit beyond 12\"",
                "Heavy Mists: Movement halved, charges +3\"",
                "Command Uplink: All stratagems cost 1CP less"
            ]
        };
        
        if (type === 'random') {
            const types = Object.keys(scenarios);
            type = types[Math.floor(Math.random() * types.length)];
        }
        
        const scenarioList = scenarios[type];
        const randomScenario = scenarioList[Math.floor(Math.random() * scenarioList.length)];
        
        const scenarioCard = document.getElementById('scenario-card');
        scenarioCard.innerHTML = `
            <div class="scenario-icon">${this.getScenarioIcon(type)}</div>
            <h4>${this.getScenarioTitle(type)}</h4>
            <p>${randomScenario}</p>
            <small>Roll: ${Math.floor(Math.random() * 6) + 1}</small>
        `;
        
        // Add visual feedback
        scenarioCard.style.borderColor = this.getScenarioColor(type);
        scenarioCard.style.animation = 'fadeIn 0.5s ease';
    }

    getScenarioIcon(type) {
        const icons = {
            deployment: '📍',
            mission: '🎯',
            objective: '⚔️',
            twist: '🌀',
            random: '🎲'
        };
        return icons[type] || '🎲';
    }

    getScenarioTitle(type) {
        const titles = {
            deployment: 'Deployment Zone',
            mission: 'Primary Mission',
            objective: 'Secondary Objectives',
            twist: 'Battle Twist',
            random: 'Random Scenario'
        };
        return titles[type] || 'Scenario';
    }

    getScenarioColor(type) {
        const colors = {
            deployment: '#0d47a1',
            mission: '#b71c1c',
            objective: '#d4af37',
            twist: '#1b5e20',
            random: '#8b0000'
        };
        return colors[type] || '#5d4037';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const diceRoller = new DiceRoller();
    
    // Make diceRoller available globally for console testing
    window.diceRoller = diceRoller;
    
    // Auto-roll example on page load
    setTimeout(() => {
        diceRoller.rollDice('1d6');
    }, 1000);
});