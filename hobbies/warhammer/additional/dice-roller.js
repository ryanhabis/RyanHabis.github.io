// Warhammer 40k - Complete JavaScript File

// ===========================================
// NAVIGATION MANAGER
// ===========================================
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'warhammer.html';
        return filename.replace('.html', '');
    }

    init() {
        this.setupNavigation();
        this.highlightCurrentNav();
        this.addNavigationHelpers();
        this.addPageIndicator();
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Handle anchor links on main page
                if (href.startsWith('#') && this.isOnMainPage()) {
                    e.preventDefault();
                    this.handleAnchorLink(href, link);
                }
                // For all other links, let browser handle normally
            });
        });
    }

    isOnMainPage() {
        return this.currentPage === 'warhammer' || 
               window.location.pathname.includes('warhammer.html') ||
               window.location.pathname.endsWith('/warhammer');
    }

    handleAnchorLink(href, clickedLink) {
        const targetId = href;
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Update active nav link
            this.navLinks.forEach(l => l.classList.remove('active'));
            clickedLink.classList.add('active');
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, null, href);
        }
    }

    highlightCurrentNav() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (this.shouldBeActive(link, href)) {
                link.classList.add('active');
            }
        });
    }

    shouldBeActive(link, href) {
        // If we're on the main warhammer page
        if (this.isOnMainPage()) {
            // Check if it's an anchor link that matches current hash
            if (href.startsWith('#') && href === window.location.hash) {
                return true;
            }
            // Check if it's the home link
            if ((href === '#' || href === '#home') && !window.location.hash) {
                return true;
            }
        }
        
        // Check if link points to current page
        if (href.includes('.html')) {
            const linkedPage = href.split('/').pop().replace('.html', '');
            return linkedPage === this.currentPage;
        }
        
        return false;
    }

    addNavigationHelpers() {
        // Add back to top button
        this.addBackToTopButton();
        
        // Highlight nav on scroll (for main page only)
        if (this.isOnMainPage()) {
            this.setupScrollHighlighting();
        }
    }

    addBackToTopButton() {
        // Only add if not already present
        if (document.getElementById('backToTop')) return;
        
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.className = 'back-to-top';
        button.textContent = '↑ To the Emperor ↑';
        button.style.display = 'none';
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    }

    setupScrollHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const anchorLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || anchorLinks.length === 0) return;
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            anchorLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    addPageIndicator() {
        const indicators = {
            'warhammer': 'IMPERIUM SANCTUS',
            'army-builder': 'ARMORY OF THE EMPEROR',
            'dice-roller': 'DICE OF FATE',
            'collection-tracker': 'FORGE WORLD COLLECTION',
            'tactics': 'WAR ROOM: TACTICAL DOCTRINES',
            'campaign-tracker': 'CRUSADE CAMPAIGNS',
            'rules-reference': 'CODEX QUICK REFERENCE',
            'painting-guide': 'ARTISAN\'S PAINTING GUIDE'
        };
        
        const indicator = document.querySelector('.page-indicator');
        if (indicator && indicators[this.currentPage]) {
            indicator.textContent = indicators[this.currentPage];
        }
    }
}

// ===========================================
// DICE ROLLER - FIXED VERSION
// ===========================================
class DiceRoller {
    constructor() {
        // Check if we're on the dice roller page
        if (!this.isDiceRollerPage()) {
            console.log('Not on dice roller page, skipping initialization');
            return;
        }
        
        this.history = [];
        this.currentRoll = null;
        this.init();
    }

    isDiceRollerPage() {
        const path = window.location.pathname;
        return path.includes('dice-roller') || 
               path.includes('dice-roller.html') ||
               document.querySelector('.dice-roller-container') !== null;
    }

    init() {
        this.setupEventListeners();
        this.updateHistoryCount();
        this.loadFromStorage();
    }

    setupEventListeners() {
        // Standard dice buttons - check they exist
        const diceButtons = document.querySelectorAll('.dice-btn');
        if (diceButtons.length === 0) {
            console.error('No dice buttons found on page');
            return;
        }
        
        diceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                this.rollDice(dice);
            });
        });

        // Custom roll button - check it exists
        const customRollBtn = document.getElementById('custom-roll-btn');
        if (customRollBtn) {
            customRollBtn.addEventListener('click', () => {
                const count = parseInt(document.getElementById('dice-count').value) || 1;
                const sides = parseInt(document.getElementById('dice-sides').value) || 6;
                this.rollCustomDice(count, sides);
            });
        }

        // Roll all button - check it exists
        const rollAllBtn = document.getElementById('roll-all');
        if (rollAllBtn) {
            rollAllBtn.addEventListener('click', () => {
                const dice = '1d6'; // Default roll
                this.rollDice(dice);
            });
        }

        // Clear history - check it exists
        const clearBtn = document.getElementById('clear-results');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }

        // Battle scenario button - check it exists
        const scenarioBtn = document.getElementById('battle-scenario');
        if (scenarioBtn) {
            scenarioBtn.addEventListener('click', () => {
                this.generateBattleScenario('random');
            });
        }

        // Scenario type buttons
        const scenarioTypeButtons = document.querySelectorAll('.scenario-type');
        scenarioTypeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.generateBattleScenario(type);
            });
        });

        // Enter key for custom dice
        const diceCountInput = document.getElementById('dice-count');
        const diceSidesInput = document.getElementById('dice-sides');
        
        if (diceCountInput && diceSidesInput) {
            diceCountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const count = parseInt(diceCountInput.value) || 1;
                    const sides = parseInt(diceSidesInput.value) || 6;
                    this.rollCustomDice(count, sides);
                }
            });
            
            diceSidesInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const count = parseInt(diceCountInput.value) || 1;
                    const sides = parseInt(diceSidesInput.value) || 6;
                    this.rollCustomDice(count, sides);
                }
            });
        }
    }

    rollDice(diceString) {
        const [count, sides] = diceString.split('d').map(Number);
        this.rollCustomDice(count, sides);
    }

    rollCustomDice(count, sides) {
        const modifier = parseInt(document.getElementById('modifier')?.value) || 0;
        const advantage = document.getElementById('advantage')?.checked || false;
        const disadvantage = document.getElementById('disadvantage')?.checked || false;
        
        // Clear previous dice display
        const diceDisplay = document.getElementById('dice-display');
        if (diceDisplay) diceDisplay.innerHTML = '';
        
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
            if (diceDisplay) {
                diceDisplay.appendChild(diceElement);
                
                // Animate dice
                setTimeout(() => {
                    diceElement.classList.add('rolling');
                    setTimeout(() => {
                        diceElement.classList.remove('rolling');
                    }, 500);
                }, i * 100);
            }
        }
        
        // Apply modifier
        total += modifier;
        
        // Store current roll
        this.currentRoll = {
            dice: `${count}d${sides}`,
            rolls: rolls,
            modifier: modifier,
            total: total,
            timestamp: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        };
        
        // Add to history
        this.history.unshift(this.currentRoll);
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        // Update display
        this.updateDisplay();
        this.updateHistoryDisplay();
        this.saveToStorage();
        
        // Play roll sound
        this.playRollSound();
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
        
        const totalElement = document.getElementById('total-result');
        const diceUsedElement = document.getElementById('dice-used');
        const modifierUsedElement = document.getElementById('modifier-used');
        const individualRollsElement = document.getElementById('individual-rolls');
        
        if (totalElement) totalElement.textContent = this.currentRoll.total;
        if (diceUsedElement) diceUsedElement.textContent = this.currentRoll.dice;
        if (modifierUsedElement) modifierUsedElement.textContent = this.currentRoll.modifier;
        if (individualRollsElement) individualRollsElement.textContent = this.currentRoll.rolls.join(', ');
        
        // Add visual feedback for high/low rolls
        if (totalElement) {
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
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
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
            
            // Add click to re-roll
            item.addEventListener('click', () => {
                this.rollDice(roll.dice);
            });
            
            historyList.appendChild(item);
        });
        
        this.updateHistoryCount();
    }

    updateHistoryCount() {
        const historyCount = document.getElementById('history-count');
        if (historyCount) {
            historyCount.textContent = `(${this.history.length})`;
        }
    }

    clearHistory() {
        if (confirm('Clear all roll history?')) {
            this.history = [];
            this.currentRoll = null;
            const diceDisplay = document.getElementById('dice-display');
            if (diceDisplay) diceDisplay.innerHTML = '';
            
            const totalElement = document.getElementById('total-result');
            const diceUsedElement = document.getElementById('dice-used');
            const modifierUsedElement = document.getElementById('modifier-used');
            const individualRollsElement = document.getElementById('individual-rolls');
            
            if (totalElement) totalElement.textContent = '-';
            if (diceUsedElement) diceUsedElement.textContent = '-';
            if (modifierUsedElement) modifierUsedElement.textContent = '0';
            if (individualRollsElement) individualRollsElement.textContent = '-';
            
            this.updateHistoryDisplay();
            localStorage.removeItem('warhammerDiceHistory');
        }
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
        if (scenarioCard) {
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

    playRollSound() {
        // Create a simple sound effect using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 100 + Math.random() * 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Audio not supported, silent fail
            console.log('Audio context not supported');
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('warhammerDiceHistory', JSON.stringify(this.history));
        } catch (e) {
            // LocalStorage not available, silent fail
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('warhammerDiceHistory');
            if (saved) {
                this.history = JSON.parse(saved);
                this.updateHistoryDisplay();
            }
        } catch (e) {
            // LocalStorage not available, silent fail
        }
    }
}

// ===========================================
// ARMY CARDS INTERACTIVITY
// ===========================================
function setupArmyCards() {
    const armyCards = document.querySelectorAll('.army-card');
    
    armyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const header = this.querySelector('.card-header');
            if (header && header.classList.contains('astartes')) {
                this.style.boxShadow = '0 10px 20px rgba(13, 71, 161, 0.3)';
            } else if (header && header.classList.contains('imperial')) {
                this.style.boxShadow = '0 10px 20px rgba(55, 71, 79, 0.3)';
            } else if (header && header.classList.contains('chaos')) {
                this.style.boxShadow = '0 10px 20px rgba(183, 28, 28, 0.3)';
            } else if (header && header.classList.contains('xenos')) {
                this.style.boxShadow = '0 10px 20px rgba(27, 94, 32, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
        
        // Click to expand
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const content = this.querySelector('p');
            if (content) {
                if (this.classList.contains('expanded')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '60px';
                }
            }
        });
    });
}

// ===========================================
// LORE TYPEWRITER EFFECT
// ===========================================
function setupLoreTypewriter() {
    const loreItems = document.querySelectorAll('.lore-item p');
    
    loreItems.forEach(item => {
        const originalText = item.textContent;
        item.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                item.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 20);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(item);
    });
}

// ===========================================
// IMPERIAL QUOTE ROTATOR
// ===========================================
class QuoteRotator {
    constructor() {
        this.quotes = [
            "Blessed is the mind too small for doubt.",
            "An open mind is like a fortress with its gates unbarred and unguarded.",
            "Hope is the first step on the road to disappointment.",
            "Knowledge is power, guard it well.",
            "Innocence proves nothing.",
            "A small mind is easily filled with faith.",
            "Even a man who has nothing can still offer his life.",
            "The difference between heresy and treachery is ignorance.",
            "Success is commemorated; Failure merely remembered.",
            "The Emperor protects.",
            "Only in death does duty end.",
            "No man died in His service that died in vain."
        ];
        
        this.currentIndex = 0;
        this.interval = null;
        this.init();
    }

    init() {
        const footerQuote = document.querySelector('.footer-text');
        if (footerQuote) {
            // Set initial quote
            footerQuote.textContent = `"${this.quotes[this.currentIndex]}"`;
            
            // Start rotation
            this.startRotation();
            
            // Pause on hover
            footerQuote.addEventListener('mouseenter', () => {
                this.stopRotation();
            });
            
            footerQuote.addEventListener('mouseleave', () => {
                this.startRotation();
            });
            
            // Click to change quote
            footerQuote.addEventListener('click', () => {
                this.nextQuote();
            });
        }
    }

    nextQuote() {
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        const footerQuote = document.querySelector('.footer-text');
        if (footerQuote) {
            footerQuote.style.opacity = '0';
            setTimeout(() => {
                footerQuote.textContent = `"${this.quotes[this.currentIndex]}"`;
                footerQuote.style.opacity = '1';
            }, 300);
        }
    }

    startRotation() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.nextQuote();
            }, 10000); // Change every 10 seconds
        }
    }

    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// ===========================================
// MINIATURE PREVIEW INTERACTIVITY
// ===========================================
function setupMiniaturePreviews() {
    const miniaturePreviews = document.querySelectorAll('.miniature-preview');
    
    miniaturePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            this.classList.toggle('zoomed');
            
            if (this.classList.contains('zoomed')) {
                this.style.transform = 'scale(2)';
                this.style.zIndex = '1000';
                this.style.position = 'fixed';
                this.style.top = '50%';
                this.style.left = '50%';
                this.style.transform = 'translate(-50%, -50%) scale(2)';
                
                // Add overlay
                const overlay = document.createElement('div');
                overlay.className = 'preview-overlay';
                overlay.addEventListener('click', () => {
                    this.classList.remove('zoomed');
                    this.style.cssText = '';
                    document.body.removeChild(overlay);
                });
                document.body.appendChild(overlay);
            } else {
                this.style.cssText = '';
                const overlay = document.querySelector('.preview-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            }
        });
    });
}

// ===========================================
// BATTLE DATE GENERATOR
// ===========================================
function generateImperialDates() {
    function generateDate() {
        const day = Math.floor(Math.random() * 999) + 1;
        const year = Math.floor(Math.random() * 999) + 1;
        const millenium = 42;
        return `${day.toString().padStart(3, '0')}.${year.toString().padStart(3, '0')}.M${millenium}`;
    }

    const battleDates = document.querySelectorAll('.battle-date');
    battleDates.forEach(dateElement => {
        dateElement.textContent = generateDate();
    });
}

// ===========================================
// MAIN INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Warhammer 40k Site Initializing...');
    
    // Initialize Navigation (always runs)
    const navManager = new NavigationManager();
    
    // Initialize Dice Roller (only on dice-roller page)
    if (window.location.pathname.includes('dice-roller') || 
        document.querySelector('.dice-roller-container')) {
        console.log('Initializing Dice Roller...');
        const diceRoller = new DiceRoller();
        
        // Make available globally for testing
        window.diceRoller = diceRoller;
        
        // Auto-roll example on page load
        setTimeout(() => {
            if (diceRoller && diceRoller.rollDice) {
                diceRoller.rollDice('1d6');
            }
        }, 1000);
    }
    
    // Initialize Quote Rotator (always runs)
    const quoteRotator = new QuoteRotator();
    
    // Set up interactive elements (only if they exist on page)
    if (document.querySelector('.army-card')) {
        setupArmyCards();
    }
    
    if (document.querySelector('.lore-item p')) {
        setupLoreTypewriter();
    }
    
    if (document.querySelector('.miniature-preview')) {
        setupMiniaturePreviews();
    }
    
    if (document.querySelector('.battle-date')) {
        generateImperialDates();
    }
    
    // Add CSS for preview overlay
    const style = document.createElement('style');
    style.textContent = `
        .preview-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999;
            cursor: pointer;
        }
        
        .miniature-preview.zoomed {
            transition: transform 0.3s ease;
            cursor: zoom-out;
        }
        
        .army-card p {
            transition: max-height 0.3s ease;
            overflow: hidden;
            max-height: 60px;
        }
        
        .army-card.expanded p {
            max-height: 500px;
        }
        
        /* Dice animations */
        @keyframes diceRoll {
            0% { transform: rotate(0deg) scale(0.8); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
        
        .dice.rolling {
            animation: diceRoll 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Update copyright year to Imperial date
    const copyrightElement = document.querySelector('.copyright p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        const imperialYear = currentYear - 2000 + 41; // Convert to M41+
        copyrightElement.textContent = copyrightElement.textContent.replace(
            '999.M41',
            `001.001.M${imperialYear}`
        );
    }
    
    // Console greeting
    console.log('%c⚔ Grimdark Archives ⚔', 'color: #d4af37; font-size: 24px; font-family: "Cinzel", serif;');
    console.log('%cThe Emperor protects.', 'color: #8b0000; font-size: 14px;');
});