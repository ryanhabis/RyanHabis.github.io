// Warhammer 40k Army Builder
class ArmyBuilder {
    constructor() {
        this.army = {
            faction: 'space_marines',
            pointsLimit: 2000,
            totalPoints: 0,
            commandPoints: 0,
            powerLevel: 0,
            units: [],
            detachments: [],
            notes: ''
        };
        
        this.availableUnits = this.getDefaultUnits();
        this.currentFilter = 'all';
        this.currentSearch = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedLists();
        this.updateUnitList();
        this.updateArmyDisplay();
        this.updateSavedListsDisplay();
    }

    getDefaultUnits() {
        // Base units for each faction
        return {
            space_marines: [
                { id: 'sm_captain', name: 'Captain', role: 'hq', points: 80, pl: 4, abilities: ['Rites of Battle', 'Iron Halo'] },
                { id: 'sm_lt', name: 'Lieutenant', role: 'hq', points: 65, pl: 3, abilities: ['Tactical Precision'] },
                { id: 'sm_intercessors', name: 'Intercessor Squad', role: 'troops', points: 100, pl: 5, min: 5, max: 10, abilities: ['Bolter Discipline'] },
                { id: 'sm_tactical', name: 'Tactical Squad', role: 'troops', points: 90, pl: 4, min: 5, max: 10, abilities: ['Combat Squads'] },
                { id: 'sm_assault', name: 'Assault Squad', role: 'fast-attack', points: 95, pl: 5, min: 5, max: 10, abilities: ['Jump Pack Assault'] },
                { id: 'sm_terminators', name: 'Terminator Squad', role: 'elites', points: 200, pl: 10, min: 5, max: 10, abilities: ['Teleport Strike'] },
                { id: 'sm_dreadnought', name: 'Dreadnought', role: 'heavy-support', points: 140, pl: 7, abilities: ['Smoke Launchers'] },
                { id: 'sm_predator', name: 'Predator', role: 'heavy-support', points: 130, pl: 7, abilities: ['Hunter-killer Missile'] },
                { id: 'sm_rhino', name: 'Rhino', role: 'transport', points: 70, pl: 4, capacity: 10, abilities: ['Assault Vehicle'] }
            ],
            imperial_guard: [
                { id: 'ig_cc', name: 'Company Commander', role: 'hq', points: 30, pl: 2, abilities: ['Voice of Command'] },
                { id: 'ig_lr', name: 'Lord Commissar', role: 'hq', points: 40, pl: 3, abilities: ['Summary Execution'] },
                { id: 'ig_infantry', name: 'Infantry Squad', role: 'troops', points: 55, pl: 3, min: 10, max: 10, abilities: ['Combined Squads'] },
                { id: 'ig_conscripts', name: 'Conscript Squad', role: 'troops', points: 50, pl: 3, min: 10, max: 30, abilities: ['Green Tide'] },
                { id: 'ig_sentinel', name: 'Armored Sentinel', role: 'fast-attack', points: 45, pl: 3, abilities: ['Outflank'] },
                { id: 'ig_leman', name: 'Leman Russ', role: 'heavy-support', points: 150, pl: 10, abilities: ['Grinding Advance'] },
                { id: 'ig_basilisk', name: 'Basilisk', role: 'heavy-support', points: 125, pl: 8, abilities: ['Earthshaker Cannon'] },
                { id: 'ig_chimera', name: 'Chimera', role: 'transport', points: 75, pl: 5, capacity: 12, abilities: ['Fire Points'] }
            ],
            chaos: [
                { id: 'chaos_lord', name: 'Chaos Lord', role: 'hq', points: 75, pl: 4, abilities: ['Lord of Chaos'] },
                { id: 'chaos_sorcerer', name: 'Sorcerer', role: 'hq', points: 90, pl: 5, abilities: ['Chaos Psychic Powers'] },
                { id: 'chaos_cultists', name: 'Cultist Mob', role: 'troops', points: 50, pl: 3, min: 10, max: 20, abilities: ['Dark Zealotry'] },
                { id: 'chaos_marines', name: 'Chaos Space Marines', role: 'troops', points: 85, pl: 4, min: 5, max: 10, abilities: ['Let the Galaxy Burn'] },
                { id: 'chaos_havocs', name: 'Havocs', role: 'heavy-support', points: 105, pl: 6, min: 5, max: 10, abilities: ['Heavy Weapons Team'] },
                { id: 'chaos_helbrute', name: 'Helbrute', role: 'heavy-support', points: 125, pl: 7, abilities: ['Crazed'] },
                { id: 'chaos_rhino', name: 'Chaos Rhino', role: 'transport', points: 70, pl: 4, capacity: 10, abilities: ['Daemonic Possession'] }
            ]
        };
    }

    setupEventListeners() {
        // Faction selection
        document.getElementById('faction-select').addEventListener('change', (e) => {
            this.army.faction = e.target.value;
            this.updateUnitList();
        });

        // Points limit
        document.getElementById('points-limit').addEventListener('change', (e) => {
            this.army.pointsLimit = parseInt(e.target.value);
            this.updatePointsDisplay();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.role;
                this.updateUnitList();
            });
        });

        // Unit search
        document.getElementById('unit-search').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.updateUnitList();
        });

        // Clear search
        document.getElementById('clear-search').addEventListener('click', () => {
            document.getElementById('unit-search').value = '';
            this.currentSearch = '';
            this.updateUnitList();
        });

        // New army button
        document.getElementById('new-army').addEventListener('click', () => {
            if (confirm('Create new army? Current army will be cleared.')) {
                this.clearArmy();
            }
        });

        // Save army button
        document.getElementById('save-army-btn').addEventListener('click', () => {
            this.saveCurrentArmy();
        });

        // Load army button
        document.getElementById('load-army-btn').addEventListener('click', () => {
            this.showLoadDialog();
        });

        // Validate army button
        document.getElementById('validate-army').addEventListener('click', () => {
            this.validateArmy();
        });

        // Clear army button
        document.getElementById('clear-army').addEventListener('click', () => {
            if (confirm('Clear entire army?')) {
                this.clearArmy();
            }
        });

        // Export army button
        document.getElementById('export-army').addEventListener('click', () => {
            this.exportArmy();
        });

        // Print army button
        document.getElementById('print-army').addEventListener('click', () => {
            this.printArmy();
        });

        // Save notes button
        document.getElementById('save-notes').addEventListener('click', () => {
            this.saveNotes();
        });

        // Clear notes button
        document.getElementById('clear-notes').addEventListener('click', () => {
            if (confirm('Clear all notes?')) {
                document.getElementById('army-notes').value = '';
                this.army.notes = '';
            }
        });

        // Notes auto-save
        document.getElementById('army-notes').addEventListener('input', (e) => {
            this.army.notes = e.target.value;
        });

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.target.closest('.template-card').dataset.template;
                this.loadTemplate(template);
            });
        });
    }

    updateUnitList() {
        const unitList = document.getElementById('unit-list');
        unitList.innerHTML = '';
        
        const faction = this.army.faction;
        const units = this.availableUnits[faction] || [];
        
        // Filter units
        let filteredUnits = units;
        
        if (this.currentFilter !== 'all') {
            filteredUnits = units.filter(unit => unit.role === this.currentFilter);
        }
        
        if (this.currentSearch) {
            filteredUnits = filteredUnits.filter(unit => 
                unit.name.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Display units
        filteredUnits.forEach(unit => {
            const unitElement = this.createUnitElement(unit);
            unitList.appendChild(unitElement);
        });
        
        if (filteredUnits.length === 0) {
            unitList.innerHTML = '<div class="empty-message">No units found</div>';
        }
    }

    createUnitElement(unit) {
        const div = document.createElement('div');
        div.className = 'unit-item';
        div.dataset.id = unit.id;
        div.dataset.role = unit.role;
        
        // Unit color based on role
        const roleColors = {
            hq: '#0d47a1',
            troops: '#1b5e20',
            elites: '#b71c1c',
            'fast-attack': '#ff9800',
            'heavy-support': '#5d4037',
            flyer: '#0277bd',
            transport: '#795548'
        };
        
        div.style.borderLeftColor = roleColors[unit.role] || '#666';
        
        div.innerHTML = `
            <div class="unit-header">
                <h4>${unit.name}</h4>
                <span class="unit-points">${unit.points}pts</span>
            </div>
            <div class="unit-details">
                <span class="unit-role">${this.formatRole(unit.role)}</span>
                <span class="unit-pl">PL: ${unit.pl}</span>
            </div>
            <div class="unit-actions">
                <button class="add-unit-btn">Add to Army</button>
                <button class="info-unit-btn">Info</button>
            </div>
        `;
        
        // Add event listeners
        div.querySelector('.add-unit-btn').addEventListener('click', () => {
            this.addUnitToArmy(unit);
        });
        
        div.querySelector('.info-unit-btn').addEventListener('click', () => {
            this.showUnitInfo(unit);
        });
        
        // Drag and drop
        div.setAttribute('draggable', 'true');
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(unit));
        });
        
        return div;
    }

    addUnitToArmy(unit) {
        // Check if we have points available
        if (this.army.totalPoints + unit.points > this.army.pointsLimit) {
            alert(`Not enough points! You have ${this.army.pointsLimit - this.army.totalPoints} points remaining.`);
            return;
        }
        
        // Add unit to army
        const unitCopy = { ...unit, id: `${unit.id}_${Date.now()}` };
        this.army.units.push(unitCopy);
        
        // Update displays
        this.updateArmyDisplay();
        this.updatePointsDisplay();
        
        // Add to appropriate slot
        this.addUnitToSlot(unitCopy);
        
        // Show confirmation
        this.showNotification(`Added ${unit.name} to army`);
    }

    addUnitToSlot(unit) {
        const slotList = document.querySelector(`.slot-list[data-role="${unit.role}"]`);
        if (!slotList) return;
        
        const slotItem = document.createElement('div');
        slotItem.className = 'slot-item';
        slotItem.dataset.id = unit.id;
        
        slotItem.innerHTML = `
            <div class="slot-item-header">
                <span class="slot-unit-name">${unit.name}</span>
                <span class="slot-unit-points">${unit.points}pts</span>
            </div>
            <div class="slot-item-actions">
                <button class="remove-unit-btn">×</button>
            </div>
        `;
        
        slotItem.querySelector('.remove-unit-btn').addEventListener('click', () => {
            this.removeUnitFromArmy(unit.id);
        });
        
        slotList.appendChild(slotItem);
        
        // Update slot count
        this.updateSlotCounts();
    }

    removeUnitFromArmy(unitId) {
        const index = this.army.units.findIndex(u => u.id === unitId);
        if (index !== -1) {
            const unit = this.army.units[index];
            this.army.units.splice(index, 1);
            
            // Remove from slot
            const slotItem = document.querySelector(`.slot-item[data-id="${unitId}"]`);
            if (slotItem) {
                slotItem.remove();
            }
            
            // Update displays
            this.updateArmyDisplay();
            this.updatePointsDisplay();
            this.updateSlotCounts();
            
            this.showNotification(`Removed ${unit.name} from army`);
        }
    }

    updateArmyDisplay() {
        // Update points display
        this.updatePointsDisplay();
        
        // Update slot counts
        this.updateSlotCounts();
        
        // Update summary
        this.updateSummary();
    }

    updatePointsDisplay() {
        this.army.totalPoints = this.army.units.reduce((sum, unit) => sum + unit.points, 0);
        this.army.powerLevel = this.army.units.reduce((sum, unit) => sum + unit.pl, 0);
        
        document.getElementById('total-points').textContent = 
            `${this.army.totalPoints}/${this.army.pointsLimit}`;
        
        // Update progress bar
        const progress = (this.army.totalPoints / this.army.pointsLimit) * 100;
        document.getElementById('total-points').style.color = 
            progress > 90 ? '#f44336' : progress > 75 ? '#ff9800' : '#4caf50';
    }

    updateSlotCounts() {
        const roleCounts = {
            hq: 0,
            troops: 0,
            elites: 0,
            'fast-attack': 0,
            'heavy-support': 0,
            flyer: 0,
            transport: 0
        };
        
        this.army.units.forEach(unit => {
            roleCounts[unit.role]++;
        });
        
        // Update each slot count display
        Object.keys(roleCounts).forEach(role => {
            const countElement = document.querySelector(`.slot-category h5[data-role="${role}"] .slot-count`);
            if (countElement) {
                const maxSlots = this.getMaxSlotsForRole(role);
                countElement.textContent = `${roleCounts[role]}/${maxSlots}`;
                
                // Highlight if over limit
                countElement.style.color = roleCounts[role] > maxSlots ? '#f44336' : '#d4af37';
            }
        });
    }

    getMaxSlotsForRole(role) {
        const maxSlots = {
            hq: 2,
            troops: 3,
            elites: 3,
            'fast-attack': 3,
            'heavy-support': 3,
            flyer: 2,
            transport: 3
        };
        return maxSlots[role] || 3;
    }

    updateSummary() {
        document.getElementById('summary-points').textContent = this.army.totalPoints;
        document.getElementById('summary-pl').textContent = this.army.powerLevel;
        document.getElementById('summary-units').textContent = this.army.units.length;
        document.getElementById('summary-detachments').textContent = this.army.detachments.length;
        
        // Calculate command points (simplified)
        this.army.commandPoints = Math.max(0, 12 - Math.floor(this.army.totalPoints / 500));
        document.getElementById('summary-cp').textContent = this.army.commandPoints;
    }

    showUnitInfo(unit) {
        const infoDiv = document.getElementById('unit-info');
        const infoContent = infoDiv.querySelector('.info-content');
        
        infoContent.innerHTML = `
            <h5>${unit.name}</h5>
            <div class="unit-info-details">
                <p><strong>Role:</strong> ${this.formatRole(unit.role)}</p>
                <p><strong>Points:</strong> ${unit.points}</p>
                <p><strong>Power Level:</strong> ${unit.pl}</p>
                ${unit.min ? `<p><strong>Unit Size:</strong> ${unit.min}-${unit.max || unit.min}</p>` : ''}
                ${unit.capacity ? `<p><strong>Transport Capacity:</strong> ${unit.capacity} models</p>` : ''}
            </div>
            <div class="unit-abilities">
                <h6>Abilities:</h6>
                <ul>
                    ${unit.abilities ? unit.abilities.map(ability => `<li>${ability}</li>`).join('') : '<li>No special abilities</li>'}
                </ul>
            </div>
            <button class="add-from-info imperial-btn">Add to Army</button>
        `;
        
        infoDiv.style.display = 'block';
        
        // Add button listener
        infoContent.querySelector('.add-from-info').addEventListener('click', () => {
            this.addUnitToArmy(unit);
        });
    }

    formatRole(role) {
        const roleNames = {
            hq: 'HQ',
            troops: 'Troops',
            elites: 'Elites',
            'fast-attack': 'Fast Attack',
            'heavy-support': 'Heavy Support',
            flyer: 'Flyer',
            transport: 'Transport'
        };
        return roleNames[role] || role;
    }

    saveCurrentArmy() {
        const armyName = prompt('Enter a name for this army list:', 
            `${this.army.faction.replace('_', ' ')} ${this.army.totalPoints}pts`);
        
        if (!armyName) return;
        
        const armyData = {
            name: armyName,
            faction: this.army.faction,
            pointsLimit: this.army.pointsLimit,
            totalPoints: this.army.totalPoints,
            units: this.army.units,
            notes: this.army.notes,
            date: new Date().toISOString()
        };
        
        // Save to localStorage
        let savedArmies = JSON.parse(localStorage.getItem('warhammerArmies') || '[]');
        savedArmies.push(armyData);
        localStorage.setItem('warhammerArmies', JSON.stringify(savedArmies));
        
        this.showNotification(`Army "${armyName}" saved!`);
        this.updateSavedListsDisplay();
    }

    loadSavedLists() {
        const saved = localStorage.getItem('warhammerArmies');
        return saved ? JSON.parse(saved) : [];
    }

    updateSavedListsDisplay() {
        const savedLists = this.loadSavedLists();
        const container = document.getElementById('saved-lists');
        
        if (savedLists.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No saved army lists yet</p>
                    <p>Create and save your first list!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = savedLists.map((army, index) => `
            <div class="saved-list-item">
                <div class="saved-list-header">
                    <h4>${army.name}</h4>
                    <span class="saved-list-date">${new Date(army.date).toLocaleDateString()}</span>
                </div>
                <div class="saved-list-details">
                    <span class="saved-faction">${army.faction.replace('_', ' ')}</span>
                    <span class="saved-points">${army.totalPoints}pts</span>
                    <span class="saved-units">${army.units.length} units</span>
                </div>
                <div class="saved-list-actions">
                    <button class="load-saved-btn" data-index="${index}">Load</button>
                    <button class="delete-saved-btn" data-index="${index}">Delete</button>
                    <button class="export-saved-btn" data-index="${index}">Export</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.load-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.loadArmy(index);
            });
        });
        
        container.querySelectorAll('.delete-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteArmy(index);
            });
        });
        
        container.querySelectorAll('.export-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.exportSingleArmy(index);
            });
        });
    }

    loadArmy(index) {
        const savedArmies = this.loadSavedLists();
        if (index >= 0 && index < savedArmies.length) {
            const army = savedArmies[index];
            
            if (confirm(`Load "${army.name}"? Current army will be replaced.`)) {
                this.army.faction = army.faction;
                this.army.pointsLimit = army.pointsLimit;
                this.army.units = army.units.map(u => ({...u}));
                this.army.notes = army.notes || '';
                
                // Update UI
                document.getElementById('faction-select').value = army.faction;
                document.getElementById('points-limit').value = army.pointsLimit;
                document.getElementById('army-notes').value = army.notes;
                
                this.updateUnitList();
                this.updateArmyDisplay();
                this.clearSlots();
                this.army.units.forEach(unit => this.addUnitToSlot(unit));
                
                this.showNotification(`Loaded "${army.name}"`);
            }
        }
    }

    deleteArmy(index) {
        if (confirm('Delete this saved army?')) {
            let savedArmies = this.loadSavedLists();
            savedArmies.splice(index, 1);
            localStorage.setItem('warhammerArmies', JSON.stringify(savedArmies));
            this.updateSavedListsDisplay();
            this.showNotification('Army deleted');
        }
    }

    clearSlots() {
        document.querySelectorAll('.slot-list').forEach(slot => {
            slot.innerHTML = '';
        });
    }

    clearArmy() {
        this.army.units = [];
        this.army.notes = '';
        this.army.totalPoints = 0;
        this.army.powerLevel = 0;
        
        document.getElementById('army-notes').value = '';
        this.clearSlots();
        this.updateArmyDisplay();
        
        this.showNotification('Army cleared');
    }

    validateArmy() {
        const errors = [];
        const warnings = [];
        
        // Check points limit
        if (this.army.totalPoints > this.army.pointsLimit) {
            errors.push(`Army exceeds points limit by ${this.army.totalPoints - this.army.pointsLimit} points`);
        }
        
        // Check minimum requirements
        const hqCount = this.army.units.filter(u => u.role === 'hq').length;
        const troopsCount = this.army.units.filter(u => u.role === 'troops').length;
        
        if (hqCount < 1) {
            errors.push('Army must contain at least 1 HQ unit');
        }
        
        if (troopsCount < 1) {
            errors.push('Army must contain at least 1 Troops unit');
        }
        
        // Check slot limits
        Object.keys(this.getMaxSlotsForRole).forEach(role => {
            const count = this.army.units.filter(u => u.role === role).length;
            const max = this.getMaxSlotsForRole(role);
            if (count > max) {
                errors.push(`Too many ${this.formatRole(role)} units (${count}/${max})`);
            }
        });
        
        // Show results
        if (errors.length === 0 && warnings.length === 0) {
            alert('✓ Army list is valid and battle-ready!');
        } else {
            let message = '';
            if (errors.length > 0) {
                message += 'Errors:\n' + errors.map(e => `• ${e}`).join('\n') + '\n\n';
            }
            if (warnings.length > 0) {
                message += 'Warnings:\n' + warnings.map(w => `• ${w}`).join('\n');
            }
            alert(message || 'Army list has issues that need to be fixed.');
        }
    }

    exportArmy() {
        const armyText = this.generateArmyText();
        
        // Create download link
        const blob = new Blob([armyText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warhammer-army-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Army exported');
    }

    exportSingleArmy(index) {
        const savedArmies = this.loadSavedLists();
        if (index >= 0 && index < savedArmies.length) {
            const army = savedArmies[index];
            const armyText = this.generateArmyTextFromData(army);
            
            const blob = new Blob([armyText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${army.name.replace(/\s+/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    generateArmyText() {
        let text = `=== WARHAMMER 40K ARMY LIST ===\n\n`;
        text += `Faction: ${this.army.faction.replace('_', ' ')}\n`;
        text += `Points: ${this.army.totalPoints}/${this.army.pointsLimit}\n`;
        text += `Power Level: ${this.army.powerLevel}\n`;
        text += `Command Points: ${this.army.commandPoints}\n\n`;
        text += `=== UNITS ===\n\n`;
        
        // Group by role
        const byRole = {};
        this.army.units.forEach(unit => {
            if (!byRole[unit.role]) byRole[unit.role] = [];
            byRole[unit.role].push(unit);
        });
        
        Object.keys(byRole).sort().forEach(role => {
            text += `${this.formatRole(role).toUpperCase()}:\n`;
            byRole[role].forEach(unit => {
                text += `  • ${unit.name} - ${unit.points}pts (PL: ${unit.pl})\n`;
            });
            text += '\n';
        });
        
        if (this.army.notes) {
            text += `=== NOTES & STRATEGY ===\n\n`;
            text += this.army.notes;
        }
        
        text += `\n\nGenerated by Grimdark Archives`;
        
        return text;
    }

    generateArmyTextFromData(army) {
        let text = `=== WARHAMMER 40K ARMY LIST ===\n\n`;
        text += `Name: ${army.name}\n`;
        text += `Faction: ${army.faction.replace('_', ' ')}\n`;
        text += `Points: ${army.totalPoints}/${army.pointsLimit}\n`;
        text += `Date: ${new Date(army.date).toLocaleString()}\n\n`;
        text += `=== UNITS ===\n\n`;
        
        // Group by role
        const byRole = {};
        army.units.forEach(unit => {
            if (!byRole[unit.role]) byRole[unit.role] = [];
            byRole[unit.role].push(unit);
        });
        
        Object.keys(byRole).sort().forEach(role => {
            text += `${this.formatRole(role).toUpperCase()}:\n`;
            byRole[role].forEach(unit => {
                text += `  • ${unit.name} - ${unit.points}pts\n`;
            });
            text += '\n';
        });
        
        if (army.notes) {
            text += `=== NOTES & STRATEGY ===\n\n`;
            text += army.notes;
        }
        
        text += `\n\nGenerated by Grimdark Archives`;
        
        return text;
    }

    printArmy() {
        const printWindow = window.open('', '_blank');
        const armyText = this.generateArmyText();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Warhammer Army List</title>
                <style>
                    body { font-family: 'Cinzel', serif; padding: 20px; background: #0a0a0a; color: #d4af37; }
                    h1 { color: #8b0000; border-bottom: 2px solid #d4af37; }
                    .unit { margin: 10px 0; padding: 10px; border-left: 3px solid #8b0000; }
                    @media print { body { color: #000; } }
                </style>
            </head>
            <body>
                <pre>${armyText}</pre>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    saveNotes() {
        this.army.notes = document.getElementById('army-notes').value;
        this.showNotification('Notes saved');
    }

    loadTemplate(template) {
        // Simple template loading
        const templates = {
            'space_marines_2000': {
                faction: 'space_marines',
                pointsLimit: 2000,
                units: [
                    { id: 'sm_captain_temp', name: 'Captain', role: 'hq', points: 80, pl: 4 },
                    { id: 'sm_lt_temp', name: 'Lieutenant', role: 'hq', points: 65, pl: 3 },
                    { id: 'sm_intercessors_temp', name: 'Intercessor Squad', role: 'troops', points: 100, pl: 5, min: 5, max: 10 },
                    { id: 'sm_intercessors_temp2', name: 'Intercessor Squad', role: 'troops', points: 100, pl: 5, min: 5, max: 10 },
                    { id: 'sm_terminators_temp', name: 'Terminator Squad', role: 'elites', points: 200, pl: 10, min: 5, max: 10 },
                    { id: 'sm_predator_temp', name: 'Predator', role: 'heavy-support', points: 130, pl: 7 },
                    { id: 'sm_rhino_temp', name: 'Rhino', role: 'transport', points: 70, pl: 4, capacity: 10 }
                ]
            }
        };
        
        if (templates[template]) {
            if (confirm('Load template? Current army will be replaced.')) {
                const temp = templates[template];
                this.army.faction = temp.faction;
                this.army.pointsLimit = temp.pointsLimit;
                this.army.units = temp.units.map(u => ({...u}));
                
                document.getElementById('faction-select').value = temp.faction;
                document.getElementById('points-limit').value = temp.pointsLimit;
                
                this.updateUnitList();
                this.updateArmyDisplay();
                this.clearSlots();
                this.army.units.forEach(unit => this.addUnitToSlot(unit));
                
                this.showNotification('Template loaded');
            }
        } else {
            alert('Template not found');
        }
    }

    showLoadDialog() {
        const savedArmies = this.loadSavedLists();
        if (savedArmies.length === 0) {
            alert('No saved armies found');
            return;
        }
        
        let list = 'Select army to load:\n\n';
        savedArmies.forEach((army, index) => {
            list += `${index + 1}. ${army.name} (${army.totalPoints}pts)\n`;
        });
        
        const choice = prompt(list + '\nEnter number:');
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < savedArmies.length) {
            this.loadArmy(index);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'army-notification';
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
        
        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const armyBuilder = new ArmyBuilder();
    window.armyBuilder = armyBuilder; // Make available for debugging
    
    console.log('Army Builder initialized');
});