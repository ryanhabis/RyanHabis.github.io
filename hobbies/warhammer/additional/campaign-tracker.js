// Warhammer 40k Campaign Tracker
class CampaignTracker {
    constructor() {
        this.campaigns = [];
        this.currentCampaignId = null;
        this.currentCampaign = null;
        
        this.init();
    }

    init() {
        this.loadCampaigns();
        this.setupEventListeners();
        this.updateOverviewStats();
        this.renderCampaignsGrid();
        
        // Check if we should focus on a specific campaign from URL
        this.checkUrlParams();
    }

    loadCampaigns() {
        try {
            const saved = localStorage.getItem('warhammerCampaigns');
            this.campaigns = saved ? JSON.parse(saved) : [];
            
            // Load sample data if empty
            if (this.campaigns.length === 0) {
                this.loadSampleCampaigns();
            }
        } catch (e) {
            console.error('Error loading campaigns:', e);
            this.campaigns = [];
            this.loadSampleCampaigns();
        }
    }

    loadSampleCampaigns() {
        this.campaigns = [
            {
                id: 'sample-1',
                name: 'The Macharian Crusade',
                faction: 'space_marines',
                narrative: 'A crusade to reclaim the lost worlds of the Macharian Sector from Ork invaders.',
                supplyLimit: 1000,
                commandPoints: 5,
                type: 'crusade',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                battles: [],
                units: [
                    {
                        id: 'unit-1',
                        name: 'Captain Lysander',
                        type: 'hq',
                        xp: 15,
                        level: 2,
                        battleHonors: ['Master-crafted Weapon', 'Heroic Intervention'],
                        battleScars: [],
                        crusadePoints: 3,
                        battlesParticipated: 3,
                        abilities: ['Rites of Battle', 'Iron Halo']
                    },
                    {
                        id: 'unit-2',
                        name: 'Tactical Squad Alpha',
                        type: 'troops',
                        xp: 10,
                        level: 1,
                        battleHonors: ['Veteran Intercessors'],
                        battleScars: ['Crippling Injury'],
                        crusadePoints: 2,
                        battlesParticipated: 2,
                        abilities: ['Bolter Discipline']
                    }
                ]
            }
        ];
        
        this.saveCampaigns();
    }

    saveCampaigns() {
        try {
            localStorage.setItem('warhammerCampaigns', JSON.stringify(this.campaigns));
        } catch (e) {
            console.error('Error saving campaigns:', e);
        }
    }

    setupEventListeners() {
        // Campaign form
        document.getElementById('campaign-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCampaign();
        });

        // Load template button
        document.getElementById('load-template').addEventListener('click', () => {
            this.loadCampaignTemplate();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderCampaignsGrid();
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Modal overlay click to close
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });
        });

        // Current campaign buttons
        document.getElementById('add-battle-btn')?.addEventListener('click', () => {
            this.showBattleModal();
        });

        document.getElementById('add-unit-btn')?.addEventListener('click', () => {
            this.addUnitToCurrentCampaign();
        });

        document.getElementById('edit-campaign-btn')?.addEventListener('click', () => {
            this.editCurrentCampaign();
        });

        // Unit roster buttons
        document.getElementById('level-up-btn')?.addEventListener('click', () => {
            this.levelUpUnit();
        });

        // Battle form
        document.getElementById('battle-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordBattle();
        });
    }

    createCampaign() {
        const name = document.getElementById('campaign-name').value;
        const faction = document.getElementById('campaign-faction').value;
        const narrative = document.getElementById('campaign-narrative').value;
        const supplyLimit = parseInt(document.getElementById('supply-limit').value);
        const commandPoints = parseInt(document.getElementById('starting-cp').value);
        const type = document.getElementById('campaign-type').value;

        if (!name || !faction) {
            alert('Please fill in all required fields');
            return;
        }

        const newCampaign = {
            id: 'campaign-' + Date.now(),
            name,
            faction,
            narrative,
            supplyLimit,
            commandPoints,
            type,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            battles: [],
            units: []
        };

        this.campaigns.push(newCampaign);
        this.saveCampaigns();
        
        // Clear form
        document.getElementById('campaign-form').reset();
        
        // Update UI
        this.updateOverviewStats();
        this.renderCampaignsGrid();
        
        // Focus on new campaign
        this.focusOnCampaign(newCampaign.id);
        
        this.showNotification(`Crusade "${name}" launched!`);
    }

    loadCampaignTemplate() {
        const templates = {
            space_marines: {
                name: 'Ultramarines Crusade',
                faction: 'space_marines',
                narrative: 'A crusade force from the Ultramarines chapter seeking to expand the borders of Ultramar.',
                supplyLimit: 1000,
                commandPoints: 5,
                type: 'crusade'
            },
            imperial_guard: {
                name: 'Cadian Defense Force',
                faction: 'imperial_guard',
                narrative: 'A regiment of Cadian Shock Troops deployed to defend a vital Imperial world.',
                supplyLimit: 1500,
                commandPoints: 3,
                type: 'narrative'
            },
            chaos: {
                name: 'Black Legion Warband',
                faction: 'chaos',
                narrative: 'A warband of Chaos Space Marines seeking to corrupt and conquer in the name of the Dark Gods.',
                supplyLimit: 1000,
                commandPoints: 5,
                type: 'crusade'
            }
        };

        const faction = document.getElementById('campaign-faction').value;
        const template = templates[faction];

        if (template) {
            document.getElementById('campaign-name').value = template.name;
            document.getElementById('campaign-narrative').value = template.narrative;
            document.getElementById('supply-limit').value = template.supplyLimit;
            document.getElementById('starting-cp').value = template.commandPoints;
            document.getElementById('campaign-type').value = template.type;
            
            this.showNotification(`${template.faction.replace('_', ' ')} template loaded`);
        } else {
            alert('Select a faction first to load a template');
        }
    }

    renderCampaignsGrid() {
        const grid = document.getElementById('campaigns-grid');
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        let filteredCampaigns = this.campaigns;
        
        if (activeFilter !== 'all') {
            filteredCampaigns = this.campaigns.filter(campaign => campaign.status === activeFilter);
        }
        
        if (filteredCampaigns.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚔️</div>
                    <h4>No ${activeFilter === 'all' ? '' : activeFilter} Campaigns</h4>
                    <p>${activeFilter === 'all' ? 'Start your first crusade to begin!' : `No ${activeFilter} campaigns found.`}</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filteredCampaigns.map(campaign => `
            <div class="campaign-card" data-id="${campaign.id}">
                <div class="campaign-card-header">
                    <h4>${campaign.name}</h4>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                <div class="campaign-card-body">
                    <p class="campaign-narrative">${campaign.narrative.substring(0, 100)}${campaign.narrative.length > 100 ? '...' : ''}</p>
                    <div class="campaign-stats">
                        <div class="campaign-stat">
                            <span>Faction:</span>
                            <strong>${this.formatFaction(campaign.faction)}</strong>
                        </div>
                        <div class="campaign-stat">
                            <span>Battles:</span>
                            <strong>${campaign.battles.length}</strong>
                        </div>
                        <div class="campaign-stat">
                            <span>Units:</span>
                            <strong>${campaign.units.length}</strong>
                        </div>
                        <div class="campaign-stat">
                            <span>Supply:</span>
                            <strong>${campaign.supplyLimit}</strong>
                        </div>
                    </div>
                </div>
                <div class="campaign-card-actions">
                    <button class="focus-campaign-btn" data-id="${campaign.id}">Focus</button>
                    <button class="view-campaign-btn" data-id="${campaign.id}">Details</button>
                    <button class="delete-campaign-btn" data-id="${campaign.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to campaign cards
        grid.querySelectorAll('.focus-campaign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const campaignId = e.target.dataset.id;
                this.focusOnCampaign(campaignId);
            });
        });
        
        grid.querySelectorAll('.view-campaign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const campaignId = e.target.dataset.id;
                this.showCampaignDetails(campaignId);
            });
        });
        
        grid.querySelectorAll('.delete-campaign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const campaignId = e.target.dataset.id;
                this.deleteCampaign(campaignId);
            });
        });
        
        grid.querySelectorAll('.campaign-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const campaignId = card.dataset.id;
                    this.showCampaignDetails(campaignId);
                }
            });
        });
    }

    focusOnCampaign(campaignId) {
        this.currentCampaignId = campaignId;
        this.currentCampaign = this.campaigns.find(c => c.id === campaignId);
        
        if (this.currentCampaign) {
            // Update URL without reloading
            history.pushState(null, null, `?campaign=${campaignId}`);
            
            // Show current campaign section
            document.getElementById('current-campaign-section').style.display = 'block';
            
            // Scroll to current campaign section
            document.getElementById('current-campaign-section').scrollIntoView({ behavior: 'smooth' });
            
            // Update current campaign display
            this.updateCurrentCampaignDisplay();
            
            this.showNotification(`Now focusing on "${this.currentCampaign.name}"`);
        }
    }

    updateCurrentCampaignDisplay() {
        if (!this.currentCampaign) return;
        
        // Update basic info
        document.getElementById('current-campaign-name').textContent = this.currentCampaign.name;
        document.getElementById('current-campaign-narrative').textContent = this.currentCampaign.narrative;
        document.getElementById('current-supply-limit').textContent = this.currentCampaign.supplyLimit;
        document.getElementById('current-command-points').textContent = this.currentCampaign.commandPoints;
        document.getElementById('current-battles-count').textContent = this.currentCampaign.battles.length;
        
        // Calculate total XP
        const totalXP = this.currentCampaign.units.reduce((sum, unit) => sum + unit.xp, 0);
        document.getElementById('current-total-xp').textContent = totalXP;
        
        // Update status
        const statusElement = document.querySelector('.campaign-status.active');
        if (statusElement) {
            statusElement.textContent = this.currentCampaign.status;
            statusElement.className = `campaign-status ${this.currentCampaign.status}`;
        }
        
        // Update units roster
        this.updateUnitsRoster();
        
        // Update battle log
        this.updateBattleLog();
    }

    updateUnitsRoster() {
        if (!this.currentCampaign) return;
        
        const tableBody = document.getElementById('units-roster-body');
        tableBody.innerHTML = '';
        
        this.currentCampaign.units.forEach(unit => {
            const row = document.createElement('tr');
            row.dataset.unitId = unit.id;
            
            row.innerHTML = `
                <td>
                    <strong>${unit.name}</strong>
                    <div class="unit-type">${this.formatUnitType(unit.type)}</div>
                </td>
                <td>${this.formatUnitType(unit.type)}</td>
                <td>${unit.xp}</td>
                <td>
                    <span class="unit-level level-${unit.level}">${unit.level}</span>
                </td>
                <td>
                    ${unit.battleHonors.length > 0 
                        ? `<div class="honors-list">${unit.battleHonors.map(h => `<span class="honor-badge">${h}</span>`).join('')}</div>`
                        : '<span class="empty-text">None</span>'
                    }
                </td>
                <td>
                    ${unit.battleScars.length > 0 
                        ? `<div class="scars-list">${unit.battleScars.map(s => `<span class="scar-badge">${s}</span>`).join('')}</div>`
                        : '<span class="empty-text">None</span>'
                    }
                </td>
                <td>${unit.crusadePoints}</td>
                <td>
                    <button class="unit-action-btn view-unit" data-id="${unit.id}">View</button>
                    <button class="unit-action-btn edit-unit" data-id="${unit.id}">Edit</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners
        tableBody.querySelectorAll('.view-unit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unitId = e.target.dataset.id;
                this.showUnitDetails(unitId);
            });
        });
        
        tableBody.querySelectorAll('.edit-unit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unitId = e.target.dataset.id;
                this.editUnit(unitId);
            });
        });
        
        // Update summary
        this.updateRosterSummary();
    }

    updateRosterSummary() {
        if (!this.currentCampaign || this.currentCampaign.units.length === 0) {
            document.getElementById('total-units-count').textContent = '0';
            document.getElementById('total-crusade-points').textContent = '0';
            document.getElementById('average-unit-level').textContent = '0';
            return;
        }
        
        const totalUnits = this.currentCampaign.units.length;
        const totalCrusadePoints = this.currentCampaign.units.reduce((sum, unit) => sum + unit.crusadePoints, 0);
        const averageLevel = this.currentCampaign.units.reduce((sum, unit) => sum + unit.level, 0) / totalUnits;
        
        document.getElementById('total-units-count').textContent = totalUnits;
        document.getElementById('total-crusade-points').textContent = totalCrusadePoints;
        document.getElementById('average-unit-level').textContent = averageLevel.toFixed(1);
    }

    updateBattleLog() {
        const logContainer = document.getElementById('battle-log-entries');
        
        if (!this.currentCampaign || this.currentCampaign.battles.length === 0) {
            logContainer.innerHTML = `
                <div class="empty-battles">
                    <p>No battles recorded yet.</p>
                    <p>Click "Record Battle" to add your first battle report!</p>
                </div>
            `;
            return;
        }
        
        // Show only last 5 battles
        const recentBattles = this.currentCampaign.battles
            .slice(-5)
            .reverse();
        
        logContainer.innerHTML = recentBattles.map(battle => `
            <div class="battle-entry">
                <div class="battle-header">
                    <h5>${battle.name}</h5>
                    <span class="battle-date">${new Date(battle.date).toLocaleDateString()}</span>
                </div>
                <div class="battle-details">
                    <div class="battle-info">
                        <span class="battle-opponent">vs ${battle.opponent}</span>
                        <span class="battle-type">${this.formatBattleType(battle.type)}</span>
                        <span class="battle-result ${battle.result}">${battle.result}</span>
                    </div>
                    ${battle.details ? `<p class="battle-description">${battle.details}</p>` : ''}
                    <div class="battle-xp">
                        <strong>XP Gained:</strong> ${battle.xpAwarded}
                    </div>
                </div>
            </div>
        `).join('');
    }

    showBattleModal() {
        if (!this.currentCampaign) {
            alert('No campaign selected. Please focus on a campaign first.');
            return;
        }
        
        // Set default date to today
        document.getElementById('battle-date').valueAsDate = new Date();
        
        // Populate units participated list
        const unitsList = document.getElementById('units-participated-list');
        unitsList.innerHTML = '';
        
        this.currentCampaign.units.forEach(unit => {
            const unitItem = document.createElement('div');
            unitItem.className = 'unit-participant';
            unitItem.innerHTML = `
                <label>
                    <input type="checkbox" name="participating-units" value="${unit.id}" checked>
                    <span>${unit.name} (Level ${unit.level})</span>
                </label>
            `;
            unitsList.appendChild(unitItem);
        });
        
        // Show modal
        document.getElementById('battle-modal-overlay').style.display = 'flex';
    }

    recordBattle() {
        const name = document.getElementById('battle-name').value;
        const date = document.getElementById('battle-date').value;
        const opponent = document.getElementById('battle-opponent').value;
        const type = document.getElementById('battle-type').value;
        const result = document.getElementById('battle-result').value;
        const details = document.getElementById('battle-details').value;
        
        // Calculate XP awards
        let xpAwarded = 0;
        const xpCheckboxes = document.querySelectorAll('input[name="xp-awards"]:checked');
        xpCheckboxes.forEach(cb => {
            xpAwarded += parseInt(cb.value);
        });
        
        // Get participating units
        const participatingUnitIds = [];
        const unitCheckboxes = document.querySelectorAll('input[name="participating-units"]:checked');
        unitCheckboxes.forEach(cb => {
            participatingUnitIds.push(cb.value);
        });
        
        const battle = {
            id: 'battle-' + Date.now(),
            name,
            date,
            opponent,
            type,
            result,
            details,
            xpAwarded,
            participatingUnitIds,
            recordedAt: new Date().toISOString()
        };
        
        // Add battle to current campaign
        this.currentCampaign.battles.push(battle);
        
        // Award XP to participating units
        participatingUnitIds.forEach(unitId => {
            const unit = this.currentCampaign.units.find(u => u.id === unitId);
            if (unit) {
                unit.xp += xpAwarded;
                unit.battlesParticipated = (unit.battlesParticipated || 0) + 1;
                
                // Check for level up
                this.checkUnitLevelUp(unit);
            }
        });
        
        // Update campaign
        this.currentCampaign.updatedAt = new Date().toISOString();
        this.saveCampaigns();
        
        // Close modal
        document.getElementById('battle-modal-overlay').style.display = 'none';
        
        // Reset form
        document.getElementById('battle-form').reset();
        
        // Update displays
        this.updateCurrentCampaignDisplay();
        this.updateOverviewStats();
        
        this.showNotification(`Battle "${name}" recorded!`);
    }

    checkUnitLevelUp(unit) {
        const levelThresholds = [0, 6, 16, 31, 51, 76]; // XP needed for each level
        
        for (let level = 5; level >= 1; level--) {
            if (unit.xp >= levelThresholds[level]) {
                if (unit.level < level) {
                    unit.level = level;
                    
                    // Award crusade points
                    unit.crusadePoints += 1;
                    
                    // Show level up notification
                    this.showNotification(`${unit.name} reached Level ${level}!`);
                    
                    // Ask about battle honor
                    if (confirm(`${unit.name} leveled up! Would you like to add a Battle Honor?`)) {
                        this.addBattleHonor(unit.id);
                    }
                }
                break;
            }
        }
    }

    addUnitToCurrentCampaign() {
        if (!this.currentCampaign) return;
        
        const unitName = prompt('Enter unit name:');
        if (!unitName) return;
        
        const unitType = prompt('Enter unit type (HQ, Troops, Elites, etc.):', 'Troops');
        if (!unitType) return;
        
        const newUnit = {
            id: 'unit-' + Date.now(),
            name: unitName,
            type: unitType.toLowerCase(),
            xp: 0,
            level: 0,
            battleHonors: [],
            battleScars: [],
            crusadePoints: 0,
            battlesParticipated: 0,
            abilities: []
        };
        
        this.currentCampaign.units.push(newUnit);
        this.currentCampaign.updatedAt = new Date().toISOString();
        this.saveCampaigns();
        
        this.updateCurrentCampaignDisplay();
        this.showNotification(`${unitName} added to crusade!`);
    }

    showUnitDetails(unitId) {
        if (!this.currentCampaign) return;
        
        const unit = this.currentCampaign.units.find(u => u.id === unitId);
        if (!unit) return;
        
        const modalContent = document.getElementById('unit-details-content');
        modalContent.innerHTML = `
            <div class="unit-details-card">
                <div class="unit-header">
                    <h4>${unit.name}</h4>
                    <span class="unit-type-badge">${this.formatUnitType(unit.type)}</span>
                </div>
                
                <div class="unit-stats">
                    <div class="stat-row">
                        <div class="stat-item">
                            <span>Level:</span>
                            <strong class="unit-level level-${unit.level}">${unit.level}</strong>
                        </div>
                        <div class="stat-item">
                            <span>XP:</span>
                            <strong>${unit.xp}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Crusade Points:</span>
                            <strong>${unit.crusadePoints}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Battles:</span>
                            <strong>${unit.battlesParticipated}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="unit-section">
                    <h5>Battle Honors</h5>
                    ${unit.battleHonors.length > 0 
                        ? `<ul class="honors-list">${unit.battleHonors.map(h => `<li>${h}</li>`).join('')}</ul>`
                        : '<p class="empty-text">No battle honors yet.</p>'
                    }
                    <button class="add-honor-btn imperial-btn-small" data-id="${unit.id}">Add Honor</button>
                </div>
                
                <div class="unit-section">
                    <h5>Battle Scars</h5>
                    ${unit.battleScars.length > 0 
                        ? `<ul class="scars-list">${unit.battleScars.map(s => `<li>${s}</li>`).join('')}</ul>`
                        : '<p class="empty-text">No battle scars yet.</p>'
                    }
                    <button class="add-scar-btn imperial-btn-small" data-id="${unit.id}">Add Scar</button>
                </div>
                
                ${unit.abilities.length > 0 ? `
                    <div class="unit-section">
                        <h5>Abilities</h5>
                        <ul class="abilities-list">
                            ${unit.abilities.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="unit-actions">
                    <button class="award-xp-btn imperial-btn" data-id="${unit.id}">Award XP</button>
                    <button class="edit-unit-details-btn imperial-btn-secondary" data-id="${unit.id}">Edit</button>
                    <button class="remove-unit-btn imperial-btn-clear" data-id="${unit.id}">Remove</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        modalContent.querySelector('.add-honor-btn').addEventListener('click', (e) => {
            this.addBattleHonor(unit.id);
        });
        
        modalContent.querySelector('.add-scar-btn').addEventListener('click', (e) => {
            this.addBattleScar(unit.id);
        });
        
        modalContent.querySelector('.award-xp-btn').addEventListener('click', (e) => {
            this.awardXP(unit.id);
        });
        
        modalContent.querySelector('.edit-unit-details-btn').addEventListener('click', (e) => {
            this.editUnit(unit.id);
        });
        
        modalContent.querySelector('.remove-unit-btn').addEventListener('click', (e) => {
            this.removeUnit(unit.id);
        });
        
        // Update modal title and show
        document.getElementById('unit-modal-title').textContent = unit.name;
        document.getElementById('unit-modal-overlay').style.display = 'flex';
    }

    addBattleHonor(unitId) {
        if (!this.currentCampaign) return;
        
        const honor = prompt('Enter battle honor:');
        if (!honor) return;
        
        const unit = this.currentCampaign.units.find(u => u.id === unitId);
        if (unit) {
            unit.battleHonors.push(honor);
            this.currentCampaign.updatedAt = new Date().toISOString();
            this.saveCampaigns();
            
            this.updateCurrentCampaignDisplay();
            this.showNotification(`Battle honor added to ${unit.name}`);
        }
    }

    addBattleScar(unitId) {
        if (!this.currentCampaign) return;
        
        const scar = prompt('Enter battle scar:');
        if (!scar) return;
        
        const unit = this.currentCampaign.units.find(u => u.id === unitId);
        if (unit) {
            unit.battleScars.push(scar);
            this.currentCampaign.updatedAt = new Date().toISOString();
            this.saveCampaigns();
            
            this.updateCurrentCampaignDisplay();
            this.showNotification(`Battle scar added to ${unit.name}`);
        }
    }

    awardXP(unitId) {
        if (!this.currentCampaign) return;
        
        const xp = parseInt(prompt('Enter XP to award:', '5'));
        if (isNaN(xp) || xp <= 0) return;
        
        const unit = this.currentCampaign.units.find(u => u.id === unitId);
        if (unit) {
            unit.xp += xp;
            this.checkUnitLevelUp(unit);
            this.currentCampaign.updatedAt = new Date().toISOString();
            this.saveCampaigns();
            
            this.updateCurrentCampaignDisplay();
            this.showNotification(`${xp} XP awarded to ${unit.name}`);
        }
    }

    levelUpUnit() {
        if (!this.currentCampaign) return;
        
        if (this.currentCampaign.units.length === 0) {
            alert('No units in this campaign.');
            return;
        }
        
        const unitNames = this.currentCampaign.units.map(u => u.name);
        const selected = prompt(`Which unit should level up?\n\n${unitNames.join('\n')}`);
        
        if (selected) {
            const unit = this.currentCampaign.units.find(u => u.name === selected);
            if (unit) {
                unit.xp += 16; // Enough to reach next level
                this.checkUnitLevelUp(unit);
                this.currentCampaign.updatedAt = new Date().toISOString();
                this.saveCampaigns();
                
                this.updateCurrentCampaignDisplay();
            }
        }
    }

    editUnit(unitId) {
        if (!this.currentCampaign) return;
        
        const unit = this.currentCampaign.units.find(u => u.id === unitId);
        if (!unit) return;
        
        const newName = prompt('Edit unit name:', unit.name);
        if (newName) {
            unit.name = newName;
            this.currentCampaign.updatedAt = new Date().toISOString();
            this.saveCampaigns();
            
            this.updateCurrentCampaignDisplay();
            this.showNotification(`Unit updated: ${newName}`);
        }
    }

    removeUnit(unitId) {
        if (!this.currentCampaign) return;
        
        if (confirm('Remove this unit from the campaign?')) {
            const index = this.currentCampaign.units.findIndex(u => u.id === unitId);
            if (index !== -1) {
                const unitName = this.currentCampaign.units[index].name;
                this.currentCampaign.units.splice(index, 1);
                this.currentCampaign.updatedAt = new Date().toISOString();
                this.saveCampaigns();
                
                this.updateCurrentCampaignDisplay();
                this.showNotification(`${unitName} removed from campaign`);
            }
        }
    }

    showCampaignDetails(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        const modalContent = document.getElementById('campaign-details');
        modalContent.innerHTML = `
            <div class="campaign-details-card">
                <div class="campaign-info">
                    <h4>${campaign.name}</h4>
                    <span class="campaign-faction">${this.formatFaction(campaign.faction)}</span>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                
                <div class="campaign-description">
                    <h5>Narrative</h5>
                    <p>${campaign.narrative || 'No narrative provided.'}</p>
                </div>
                
                <div class="campaign-stats-details">
                    <div class="stat-detail">
                        <span>Supply Limit:</span>
                        <strong>${campaign.supplyLimit}</strong>
                    </div>
                    <div class="stat-detail">
                        <span>Command Points:</span>
                        <strong>${campaign.commandPoints}</strong>
                    </div>
                    <div class="stat-detail">
                        <span>Campaign Type:</span>
                        <strong>${campaign.type}</strong>
                    </div>
                    <div class="stat-detail">
                        <span>Battles Fought:</span>
                        <strong>${campaign.battles.length}</strong>
                    </div>
                    <div class="stat-detail">
                        <span>Units in Roster:</span>
                        <strong>${campaign.units.length}</strong>
                    </div>
                    <div class="stat-detail">
                        <span>Started:</span>
                        <strong>${new Date(campaign.createdAt).toLocaleDateString()}</strong>
                    </div>
                </div>
                
                ${campaign.battles.length > 0 ? `
                    <div class="recent-battles">
                        <h5>Recent Battles</h5>
                        <div class="battles-list">
                            ${campaign.battles.slice(-3).reverse().map(battle => `
                                <div class="battle-summary">
                                    <strong>${battle.name}</strong>
                                    <span>${new Date(battle.date).toLocaleDateString()} - ${battle.result}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="campaign-actions">
                    <button class="focus-from-modal imperial-btn" data-id="${campaign.id}">Focus on this Campaign</button>
                    <button class="export-campaign imperial-btn-secondary" data-id="${campaign.id}">Export Campaign</button>
                    <button class="change-status imperial-btn-secondary" data-id="${campaign.id}">Change Status</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        modalContent.querySelector('.focus-from-modal').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            document.getElementById('campaign-modal-overlay').style.display = 'none';
            this.focusOnCampaign(id);
        });
        
        modalContent.querySelector('.export-campaign').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            this.exportCampaign(id);
        });
        
        modalContent.querySelector('.change-status').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            this.changeCampaignStatus(id);
        });
        
        // Update modal title and show
        document.getElementById('modal-campaign-name').textContent = campaign.name;
        document.getElementById('campaign-modal-overlay').style.display = 'flex';
    }

    changeCampaignStatus(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        const newStatus = prompt('Enter new status (active, paused, completed):', campaign.status);
        if (newStatus && ['active', 'paused', 'completed'].includes(newStatus)) {
            campaign.status = newStatus;
            campaign.updatedAt = new Date().toISOString();
            this.saveCampaigns();
            
            this.updateOverviewStats();
            this.renderCampaignsGrid();
            
            if (this.currentCampaignId === campaignId) {
                this.updateCurrentCampaignDisplay();
            }
            
            this.showNotification(`Campaign status changed to ${newStatus}`);
        }
    }

    deleteCampaign(campaignId) {
        if (confirm('Delete this campaign? This action cannot be undone.')) {
            const index = this.campaigns.findIndex(c => c.id === campaignId);
            if (index !== -1) {
                const campaignName = this.campaigns[index].name;
                this.campaigns.splice(index, 1);
                this.saveCampaigns();
                
                // If this was the current campaign, clear focus
                if (this.currentCampaignId === campaignId) {
                    this.currentCampaignId = null;
                    this.currentCampaign = null;
                    document.getElementById('current-campaign-section').style.display = 'none';
                }
                
                this.updateOverviewStats();
                this.renderCampaignsGrid();
                
                this.showNotification(`Campaign "${campaignName}" deleted`);
            }
        }
    }

    editCurrentCampaign() {
        if (!this.currentCampaign) return;
        
        const newName = prompt('Edit campaign name:', this.currentCampaign.name);
        if (newName) this.currentCampaign.name = newName;
        
        const newNarrative = prompt('Edit campaign narrative:', this.currentCampaign.narrative);
        if (newNarrative !== null) this.currentCampaign.narrative = newNarrative;
        
        const newSupply = prompt('Edit supply limit:', this.currentCampaign.supplyLimit);
        if (newSupply) this.currentCampaign.supplyLimit = parseInt(newSupply);
        
        this.currentCampaign.updatedAt = new Date().toISOString();
        this.saveCampaigns();
        
        this.updateCurrentCampaignDisplay();
        this.renderCampaignsGrid();
        this.showNotification('Campaign updated');
    }

    updateOverviewStats() {
        const activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;
        const totalBattles = this.campaigns.reduce((sum, c) => sum + c.battles.length, 0);
        
        let totalUnits = 0;
        let totalXP = 0;
        let unitsLeveled = 0;
        
        this.campaigns.forEach(campaign => {
            totalUnits += campaign.units.length;
            totalXP += campaign.units.reduce((sum, u) => sum + u.xp, 0);
            unitsLeveled += campaign.units.filter(u => u.level > 0).length;
        });
        
        document.getElementById('active-campaigns-count').textContent = activeCampaigns;
        document.getElementById('total-battles-count').textContent = totalBattles;
        document.getElementById('units-leveled-count').textContent = unitsLeveled;
        document.getElementById('total-xp-count').textContent = totalXP;
    }

    exportCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        const campaignText = this.generateCampaignReport(campaign);
        
        // Create download link
        const blob = new Blob([campaignText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crusade-${campaign.name.replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Campaign "${campaign.name}" exported`);
    }

    generateCampaignReport(campaign) {
        let report = `=== CRUSADE CAMPAIGN REPORT ===\n\n`;
        report += `Name: ${campaign.name}\n`;
        report += `Faction: ${this.formatFaction(campaign.faction)}\n`;
        report += `Status: ${campaign.status}\n`;
        report += `Supply Limit: ${campaign.supplyLimit}\n`;
        report += `Command Points: ${campaign.commandPoints}\n`;
        report += `Started: ${new Date(campaign.createdAt).toLocaleDateString()}\n`;
        report += `Last Updated: ${new Date(campaign.updatedAt).toLocaleDateString()}\n\n`;
        
        report += `=== CAMPAIGN NARRATIVE ===\n\n`;
        report += `${campaign.narrative}\n\n`;
        
        report += `=== ORDER OF BATTLE ===\n\n`;
        if (campaign.units.length === 0) {
            report += `No units in roster.\n\n`;
        } else {
            campaign.units.forEach(unit => {
                report += `${unit.name} (${this.formatUnitType(unit.type)})\n`;
                report += `  Level: ${unit.level} | XP: ${unit.xp} | Crusade Points: ${unit.crusadePoints}\n`;
                if (unit.battleHonors.length > 0) {
                    report += `  Battle Honors: ${unit.battleHonors.join(', ')}\n`;
                }
                if (unit.battleScars.length > 0) {
                    report += `  Battle Scars: ${unit.battleScars.join(', ')}\n`;
                }
                report += '\n';
            });
        }
        
        report += `=== BATTLE LOG ===\n\n`;
        if (campaign.battles.length === 0) {
            report += `No battles recorded.\n\n`;
        } else {
            campaign.battles.forEach(battle => {
                report += `${battle.name}\n`;
                report += `  Date: ${new Date(battle.date).toLocaleDateString()}\n`;
                report += `  Opponent: ${battle.opponent}\n`;
                report += `  Type: ${this.formatBattleType(battle.type)} | Result: ${battle.result}\n`;
                report += `  XP Awarded: ${battle.xpAwarded}\n`;
                if (battle.details) {
                    report += `  Details: ${battle.details}\n`;
                }
                report += '\n';
            });
        }
        
        report += `=== END OF REPORT ===\n`;
        report += `Generated by Grimdark Archives Campaign Tracker\n`;
        
        return report;
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const campaignId = urlParams.get('campaign');
        
        if (campaignId) {
            this.focusOnCampaign(campaignId);
        }
    }

    formatFaction(faction) {
        const factions = {
            space_marines: 'Space Marines',
            imperial_guard: 'Imperial Guard',
            chaos: 'Chaos Space Marines',
            necrons: 'Necrons',
            orks: 'Orks',
            tyranids: 'Tyranids',
            aeldari: 'Aeldari',
            tau: 'T\'au Empire'
        };
        return factions[faction] || faction.replace('_', ' ');
    }

    formatUnitType(type) {
        const types = {
            hq: 'HQ',
            troops: 'Troops',
            elites: 'Elites',
            'fast-attack': 'Fast Attack',
            'heavy-support': 'Heavy Support',
            flyer: 'Flyer',
            transport: 'Transport'
        };
        return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }

    formatBattleType(type) {
        const types = {
            incursion: 'Incursion (1000pts)',
            strike_force: 'Strike Force (2000pts)',
            onslaught: 'Onslaught (3000pts)',
            patrol: 'Patrol (500pts)',
            narrative: 'Narrative Mission'
        };
        return types[type] || type;
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'campaign-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #8b0000;
            color: #d4af37;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: 'Cinzel', serif;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const campaignTracker = new CampaignTracker();
    window.campaignTracker = campaignTracker; // Make available for debugging
    
    console.log('Campaign Tracker initialized');
});