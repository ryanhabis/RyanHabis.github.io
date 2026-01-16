// Warhammer 40k Rules Reference System
class RulesReference {
    constructor() {
        this.rules = [];
        this.filteredRules = [];
        this.currentCategory = 'all';
        this.currentFaction = 'all';
        this.currentDifficulty = 'all';
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        this.loadRules();
        this.setupEventListeners();
        this.renderRules();
        this.setupAccordion();
    }

    loadRules() {
        // Core rules data
        this.rules = [
            // Battle Phases
            {
                id: 'phase-command',
                title: 'Command Phase',
                category: 'phases',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>The Command Phase is the first phase of each player's turn. In this phase:</p>
                    <ul>
                        <li>Gain 1 Command Point (unless you went second in the first battle round)</li>
                        <li>Use Command Phase abilities and Stratagems</li>
                        <li>Score Primary Objectives if playing with mission rules</li>
                    </ul>
                    <p><strong>Note:</strong> The player who goes second in the first battle round does not gain a Command Point in their first Command Phase.</p>
                `,
                tags: ['phase', 'command', 'cp']
            },
            {
                id: 'phase-movement',
                title: 'Movement Phase',
                category: 'phases',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>In the Movement phase, you can move your units. Each unit can make a Normal Move, Advance, Remain Stationary, or Fall Back.</p>
                    
                    <h5>Move Types:</h5>
                    <ul>
                        <li><strong>Normal Move:</strong> Move up to the unit's Move characteristic</li>
                        <li><strong>Advance:</strong> Roll a D6 and add to Move characteristic</li>
                        <li><strong>Remain Stationary:</strong> Don't move</li>
                        <li><strong>Fall Back:</strong> Move away from enemy units (cannot shoot or charge afterwards)</li>
                    </ul>
                    
                    <h5>Movement Restrictions:</h5>
                    <ul>
                        <li>Cannot move within Engagement Range of enemy units (except to Fall Back)</li>
                        <li>Cannot move through terrain unless you have appropriate rules</li>
                        <li>Must end move wholly on the battlefield</li>
                    </ul>
                `,
                tags: ['phase', 'movement', 'move', 'advance', 'fall back']
            },
            {
                id: 'phase-shooting',
                title: 'Shooting Phase',
                category: 'shooting',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>In the Shooting phase, eligible units can shoot at enemy units.</p>
                    
                    <h5>Shooting Sequence:</h5>
                    <ol>
                        <li><strong>Select Unit:</strong> Choose an eligible unit to shoot</li>
                        <li><strong>Select Targets:</strong> Choose targets for the unit's weapons</li>
                        <li><strong>Select Weapons:</strong> Choose which weapons to fire</li>
                        <li><strong>Make Attacks:</strong> For each weapon, roll to hit, then to wound, then enemy makes saves</li>
                        <li><strong>Inflict Damage:</strong> Remove casualties based on damage</li>
                    </ol>
                    
                    <h5>Eligibility:</h5>
                    <ul>
                        <li>Units that Advanced or Fell Back cannot shoot (unless specified)</li>
                        <li>Units in Engagement Range can only shoot at enemies they're engaged with</li>
                        <li>Units cannot shoot while performing actions</li>
                    </ul>
                `,
                tags: ['phase', 'shooting', 'shoot', 'attack', 'weapons']
            },
            {
                id: 'phase-charge',
                title: 'Charge Phase',
                category: 'combat',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>In the Charge phase, eligible units can declare and make charge moves.</p>
                    
                    <h5>Declaring a Charge:</h5>
                    <ul>
                        <li>Select an eligible unit within 12" of one or more enemy units</li>
                        <li>Roll 2D6 for charge distance</li>
                        <li>If total is equal to or greater than distance to closest enemy, charge succeeds</li>
                        <li>You can declare multiple enemy units as charge targets</li>
                    </ul>
                    
                    <h5>Making Charge Moves:</h5>
                    <ul>
                        <li>Move charging unit up to charge distance</li>
                        <li>Must end move within Engagement Range of all declared targets</li>
                        <li>Cannot move within Engagement Range of units not declared as targets</li>
                        <li>If charge fails, unit cannot move this phase</li>
                    </ul>
                `,
                tags: ['phase', 'charge', 'combat', 'melee']
            },
            {
                id: 'phase-fight',
                title: 'Fight Phase',
                category: 'combat',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>In the Fight phase, units in Engagement Range fight in close combat.</p>
                    
                    <h5>Fight Sequence:</h5>
                    <ol>
                        <li><strong>Select Unit to Fight:</strong> Alternate selecting eligible units starting with player whose turn it is</li>
                        <li><strong>Pile In:</strong> Move models up to 3" closer to the nearest enemy</li>
                        <li><strong>Make Attacks:</strong> Models make melee attacks</li>
                        <li><strong>Consolidate:</strong> Move models up to 3" towards nearest enemy</li>
                    </ol>
                    
                    <h5>Attack Sequence:</h5>
                    <ol>
                        <li>Select targets within Engagement Range</li>
                        <li>Roll to hit (using Weapon Skill)</li>
                        <li>Roll to wound (Strength vs Toughness)</li>
                        <li>Enemy makes saving throws</li>
                        <li>Inflict damage</li>
                    </ol>
                `,
                tags: ['phase', 'fight', 'combat', 'melee', 'attack']
            },
            {
                id: 'phase-morale',
                title: 'Morale Phase',
                category: 'morale',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>In the Morale phase, test for units that have lost models this turn.</p>
                    
                    <h5>Morale Test:</h5>
                    <ul>
                        <li>Units that lost models this turn must take a Leadership test</li>
                        <li>Roll 2D6 and compare to unit's Leadership characteristic</li>
                        <li>If roll is higher than Leadership, test is failed</li>
                        <li>For each point the test is failed by, one model flees (Combat Attrition)</li>
                    </ul>
                    
                    <h5>Combat Attrition:</h5>
                    <ul>
                        <li>For each model that flees, roll a D6</li>
                        <li>On a 1, that model flees</li>
                        <li>Models with certain abilities may modify this roll</li>
                    </ul>
                `,
                tags: ['phase', 'morale', 'leadership', 'attrition']
            },
            {
                id: 'phase-psychic',
                title: 'Psychic Phase',
                category: 'psychic',
                faction: 'core',
                difficulty: 'intermediate',
                content: `
                    <p>In the Psychic phase, PSYKER units can attempt to manifest psychic powers.</p>
                    
                    <h5>Manifesting Psychic Powers:</h5>
                    <ol>
                        <li>Select a PSYKER unit</li>
                        <li>Select a psychic power it knows</li>
                        <li>Take a Psychic test by rolling 2D6</li>
                        <li>If result equals or exceeds the power's warp charge value, power is manifested</li>
                        <li>Opponent may attempt to Deny the Witch</li>
                    </ol>
                    
                    <h5>Deny the Witch:</h5>
                    <ul>
                        <li>Opponent selects a PSYKER unit within 24" of manifesting unit</li>
                        <li>Takes a Deny the Witch test by rolling 2D6</li>
                        <li>If result is higher than the Psychic test result, power is denied</li>
                    </ul>
                `,
                tags: ['phase', 'psychic', 'psyker', 'powers', 'manifest']
            },
            
            // Combat Rules
            {
                id: 'combat-engagement',
                title: 'Engagement Range',
                category: 'combat',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>Engagement Range is the area within 1" horizontally and 5" vertically of an enemy model.</p>
                    
                    <h5>Key Rules:</h5>
                    <ul>
                        <li>Units within Engagement Range of enemy units are in melee combat</li>
                        <li>Units in Engagement Range cannot shoot (except Pistols)</li>
                        <li>Units cannot move within Engagement Range unless charging</li>
                        <li>Units in Engagement Range can only be chosen to fight in the Fight phase</li>
                    </ul>
                `,
                tags: ['combat', 'engagement', 'melee', 'range']
            },
            {
                id: 'combat-pistols',
                title: 'Pistols in Combat',
                category: 'combat',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>Models equipped with Pistol weapons can shoot them while in Engagement Range.</p>
                    
                    <h5>Pistol Rules:</h5>
                    <ul>
                        <li>Can be shot even if bearer is in Engagement Range</li>
                        <li>Can only target enemy units that the bearer is in Engagement Range with</li>
                        <li>Cannot be fired in same turn bearer shoots with any other weapon type</li>
                        <li>Can be fired in the Shooting phase even if unit Fell Back or Advanced</li>
                    </ul>
                `,
                tags: ['combat', 'pistol', 'shooting', 'melee']
            },
            
            // Shooting Rules
            {
                id: 'shooting-line-of-sight',
                title: 'Line of Sight',
                category: 'shooting',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>To target an enemy unit, at least one model in the shooting unit must have line of sight to at least one model in the target unit.</p>
                    
                    <h5>Determining Line of Sight:</h5>
                    <ul>
                        <li>Draw imaginary straight lines from the shooting model to the target model</li>
                        <li>If any line can be drawn without passing through terrain, line of sight exists</li>
                        <li>Models can see through their own unit</li>
                        <li>True Line of Sight - if you can see it, you can shoot it</li>
                    </ul>
                    
                    <h5>Obscuring Terrain:</h5>
                    <ul>
                        <li>Models cannot see through obscuring terrain</li>
                        <li>Terrain over 5" tall is usually obscuring</li>
                        <li>Models on or within terrain may have different visibility rules</li>
                    </ul>
                `,
                tags: ['shooting', 'line of sight', 'los', 'targeting']
            },
            {
                id: 'shooting-range',
                title: 'Range and Weapons',
                category: 'shooting',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>Weapons have a range characteristic. To shoot at a target, it must be within the weapon's range.</p>
                    
                    <h5>Range Measurement:</h5>
                    <ul>
                        <li>Measure from the shooting model to the closest visible model in the target unit</li>
                        <li>If range is equal to or less than weapon range, target is in range</li>
                        <li>Different weapons in the same unit can target different enemies if in range</li>
                    </ul>
                    
                    <h5>Weapon Types:</h5>
                    <ul>
                        <li><strong>Assault:</strong> Can be fired after Advancing (-1 to hit)</li>
                        <li><strong>Heavy:</strong> -1 to hit if bearer moved</li>
                        <li><strong>Rapid Fire:</strong> Double shots at half range</li>
                        <li><strong>Grenade:</strong> One model per unit can throw a grenade</li>
                    </ul>
                `,
                tags: ['shooting', 'range', 'weapons', 'assault', 'heavy', 'rapid fire']
            },
            
            // Stratagems
            {
                id: 'stratagem-counter',
                title: 'Counter-Offensive',
                category: 'stratagems',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <div class="stratagem-details">
                        <div class="stratagem-header">
                            <h4>Counter-Offensive</h4>
                            <span class="stratagem-cp">2 CP</span>
                        </div>
                        <p class="stratagem-timing"><strong>Timing:</strong> Fight phase, after an enemy unit has fought</p>
                        <p class="stratagem-effect">
                            Use this Stratagem after an enemy unit has fought in the Fight phase. Select one of your own eligible units and fight with it next.
                        </p>
                        <div class="stratagem-tags">
                            <span class="tag core">Core Stratagem</span>
                            <span class="tag fight">Fight Phase</span>
                        </div>
                    </div>
                `,
                tags: ['stratagem', 'core', 'fight', 'counter']
            },
            {
                id: 'stratagem-insane',
                title: 'Insane Bravery',
                category: 'stratagems',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <div class="stratagem-details">
                        <div class="stratagem-header">
                            <h4>Insane Bravery</h4>
                            <span class="stratagem-cp">2 CP</span>
                        </div>
                        <p class="stratagem-timing"><strong>Timing:</strong> Morale phase, when a unit fails a Morale test</p>
                        <p class="stratagem-effect">
                            Use this Stratagem when a unit from your army fails a Morale test. That unit automatically passes that Morale test.
                        </p>
                        <div class="stratagem-tags">
                            <span class="tag core">Core Stratagem</span>
                            <span class="tag morale">Morale Phase</span>
                        </div>
                    </div>
                `,
                tags: ['stratagem', 'core', 'morale', 'bravery']
            },
            
            // Abilities
            {
                id: 'ability-deepstrike',
                title: 'Deep Strike',
                category: 'abilities',
                faction: 'core',
                difficulty: 'intermediate',
                content: `
                    <p>During deployment, units with this ability can be set up in reserve instead of on the battlefield.</p>
                    
                    <h5>Deep Strike Rules:</h5>
                    <ul>
                        <li>Can be set up in Reinforcements at the end of any of your Movement phases</li>
                        <li>Must be set up more than 9" away from enemy models</li>
                        <li>Cannot move further in the same turn (except to charge)</li>
                        <li>Count as having moved for shooting purposes</li>
                    </ul>
                    
                    <h5>Strategic Reserves:</h5>
                    <ul>
                        <li>Similar to Deep Strike but arrives from battlefield edges</li>
                        <li>Uses Command Points based on unit's Power Level</li>
                        <li>Must arrive by turn 3 or are destroyed</li>
                    </ul>
                `,
                tags: ['ability', 'deep strike', 'reserves', 'deployment']
            },
            {
                id: 'ability-fly',
                title: 'Fly',
                category: 'abilities',
                faction: 'core',
                difficulty: 'basic',
                content: `
                    <p>Models with the Fly keyword have enhanced mobility.</p>
                    
                    <h5>Fly Movement:</h5>
                    <ul>
                        <li>Can move over other models and terrain as if they were not there</li>
                        <li>Ignore vertical distance when moving (measure horizontally only)</li>
                        <li>Cannot end move on top of other models</li>
                        <li>Can Fall Back and still shoot</li>
                    </ul>
                    
                    <h5>Combat with Fly:</h5>
                    <ul>
                        <li>Can shoot after Falling Back</li>
                        <li>Can charge over other models</li>
                        <li>Subject to normal Engagement Range rules</li>
                    </ul>
                `,
                tags: ['ability', 'fly', 'movement', 'mobility']
            }
        ];
        
        this.filteredRules = [...this.rules];
    }

    setupEventListeners() {
        // Search input
        document.getElementById('rule-search').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterRules();
        });
        
        // Clear search button
        document.getElementById('clear-search-btn').addEventListener('click', () => {
            document.getElementById('rule-search').value = '';
            this.searchTerm = '';
            this.filterRules();
        });
        
        // Category filter
        document.getElementById('rule-category').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.filterRules();
        });
        
        // Faction filter
        document.getElementById('rule-faction').addEventListener('change', (e) => {
            this.currentFaction = e.target.value;
            this.filterRules();
        });
        
        // Difficulty filter
        document.getElementById('rule-difficulty').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.filterRules();
        });
        
        // Expand all button
        document.getElementById('expand-all').addEventListener('click', () => {
            this.expandAll();
        });
        
        // Collapse all button
        document.getElementById('collapse-all').addEventListener('click', () => {
            this.collapseAll();
        });
        
        // Print button
        document.getElementById('print-rules').addEventListener('click', () => {
            this.printRules();
        });
    }

    filterRules() {
        this.filteredRules = this.rules.filter(rule => {
            // Category filter
            if (this.currentCategory !== 'all' && rule.category !== this.currentCategory) {
                return false;
            }
            
            // Faction filter
            if (this.currentFaction !== 'all' && rule.faction !== this.currentFaction) {
                return false;
            }
            
            // Difficulty filter
            if (this.currentDifficulty !== 'all' && rule.difficulty !== this.currentDifficulty) {
                return false;
            }
            
            // Search filter
            if (this.searchTerm) {
                const searchInTitle = rule.title.toLowerCase().includes(this.searchTerm);
                const searchInContent = rule.content.toLowerCase().includes(this.searchTerm);
                const searchInTags = rule.tags.some(tag => tag.includes(this.searchTerm));
                
                if (!searchInTitle && !searchInContent && !searchInTags) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderRules();
        this.updateSearchResults();
    }

    renderRules() {
        const accordion = document.getElementById('rules-accordion');
        
        if (this.filteredRules.length === 0) {
            accordion.innerHTML = `
                <div class="empty-rules">
                    <div class="empty-icon">📜</div>
                    <h4>No Rules Found</h4>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }
        
        accordion.innerHTML = this.filteredRules.map(rule => `
            <div class="rule-item" data-id="${rule.id}">
                <div class="rule-header">
                    <h4>${rule.title}</h4>
                    <div class="rule-meta">
                        <span class="rule-category ${rule.category}">${this.formatCategory(rule.category)}</span>
                        <span class="rule-difficulty ${rule.difficulty}">${this.formatDifficulty(rule.difficulty)}</span>
                        <span class="rule-faction">${this.formatFaction(rule.faction)}</span>
                    </div>
                    <button class="rule-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="rule-content">
                    ${rule.content}
                    <div class="rule-tags">
                        ${rule.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        this.setupAccordion();
    }

    setupAccordion() {
        const ruleItems = document.querySelectorAll('.rule-item');
        
        ruleItems.forEach(item => {
            const header = item.querySelector('.rule-header');
            const content = item.querySelector('.rule-content');
            const toggle = item.querySelector('.rule-toggle');
            
            // Start with all collapsed
            content.style.display = 'none';
            
            header.addEventListener('click', () => {
                const isOpen = content.style.display === 'block';
                
                // Toggle current item
                content.style.display = isOpen ? 'none' : 'block';
                toggle.innerHTML = isOpen ? 
                    '<i class="fas fa-chevron-down"></i>' : 
                    '<i class="fas fa-chevron-up"></i>';
                
                // Add/remove active class
                if (!isOpen) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    }

    expandAll() {
        const ruleItems = document.querySelectorAll('.rule-item');
        
        ruleItems.forEach(item => {
            const content = item.querySelector('.rule-content');
            const toggle = item.querySelector('.rule-toggle');
            
            content.style.display = 'block';
            toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
            item.classList.add('active');
        });
    }

    collapseAll() {
        const ruleItems = document.querySelectorAll('.rule-item');
        
        ruleItems.forEach(item => {
            const content = item.querySelector('.rule-content');
            const toggle = item.querySelector('.rule-toggle');
            
            content.style.display = 'none';
            toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            item.classList.remove('active');
        });
    }

    updateSearchResults() {
        const count = this.filteredRules.length;
        const resultsElement = document.getElementById('search-results');
        resultsElement.textContent = `${count} rule${count !== 1 ? 's' : ''} found`;
    }

    printRules() {
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Warhammer 40k Rules Reference</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #8b0000; }
                    .rule { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; }
                    .rule-header { background: #f5f5f5; padding: 10px; margin: -15px -15px 15px; }
                    .meta { color: #666; font-size: 0.9em; margin-top: 5px; }
                    .tags { margin-top: 10px; }
                    .tag { background: #eee; padding: 2px 8px; border-radius: 3px; margin-right: 5px; font-size: 0.8em; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Warhammer 40k Rules Reference</h1>
                <p>Printed: ${new Date().toLocaleString()}</p>
                <p>Filters: Category=${this.currentCategory}, Faction=${this.currentFaction}, Difficulty=${this.currentDifficulty}</p>
                
                ${this.filteredRules.map(rule => `
                    <div class="rule">
                        <div class="rule-header">
                            <h3>${rule.title}</h3>
                            <div class="meta">
                                <strong>Category:</strong> ${this.formatCategory(rule.category)} | 
                                <strong>Difficulty:</strong> ${this.formatDifficulty(rule.difficulty)} | 
                                <strong>Faction:</strong> ${this.formatFaction(rule.faction)}
                            </div>
                        </div>
                        ${rule.content}
                        <div class="tags">
                            ${rule.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
                
                <div class="no-print">
                    <p><em>Printed from Warhammer 40k Rules Reference</em></p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    loadFactionRules(faction) {
        const contentElement = document.getElementById('faction-content');
        
        // Clear existing content
        contentElement.innerHTML = '';
        
        // Load faction-specific rules
        const factionRules = {
            space_marines: `
                <div class="faction-rules" id="space_marines-rules">
                    <h4>Space Marines Core Rules</h4>
                    <div class="faction-rule">
                        <h5>Angels of Death</h5>
                        <p>Space Marines have the following abilities:</p>
                        <ul>
                            <li><strong>And They Shall Know No Fear:</strong> Each time a unit fails a Combat Attrition test, subtract 1 from the result.</li>
                            <li><strong>Bolter Discipline:</strong> Models armed with Bolt weapons count as remaining stationary in your Shooting phase.</li>
                            <li><strong>Shock Assault:</strong> Add 1 to the Attacks characteristic of models in the Fight phase.</li>
                            <li><strong>Combat Doctrines:</strong> Devastator, Tactical, and Assault doctrines.</li>
                        </ul>
                    </div>
                    
                    <div class="faction-rule">
                        <h5>Combat Doctrines</h5>
                        <p>Space Marines gain benefits depending on the current doctrine:</p>
                        <ul>
                            <li><strong>Devastator Doctrine (Turns 1-2):</strong> +1 AP for Heavy and Grenade weapons</li>
                            <li><strong>Tactical Doctrine (Turns 3-4):</strong> +1 AP for Rapid Fire and Assault weapons</li>
                            <li><strong>Assault Doctrine (Turns 5+):</strong> +1 AP for Pistol and Melee weapons</li>
                        </ul>
                    </div>
                </div>
            `,
            imperial_guard: `
                <div class="faction-rules" id="imperial_guard-rules">
                    <h4>Imperial Guard/Astra Militarum Rules</h4>
                    <div class="faction-rule">
                        <h5>Regimental Doctrines</h5>
                        <p>Choose two doctrines for your regiment:</p>
                        <ul>
                            <li><strong>Born Soldiers:</strong> Unmodified hit rolls of 6 automatically wound</li>
                            <li><strong>Armoured Might:</strong> Vehicles have +1 to their save against damage 1 weapons</li>
                            <li><strong>Swift as the Wind:</strong> Add 2" to Move characteristic</li>
                            <li><strong>Industrial Efficiency:</strong> Reduce cost of reloading weapons by 1CP</li>
                        </ul>
                    </div>
                    
                    <div class="faction-rule">
                        <h5>Voice of Command</h5>
                        <p>OFFICER units can issue orders to CORE units within 6":</p>
                        <ul>
                            <li><strong>Move! Move! Move!:</strong> Unit can make a Normal Move</li>
                            <li><strong>Take Aim!:</strong> Re-roll hit rolls of 1</li>
                            <li><strong>First Rank Fire! Second Rank Fire!:</strong> Rapid Fire weapons make maximum shots</li>
                            <li><strong>Fix Bayonets!:</strong> Unit can fight as if it were the Fight phase</li>
                        </ul>
                    </div>
                </div>
            `,
            chaos: `
                <div class="faction-rules" id="chaos-rules">
                    <h4>Chaos Space Marines Rules</h4>
                    <div class="faction-rule">
                        <h5>Let the Galaxy Burn</h5>
                        <p>Models with this rule re-roll hit rolls of 1 in the Shooting phase.</p>
                        <p>If the target is within half range, they instead re-roll all failed hit rolls.</p>
                    </div>
                    
                    <div class="faction-rule">
                        <h5>Mark of Chaos</h5>
                        <p>Units can be given a Mark of Chaos for different benefits:</p>
                        <ul>
                            <li><strong>Mark of Khorne:</strong> +1 Attack on charge</li>
                            <li><strong>Mark of Nurgle:</strong> -1 to wound rolls against this unit</li>
                            <li><strong>Mark of Tzeentch:</strong> 5+ invulnerable save</li>
                            <li><strong>Mark of Slaanesh:</strong> Fight first in combat</li>
                        </ul>
                    </div>
                </div>
            `,
            aeldari: `
                <div class="faction-rules" id="aeldari-rules">
                    <h4>Aeldari Rules</h4>
                    <div class="faction-rule">
                        <h5>Battle Focus</h5>
                        <p>In your Shooting phase, after a unit shoots, it can make a Battle Focus move.</p>
                        <p>Roll a D6: the unit can move up to that many inches, but cannot move within 9" of enemy units.</p>
                    </div>
                    
                    <div class="faction-rule">
                        <h5>Ancient Doom</h5>
                        <p>When this unit fights SLAANESH units, you can re-roll hit rolls.</p>
                        <p>However, when a SLAANESH unit fights this unit, that unit can re-roll hit rolls against this unit.</p>
                    </div>
                </div>
            `,
            ork: `
                <div class="faction-rules" id="ork-rules">
                    <h4>Ork Rules</h4>
                    <div class="faction-rule">
                        <h5>Waaagh!</h5>
                        <p>Once per battle, in your Command phase, call a Waaagh!:</p>
                        <ul>
                            <li>Add 1 to Advance and Charge rolls</li>
                            <li>Add 1 to Attacks characteristic</li>
                            <li>5+ invulnerable save</li>
                            <li>Lasts until start of your next Command phase</li>
                        </ul>
                    </div>
                    
                    <div class="faction-rule">
                        <h5>Dakka Dakka Dakka!</h5>
                        <p>Each time a model makes a ranged attack, an unmodified hit roll of 6 scores 1 additional hit.</p>
                        <p>Each additional hit is resolved using the same weapon and must target the same unit.</p>
                    </div>
                </div>
            `
        };
        
        contentElement.innerHTML = factionRules[faction] || `
            <div class="empty-faction">
                <p>Rules for ${this.formatFaction(faction)} coming soon!</p>
            </div>
        `;
    }

    // Helper Methods
    formatCategory(category) {
        const categories = {
            'phases': 'Battle Phases',
            'combat': 'Combat',
            'shooting': 'Shooting',
            'psychic': 'Psychic',
            'movement': 'Movement',
            'morale': 'Morale',
            'stratagems': 'Stratagems',
            'core_rules': 'Core Rules',
            'weapons': 'Weapons',
            'abilities': 'Abilities',
            'terrain': 'Terrain'
        };
        return categories[category] || category;
    }

    formatDifficulty(difficulty) {
        const difficulties = {
            'basic': 'Basic',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced',
            'faq': 'FAQ'
        };
        return difficulties[difficulty] || difficulty;
    }

    formatFaction(faction) {
        const factions = {
            'core': 'Core Rules',
            'space_marines': 'Space Marines',
            'imperial_guard': 'Imperial Guard',
            'chaos': 'Chaos Space Marines',
            'aeldari': 'Aeldari',
            'ork': 'Orks',
            'necron': 'Necrons',
            'tyranid': 'Tyranids',
            'tau': 'T\'au Empire'
        };
        return factions[faction] || faction;
    }
}

// Initialize the rules reference when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const rulesReference = new RulesReference();
    
    // Make reference available globally
    window.rulesReference = rulesReference;
});