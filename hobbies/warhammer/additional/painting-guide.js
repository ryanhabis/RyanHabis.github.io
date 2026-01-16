// Warhammer 40k Painting Guide
class PaintingGuide {
    constructor() {
        this.selectedColors = [];
        this.currentBrand = 'citadel';
        this.paintBrands = {};
        this.projects = [];
        this.savedRecipes = [];
        this.sessionTimer = null;
        this.timerSeconds = 0;
        this.timerRunning = false;
        
        this.init();
    }

    init() {
        this.loadPaints();
        this.loadProjects();
        this.loadRecipes();
        this.setupEventListeners();
        this.renderPaints();
        this.renderProjects();
        this.renderSavedRecipes();
        this.loadReferenceGallery();
        this.setupTutorialFilters();
    }

    loadPaints() {
        // Citadel Paint Database
        this.paintBrands.citadel = [
            // Base Paints
            { id: 'abaddon-black', name: 'Abaddon Black', type: 'base', group: 'blacks', hex: '#231f20' },
            { id: 'mephiston-red', name: 'Mephiston Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 'macragge-blue', name: 'Macragge Blue', type: 'base', group: 'blues', hex: '#0f3d7c' },
            { id: 'waagh-flesh', name: 'Waagh! Flesh', type: 'base', group: 'greens', hex: '#0b3b36' },
            { id: 'zandri-dust', name: 'Zandri Dust', type: 'base', group: 'browns', hex: '#988e76' },
            { id: 'leadbelcher', name: 'Leadbelcher', type: 'base', group: 'metals', hex: '#8a8a8a' },
            { id: 'retributor-armour', name: 'Retributor Armour', type: 'base', group: 'metals', hex: '#c89d3c' },
            { id: 'bugmans-glow', name: 'Bugman\'s Glow', type: 'base', group: 'skins', hex: '#804d43' },
            { id: 'celestra-grey', name: 'Celestra Grey', type: 'base', group: 'neutrals', hex: '#8fa6a2' },
            { id: 'daemonette-hide', name: 'Daemonette Hide', type: 'base', group: 'purples', hex: '#696682' },
            
            // Layer Paints
            { id: 'evil-sunz-scarlet', name: 'Evil Sunz Scarlet', type: 'layer', group: 'reds', hex: '#c01411' },
            { id: 'wild-rider-red', name: 'Wild Rider Red', type: 'layer', group: 'reds', hex: '#e82d20' },
            { id: 'calgar-blue', name: 'Calgar Blue', type: 'layer', group: 'blues', hex: '#2a497f' },
            { id: 'fenrisian-grey', name: 'Fenrisian Grey', type: 'layer', group: 'blues', hex: '#6d93b3' },
            { id: 'warboss-green', name: 'Warboss Green', type: 'layer', group: 'greens', hex: '#317e57' },
            { id: 'skarsnik-green', name: 'Skarsnik Green', type: 'layer', group: 'greens', hex: '#578c6a' },
            { id: 'averland-sunset', name: 'Averland Sunset', type: 'layer', group: 'yellows', hex: '#fbb81c' },
            { id: 'yriel-yellow', name: 'Yriel Yellow', type: 'layer', group: 'yellows', hex: '#fcd20e' },
            { id: 'xereus-purple', name: 'Xereus Purple', type: 'layer', group: 'purples', hex: '#47125a' },
            { id: 'genestealer-purple', name: 'Genestealer Purple', type: 'layer', group: 'purples', hex: '#7658a5' },
            { id: 'ushabti-bone', name: 'Ushabti Bone', type: 'layer', group: 'browns', hex: '#aba173' },
            { id: 'screaming-skull', name: 'Screaming Skull', type: 'layer', group: 'browns', hex: '#d1c8a6' },
            { id: 'kislev-flesh', name: 'Kislev Flesh', type: 'layer', group: 'skins', hex: '#d1a570' },
            { id: 'cadian-fleshtone', name: 'Cadian Fleshtone', type: 'layer', group: 'skins', hex: '#c47652' },
            
            // Shade Paints
            { id: 'nuln-oil', name: 'Nuln Oil', type: 'shade', group: 'blacks', hex: '#14171c' },
            { id: 'agrax-earthshade', name: 'Agrax Earthshade', type: 'shade', group: 'browns', hex: '#4c3d31' },
            { id: 'reikland-fleshshade', name: 'Reikland Fleshshade', type: 'shade', group: 'browns', hex: '#bd6b41' },
            { id: 'drakenhof-nightshade', name: 'Drakenhof Nightshade', type: 'shade', group: 'blues', hex: '#122b4e' },
            { id: 'carroburg-crimson', name: 'Carroburg Crimson', type: 'shade', group: 'reds', hex: '#5a1a2a' },
            { id: 'biel-tan-green', name: 'Biel-tan Green', type: 'shade', group: 'greens', hex: '#1e5141' },
            { id: 'seraphim-sepia', name: 'Seraphim Sepia', type: 'shade', group: 'browns', hex: '#835718' },
            
            // Contrast Paints
            { id: 'black-templar', name: 'Black Templar', type: 'contrast', group: 'blacks', hex: '#1a1d23' },
            { id: 'blood-angels-red', name: 'Blood Angels Red', type: 'contrast', group: 'reds', hex: '#a7121e' },
            { id: 'ultramarines-blue', name: 'Ultramarines Blue', type: 'contrast', group: 'blues', hex: '#1c3d8c' },
            { id: 'dark-angels-green', name: 'Dark Angels Green', type: 'contrast', group: 'greens', hex: '#0d412d' },
            { id: 'imperial-fists-yellow', name: 'Imperial Fists Yellow', type: 'contrast', group: 'yellows', hex: '#f5c542' },
            { id: 'space-wolves-grey', name: 'Space Wolves Grey', type: 'contrast', group: 'blues', hex: '#647c94' },
            { id: 'magos-purple', name: 'Magos Purple', type: 'contrast', group: 'purples', hex: '#9067b5' },
            { id: 'skeleton-horde', name: 'Skeleton Horde', type: 'contrast', group: 'browns', hex: '#b79a6e' },
            { id: 'guilliman-flesh', name: 'Guilliman Flesh', type: 'contrast', group: 'skins', hex: '#bc7055' },
            
            // Technical Paints
            { id: 'ardcoat', name: 'Ardcoat', type: 'technical', group: 'neutrals', hex: '#ffffff' },
            { id: 'nihilakh-oxide', name: 'Nihilakh Oxide', type: 'technical', group: 'blues', hex: '#008872' },
            { id: 'typhus-corrosion', name: 'Typhus Corrosion', type: 'technical', group: 'browns', hex: '#423d37' },
            { id: 'blood-for-the-blood-god', name: 'Blood for the Blood God', type: 'technical', group: 'reds', hex: '#a60710' },
            { id: 'nurgles-rot', name: 'Nurgle\'s Rot', type: 'technical', group: 'greens', hex: '#475426' },
        ];

        // Vallejo paints (simplified)
        this.paintBrands.vallejo = [
            { id: 'v-black', name: 'Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 'v-white', name: 'White', type: 'base', group: 'neutrals', hex: '#ffffff' },
            { id: 'v-red', name: 'Red', type: 'base', group: 'reds', hex: '#c10000' },
            { id: 'v-blue', name: 'Blue', type: 'base', group: 'blues', hex: '#003399' },
            { id: 'v-gold', name: 'Gold', type: 'base', group: 'metals', hex: '#c9a347' },
            { id: 'v-silver', name: 'Silver', type: 'base', group: 'metals', hex: '#a0a0a0' },
        ];

        // Army Painter paints (simplified)
        this.paintBrands['army-painter'] = [
            { id: 'ap-matt-black', name: 'Matt Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 'ap-dragon-red', name: 'Dragon Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 'ap-crystal-blue', name: 'Crystal Blue', type: 'base', group: 'blues', hex: '#3a6b8c' },
            { id: 'ap-greedy-gold', name: 'Greedy Gold', type: 'base', group: 'metals', hex: '#c89d3c' },
        ];

        // Scale75 paints (simplified)
        this.paintBrands.scale75 = [
            { id: 's75-black', name: 'Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 's75-red', name: 'Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 's75-blue', name: 'Blue', type: 'base', group: 'blues', hex: '#1c3d8c' },
            { id: 's75-gold', name: 'Gold', type: 'base', group: 'metals', hex: '#c89d3c' },
        ];
    }

    setupEventListeners() {
        // Paint search
        document.getElementById('paint-search').addEventListener('input', (e) => {
            this.filterPaints(e.target.value);
        });
        
        // Color type filter
        document.getElementById('color-type').addEventListener('change', (e) => {
            this.filterPaints();
        });
        
        // Color group filter
        document.getElementById('color-group').addEventListener('change', (e) => {
            this.filterPaints();
        });
        
        // Clear palette
        document.getElementById('clear-palette').addEventListener('click', () => {
            this.clearPalette();
        });
        
        // Save palette
        document.getElementById('save-palette').addEventListener('click', () => {
            this.savePalette();
        });
        
        // Load palette
        document.getElementById('load-palette').addEventListener('click', () => {
            this.loadPalette();
        });
        
        // Generate recipe from palette
        document.getElementById('generate-recipe').addEventListener('click', () => {
            this.generateRecipeFromPalette();
        });
        
        // Export palette
        document.getElementById('export-palette').addEventListener('click', () => {
            this.exportPalette();
        });
        
        // Recipe generation
        document.getElementById('generate-faction-recipe').addEventListener('click', () => {
            this.generateFactionRecipe();
        });
        
        // Random recipe
        document.getElementById('random-recipe').addEventListener('click', () => {
            this.generateRandomRecipe();
        });
        
        // Save recipe
        document.getElementById('save-recipe').addEventListener('click', () => {
            this.saveCurrentRecipe();
        });
        
        // Share recipe
        document.getElementById('share-recipe').addEventListener('click', () => {
            this.shareRecipe();
        });
        
        // Add recipe step
        document.getElementById('add-step').addEventListener('click', () => {
            this.addRecipeStep();
        });
        
        // Clear recipe
        document.getElementById('clear-recipe').addEventListener('click', () => {
            this.clearRecipe();
        });
        
        // Project form submission
        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });
        
        // Paint calculator
        document.getElementById('calculate-paint').addEventListener('click', () => {
            this.calculatePaintNeeded();
        });
        
        // Timer controls
        document.getElementById('start-timer').addEventListener('click', () => {
            this.startTimer();
        });
        
        document.getElementById('pause-timer').addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('reset-timer').addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Download guides
        document.getElementById('download-guides').addEventListener('click', () => {
            this.downloadGuides();
        });
        
        // Open progress tracker
        document.getElementById('open-progress').addEventListener('click', () => {
            this.showProgressTracker();
        });
    }

    renderPaints() {
        const colorGrid = document.getElementById('color-grid');
        const paints = this.paintBrands[this.currentBrand] || [];
        
        if (paints.length === 0) {
            colorGrid.innerHTML = `
                <div class="empty-paints">
                    <i class="fas fa-paint-brush"></i>
                    <p>No paints found for this brand</p>
                </div>
            `;
            return;
        }
        
        colorGrid.innerHTML = paints.map(paint => `
            <div class="color-swatch" data-id="${paint.id}" data-type="${paint.type}" data-group="${paint.group}">
                <div class="swatch-color" style="background-color: ${paint.hex};"></div>
                <div class="swatch-info">
                    <span class="swatch-name">${paint.name}</span>
                    <span class="swatch-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                </div>
                <button class="add-to-palette" data-id="${paint.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
        
        // Add click event to swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-palette')) {
                    const paintId = swatch.dataset.id;
                    this.showPaintInfo(paintId);
                }
            });
        });
        
        // Add click event to add buttons
        document.querySelectorAll('.add-to-palette').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paintId = btn.dataset.id;
                this.addToPalette(paintId);
            });
        });
    }

    filterPaints(searchTerm = '') {
        const typeFilter = document.getElementById('color-type').value;
        const groupFilter = document.getElementById('color-group').value;
        const paints = this.paintBrands[this.currentBrand] || [];
        
        const filtered = paints.filter(paint => {
            // Search term filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                if (!paint.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            
            // Type filter
            if (typeFilter !== 'all' && paint.type !== typeFilter) {
                return false;
            }
            
            // Group filter
            if (groupFilter !== 'all' && paint.group !== groupFilter) {
                return false;
            }
            
            return true;
        });
        
        this.renderFilteredPaints(filtered);
    }

    renderFilteredPaints(paints) {
        const colorGrid = document.getElementById('color-grid');
        
        if (paints.length === 0) {
            colorGrid.innerHTML = `
                <div class="empty-paints">
                    <i class="fas fa-search"></i>
                    <p>No paints match your search</p>
                </div>
            `;
            return;
        }
        
        colorGrid.innerHTML = paints.map(paint => `
            <div class="color-swatch" data-id="${paint.id}" data-type="${paint.type}" data-group="${paint.group}">
                <div class="swatch-color" style="background-color: ${paint.hex};"></div>
                <div class="swatch-info">
                    <span class="swatch-name">${paint.name}</span>
                    <span class="swatch-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                </div>
                <button class="add-to-palette" data-id="${paint.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
        
        // Re-attach event listeners
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-palette')) {
                    const paintId = swatch.dataset.id;
                    this.showPaintInfo(paintId);
                }
            });
        });
        
        document.querySelectorAll('.add-to-palette').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paintId = btn.dataset.id;
                this.addToPalette(paintId);
            });
        });
    }

    addToPalette(paintId) {
        const paints = this.paintBrands[this.currentBrand] || [];
        const paint = paints.find(p => p.id === paintId);
        
        if (!paint) return;
        
        // Check if already in palette
        if (this.selectedColors.some(color => color.id === paintId)) {
            this.showNotification(`${paint.name} is already in your palette`, 'info');
            return;
        }
        
        // Add to palette
        this.selectedColors.push({
            ...paint,
            brand: this.currentBrand
        });
        
        this.updatePalette();
        this.showNotification(`Added ${paint.name} to palette`);
    }

    updatePalette() {
        const palette = document.getElementById('palette');
        const paletteCount = document.getElementById('palette-count');
        const generateBtn = document.getElementById('generate-recipe');
        const exportBtn = document.getElementById('export-palette');
        
        paletteCount.textContent = `${this.selectedColors.length} color${this.selectedColors.length !== 1 ? 's' : ''}`;
        
        // Enable/disable buttons
        generateBtn.disabled = this.selectedColors.length === 0;
        exportBtn.disabled = this.selectedColors.length === 0;
        
        if (this.selectedColors.length === 0) {
            palette.innerHTML = `
                <div class="empty-palette">
                    <i class="fas fa-palette"></i>
                    <p>No colors selected</p>
                    <p>Click paint swatches to add them to your palette</p>
                </div>
            `;
            return;
        }
        
        palette.innerHTML = this.selectedColors.map((color, index) => `
            <div class="palette-color" data-index="${index}">
                <div class="palette-swatch" style="background-color: ${color.hex};"></div>
                <div class="palette-info">
                    <span class="palette-name">${color.name}</span>
                    <span class="palette-brand">${this.formatBrand(color.brand)}</span>
                </div>
                <button class="remove-color" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add remove event listeners
        document.querySelectorAll('.remove-color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeFromPalette(index);
            });
        });
    }

    removeFromPalette(index) {
        if (index >= 0 && index < this.selectedColors.length) {
            const removedColor = this.selectedColors[index];
            this.selectedColors.splice(index, 1);
            this.updatePalette();
            this.showNotification(`Removed ${removedColor.name} from palette`);
        }
    }

    clearPalette() {
        if (this.selectedColors.length === 0) return;
        
        if (confirm('Clear all colors from your palette?')) {
            this.selectedColors = [];
            this.updatePalette();
            this.showNotification('Palette cleared');
        }
    }

    savePalette() {
        if (this.selectedColors.length === 0) {
            this.showNotification('Palette is empty', 'warning');
            return;
        }
        
        const paletteName = prompt('Enter a name for your palette:', 'My Palette');
        if (!paletteName) return;
        
        const palette = {
            name: paletteName,
            colors: this.selectedColors,
            created: new Date().toISOString(),
            brand: this.currentBrand
        };
        
        // Save to localStorage
        const savedPalettes = JSON.parse(localStorage.getItem('warhammerPalettes') || '[]');
        savedPalettes.push(palette);
        localStorage.setItem('warhammerPalettes', JSON.stringify(savedPalettes));
        
        this.showNotification(`Palette "${paletteName}" saved`);
    }

    loadPalette() {
        const savedPalettes = JSON.parse(localStorage.getItem('warhammerPalettes') || '[]');
        
        if (savedPalettes.length === 0) {
            this.showNotification('No saved palettes found', 'info');
            return;
        }
        
        // Create selection dialog
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 1rem;
        `;
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Load Palette</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="palettes-list">
                        ${savedPalettes.map((palette, index) => `
                            <div class="palette-item" data-index="${index}">
                                <h4>${palette.name}</h4>
                                <div class="palette-preview">
                                    ${palette.colors.slice(0, 5).map(color => `
                                        <div class="preview-swatch" style="background-color: ${color.hex};"></div>
                                    `).join('')}
                                    ${palette.colors.length > 5 ? `<span class="more-count">+${palette.colors.length - 5}</span>` : ''}
                                </div>
                                <div class="palette-meta">
                                    <span>${palette.colors.length} colors</span>
                                    <span>${new Date(palette.created).toLocaleDateString()}</span>
                                </div>
                                <button class="load-palette-btn" data-index="${index}">Load</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelectorAll('.load-palette-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                const palette = savedPalettes[index];
                
                // Load palette
                this.selectedColors = palette.colors;
                this.currentBrand = palette.brand;
                
                // Update brand button
                document.querySelectorAll('.brand-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.brand === palette.brand);
                });
                
                this.updatePalette();
                this.renderPaints();
                document.body.removeChild(modal);
                
                this.showNotification(`Loaded palette "${palette.name}"`);
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    exportPalette() {
        if (this.selectedColors.length === 0) return;
        
        const exportData = {
            palette: this.selectedColors,
            exported: new Date().toISOString(),
            brand: this.currentBrand
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `warhammer-palette-${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
        
        this.showNotification('Palette exported');
    }

    showPaintInfo(paintId) {
        const paints = this.paintBrands[this.currentBrand] || [];
        const paint = paints.find(p => p.id === paintId);
        
        if (!paint) return;
        
        const colorInfo = document.getElementById('color-info');
        colorInfo.innerHTML = `
            <div class="color-detail">
                <div class="color-header">
                    <div class="color-swatch-large" style="background-color: ${paint.hex};"></div>
                    <div class="color-title">
                        <h4>${paint.name}</h4>
                        <span class="color-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                        <span class="color-brand">${this.formatBrand(this.currentBrand)}</span>
                    </div>
                </div>
                
                <div class="color-properties">
                    <div class="property">
                        <span>Hex Color:</span>
                        <strong>${paint.hex.toUpperCase()}</strong>
                    </div>
                    <div class="property">
                        <span>Color Group:</span>
                        <strong>${this.formatColorGroup(paint.group)}</strong>
                    </div>
                </div>
                
                <div class="color-uses">
                    <h5>Common Uses:</h5>
                    <ul>
                        ${this.getPaintUses(paint).map(use => `<li>${use}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="color-alternatives">
                    <h5>Alternative Paints:</h5>
                    <div class="alternatives-list">
                        ${this.getAlternativePaints(paint).map(alt => `
                            <div class="alternative">
                                <div class="alt-swatch" style="background-color: ${alt.hex};"></div>
                                <span class="alt-name">${alt.name}</span>
                                <span class="alt-brand">${this.formatBrand(alt.brand)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        colorInfo.style.display = 'block';
    }

    getPaintUses(paint) {
        const uses = {
            'abaddon-black': ['Armor black', 'Weapons', 'Vehicle trim'],
            'mephiston-red': ['Blood Angels armor', 'Red details', 'Weapon casings'],
            'macragge-blue': ['Ultramarines armor', 'Blue armor plates', 'Vehicle panels'],
            'leadbelcher': ['Metallic surfaces', 'Weapons', 'Armor trim'],
            'retributor-armour': ['Gold details', 'Relics', 'Officer trim'],
            'nuln-oil': ['All-over wash', 'Recess shading', 'Weathering'],
            'agrax-earthshade': ['Brown shading', 'Dirt effects', 'Weathering'],
        };
        
        return uses[paint.id] || ['Base coating', 'Layer highlights', 'Details'];
    }

    getAlternativePaints(paint) {
        // Simple alternative finder by color group
        const alternatives = [];
        const currentHex = paint.hex.toLowerCase();
        
        Object.entries(this.paintBrands).forEach(([brand, paints]) => {
            if (brand === this.currentBrand) return;
            
            const similar = paints.find(p => 
                p.group === paint.group && 
                p.type === paint.type &&
                p.hex.toLowerCase() !== currentHex
            );
            
            if (similar) {
                alternatives.push({
                    ...similar,
                    brand: brand
                });
            }
        });
        
        return alternatives.slice(0, 3);
    }

    generateRecipeFromPalette() {
        if (this.selectedColors.length === 0) return;
        
        const recipeResult = document.getElementById('recipe-result');
        
        const recipe = {
            name: 'Custom Palette Recipe',
            steps: [
                '1. Prepare your miniature with proper assembly and priming',
                '2. Apply base coats using your selected colors',
                '3. Add shading with appropriate washes',
                '4. Build up layers for highlights',
                '5. Add final details and edge highlights'
            ],
            colors: this.selectedColors,
            estimatedTime: '2-4 hours',
            difficulty: 'Intermediate'
        };
        
        recipeResult.innerHTML = this.renderRecipe(recipe);
    }

    generateFactionRecipe() {
        const faction = document.getElementById('recipe-faction').value;
        const quality = document.getElementById('recipe-quality').value;
        const speed = document.getElementById('recipe-speed').value;
        
        if (!faction) {
            this.showNotification('Please select a faction', 'warning');
            return;
        }
        
        const recipes = {
            'ultramarines': {
                name: 'Ultramarines Army Scheme',
                steps: [
                    '1. Prime with Macragge Blue spray',
                    '2. Base coat all armor with Macragge Blue',
                    '3. Wash recesses with Drakenhof Nightshade',
                    '4. Layer up with Calgar Blue',
                    '5. Edge highlight with Fenrisian Grey',
                    '6. Paint gold details with Retributor Armour',
                    '7. Wash gold with Reikland Fleshshade',
                    '8. Highlight gold with Liberator Gold',
                    '9. Paint weapons with Abaddon Black',
                    '10. Highlight weapons with Eshin Grey'
                ],
                colors: [
                    { name: 'Macragge Blue', type: 'base', hex: '#0f3d7c' },
                    { name: 'Calgar Blue', type: 'layer', hex: '#2a497f' },
                    { name: 'Fenrisian Grey', type: 'layer', hex: '#6d93b3' },
                    { name: 'Drakenhof Nightshade', type: 'shade', hex: '#122b4e' },
                    { name: 'Retributor Armour', type: 'base', hex: '#c89d3c' },
                    { name: 'Reikland Fleshshade', type: 'shade', hex: '#bd6b41' },
                    { name: 'Abaddon Black', type: 'base', hex: '#231f20' }
                ],
                estimatedTime: '3-5 hours per squad',
                difficulty: 'Intermediate'
            },
            'blood_angels': {
                name: 'Blood Angels Army Scheme',
                steps: [
                    '1. Prime with Mephiston Red spray',
                    '2. Base coat all armor with Mephiston Red',
                    '3. Wash recesses with Carroburg Crimson',
                    '4. Layer up with Evil Sunz Scarlet',
                    '5. Edge highlight with Wild Rider Red',
                    '6. Paint black details with Abaddon Black',
                    '7. Highlight black with Eshin Grey',
                    '8. Paint gold details with Retributor Armour'
                ],
                colors: [
                    { name: 'Mephiston Red', type: 'base', hex: '#9a0c13' },
                    { name: 'Evil Sunz Scarlet', type: 'layer', hex: '#c01411' },
                    { name: 'Wild Rider Red', type: 'layer', hex: '#e82d20' },
                    { name: 'Carroburg Crimson', type: 'shade', hex: '#5a1a2a' },
                    { name: 'Abaddon Black', type: 'base', hex: '#231f20' },
                    { name: 'Retributor Armour', type: 'base', hex: '#c89d3c' }
                ],
                estimatedTime: '3-4 hours per squad',
                difficulty: 'Intermediate'
            },
            'cadian': {
                name: 'Cadian Imperial Guard',
                steps: [
                    '1. Prime with Zandri Dust spray',
                    '2. Base coat fatigues with Zandri Dust',
                    '3. Base coat armor with Castellan Green',
                    '4. Wash entire model with Agrax Earthshade',
                    '5. Layer fatigues with Ushabti Bone',
                    '6. Layer armor with Loren Forest',
                    '7. Paint weapons with Leadbelcher',
                    '8. Wash metals with Nuln Oil',
                    '9. Paint skin with Cadian Fleshtone',
                    '10. Wash skin with Reikland Fleshshade'
                ],
                colors: [
                    { name: 'Zandri Dust', type: 'base', hex: '#988e76' },
                    { name: 'Castellan Green', type: 'base', hex: '#264715' },
                    { name: 'Ushabti Bone', type: 'layer', hex: '#aba173' },
                    { name: 'Loren Forest', type: 'layer', hex: '#507021' },
                    { name: 'Agrax Earthshade', type: 'shade', hex: '#4c3d31' },
                    { name: 'Leadbelcher', type: 'base', hex: '#8a8a8a' },
                    { name: 'Cadian Fleshtone', type: 'layer', hex: '#c47652' }
                ],
                estimatedTime: '2-3 hours per squad',
                difficulty: 'Beginner'
            }
        };
        
        const recipe = recipes[faction] || {
            name: 'Custom Faction Recipe',
            steps: ['Recipe generation for this faction is coming soon!'],
            colors: [],
            estimatedTime: 'Unknown',
            difficulty: 'Unknown'
        };
        
        // Adjust recipe based on quality and speed
        if (quality === 'tabletop') {
            recipe.steps = recipe.steps.slice(0, 4); // Fewer steps for tabletop
            recipe.estimatedTime = '1-2 hours per squad';
            recipe.difficulty = 'Beginner';
        } else if (quality === 'display') {
            recipe.steps.push('11. Add volumetric highlights');
            recipe.steps.push('12. Apply weathering effects');
            recipe.steps.push('13. Add object source lighting');
            recipe.estimatedTime = '6-8 hours per model';
            recipe.difficulty = 'Advanced';
        }
        
        if (speed === 'fast') {
            recipe.steps = recipe.steps.filter(step => 
                !step.includes('highlight') && !step.includes('layer')
            );
            recipe.estimatedTime = '30-60 minutes per squad';
        }
        
        const recipeResult = document.getElementById('recipe-result');
        recipeResult.innerHTML = this.renderRecipe(recipe);
        
        // Store current recipe for saving
        this.currentRecipe = recipe;
    }

    renderRecipe(recipe) {
        return `
            <div class="recipe-display">
                <div class="recipe-header">
                    <h4>${recipe.name}</h4>
                    <div class="recipe-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i> ${recipe.estimatedTime}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i> ${recipe.difficulty}
                        </span>
                    </div>
                </div>
                
                <div class="recipe-steps">
                    <h5>Painting Steps:</h5>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                ${recipe.colors.length > 0 ? `
                    <div class="recipe-colors">
                        <h5>Required Paints:</h5>
                        <div class="colors-list">
                            ${recipe.colors.map(color => `
                                <div class="recipe-color">
                                    <div class="recipe-swatch" style="background-color: ${color.hex};"></div>
                                    <span class="color-name">${color.name}</span>
                                    <span class="color-type ${color.type}">${this.formatPaintType(color.type)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="recipe-tips">
                    <h5>Tips:</h5>
                    <ul>
                        <li>Thin your paints with water or medium</li>
                        <li>Allow each layer to dry completely before applying the next</li>
                        <li>Use multiple thin coats rather than one thick coat</li>
                        <li>Keep your brush clean and pointed</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateRandomRecipe() {
        const factions = [
            'ultramarines', 'blood_angels', 'dark_angels', 'imperial_fists',
            'space_wolves', 'cadian', 'necron', 'ork_green', 'tau'
        ];
        
        const randomFaction = factions[Math.floor(Math.random() * factions.length)];
        document.getElementById('recipe-faction').value = randomFaction;
        this.generateFactionRecipe();
        
        this.showNotification(`Generated random recipe for ${this.formatFaction(randomFaction)}`);
    }

    saveCurrentRecipe() {
        if (!this.currentRecipe) {
            this.showNotification('No recipe to save', 'warning');
            return;
        }
        
        const recipeName = prompt('Enter a name for this recipe:', this.currentRecipe.name);
        if (!recipeName) return;
        
        const recipeToSave = {
            ...this.currentRecipe,
            name: recipeName,
            saved: new Date().toISOString(),
            faction: document.getElementById('recipe-faction').value
        };
        
        this.savedRecipes.push(recipeToSave);
        localStorage.setItem('warhammerRecipes', JSON.stringify(this.savedRecipes));
        this.renderSavedRecipes();
        
        this.showNotification(`Recipe "${recipeName}" saved`);
    }

    renderSavedRecipes() {
        const list = document.getElementById('saved-recipes-list');
        
        if (this.savedRecipes.length === 0) {
            list.innerHTML = `
                <div class="empty-saved">
                    <p>No saved recipes yet</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.savedRecipes.map((recipe, index) => `
            <div class="saved-recipe">
                <div class="saved-recipe-header">
                    <h5>${recipe.name}</h5>
                    <span class="saved-date">${new Date(recipe.saved).toLocaleDateString()}</span>
                </div>
                <div class="saved-recipe-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${recipe.estimatedTime}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-signal"></i> ${recipe.difficulty}
                    </span>
                    ${recipe.faction ? `<span class="meta-item">
                        <i class="fas fa-flag"></i> ${this.formatFaction(recipe.faction)}
                    </span>` : ''}
                </div>
                <div class="saved-recipe-actions">
                    <button class="load-recipe" data-index="${index}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="delete-recipe" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.load-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.loadSavedRecipe(index);
            });
        });
        
        document.querySelectorAll('.delete-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.deleteSavedRecipe(index);
            });
        });
    }

    loadSavedRecipe(index) {
        if (index >= 0 && index < this.savedRecipes.length) {
            const recipe = this.savedRecipes[index];
            this.currentRecipe = recipe;
            
            const recipeResult = document.getElementById('recipe-result');
            recipeResult.innerHTML = this.renderRecipe(recipe);
            
            // Scroll to recipe
            recipeResult.scrollIntoView({ behavior: 'smooth' });
            
            this.showNotification(`Loaded recipe "${recipe.name}"`);
        }
    }

    deleteSavedRecipe(index) {
        if (index >= 0 && index < this.savedRecipes.length) {
            const recipeName = this.savedRecipes[index].name;
            
            if (confirm(`Delete recipe "${recipeName}"?`)) {
                this.savedRecipes.splice(index, 1);
                localStorage.setItem('warhammerRecipes', JSON.stringify(this.savedRecipes));
                this.renderSavedRecipes();
                
                this.showNotification(`Deleted recipe "${recipeName}"`);
            }
        }
    }

    shareRecipe() {
        if (!this.currentRecipe) {
            this.showNotification('No recipe to share', 'warning');
            return;
        }
        
        const shareText = `Warhammer 40k Painting Recipe: ${this.currentRecipe.name}\n\n` +
                         `Steps:\n${this.currentRecipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n` +
                         `Generated with Artisan's Painting Guide`;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentRecipe.name,
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Recipe copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy recipe', 'error');
        });
    }

    addRecipeStep() {
        const stepText = prompt('Enter a new painting step:');
        if (!stepText) return;
        
        const recipeResult = document.getElementById('recipe-result');
        const currentRecipe = recipeResult.querySelector('.recipe-display');
        
        if (!currentRecipe) {
            this.showNotification('Please generate a recipe first', 'warning');
            return;
        }
        
        const stepsList = currentRecipe.querySelector('ol');
        if (stepsList) {
            const newStep = document.createElement('li');
            newStep.textContent = stepText;
            stepsList.appendChild(newStep);
            
            this.showNotification('Step added to recipe');
        }
    }

    clearRecipe() {
        if (confirm('Clear the current recipe?')) {
            const recipeResult = document.getElementById('recipe-result');
            recipeResult.innerHTML = `
                <div class="empty-recipe">
                    <i class="fas fa-flask"></i>
                    <h4>No Recipe Generated</h4>
                    <p>Select a faction or build a custom recipe to get started</p>
                </div>
            `;
            
            this.currentRecipe = null;
            this.showNotification('Recipe cleared');
        }
    }

    loadProjects() {
        this.projects = JSON.parse(localStorage.getItem('warhammerProjects') || '[]');
    }

    saveProjects() {
        localStorage.setItem('warhammerProjects', JSON.stringify(this.projects));
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        
        if (this.projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-projects">
                    <i class="fas fa-paint-brush"></i>
                    <h4>No Painting Projects</h4>
                    <p>Start by adding your first painting project</p>
                    <button class="imperial-btn-small" id="add-first-project">Add First Project</button>
                </div>
            `;
            
            document.getElementById('add-first-project').addEventListener('click', () => {
                document.getElementById('project-modal').style.display = 'flex';
            });
            
            return;
        }
        
        projectsGrid.innerHTML = this.projects.map((project, index) => `
            <div class="project-card" data-index="${index}">
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
                
                ${project.faction ? `
                    <div class="project-faction">
                        <i class="fas fa-flag"></i> ${this.formatFaction(project.faction)}
                    </div>
                ` : ''}
                
                <div class="project-stats">
                    <div class="project-stat">
                        <span>Miniatures:</span>
                        <strong>${project.minis || 1}</strong>
                    </div>
                    ${project.points ? `
                        <div class="project-stat">
                            <span>Points:</span>
                            <strong>${project.points}</strong>
                        </div>
                    ` : ''}
                    ${project.deadline ? `
                        <div class="project-stat">
                            <span>Deadline:</span>
                            <strong>${new Date(project.deadline).toLocaleDateString()}</strong>
                        </div>
                    ` : ''}
                </div>
                
                ${project.notes ? `
                    <div class="project-notes">
                        <p>${project.notes.substring(0, 100)}${project.notes.length > 100 ? '...' : ''}</p>
                    </div>
                ` : ''}
                
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${project.progress || 0}% Complete</span>
                </div>
                
                <div class="project-actions">
                    <button class="project-action-btn update-progress" data-index="${index}">
                        <i class="fas fa-chart-line"></i> Update
                    </button>
                    <button class="project-action-btn edit-project" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="project-action-btn delete-project" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.update-progress').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.updateProjectProgress(index);
            });
        });
        
        document.querySelectorAll('.edit-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.editProject(index);
            });
        });
        
        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.deleteProject(index);
            });
        });
    }

    saveProject() {
        const project = {
            id: 'project-' + Date.now(),
            name: document.getElementById('project-name').value,
            faction: document.getElementById('project-faction').value,
            status: document.getElementById('project-status').value,
            minis: parseInt(document.getElementById('project-minis').value) || 1,
            points: document.getElementById('project-points').value ? parseInt(document.getElementById('project-points').value) : null,
            deadline: document.getElementById('project-deadline').value || null,
            notes: document.getElementById('project-notes').value || '',
            progress: 0,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        this.projects.push(project);
        this.saveProjects();
        this.renderProjects();
        
        document.getElementById('project-modal').style.display = 'none';
        document.getElementById('project-form').reset();
        
        this.showNotification(`Project "${project.name}" saved`);
    }

    updateProjectProgress(index) {
        if (index >= 0 && index < this.projects.length) {
            const project = this.projects[index];
            const newProgress = parseInt(prompt(`Enter progress percentage for "${project.name}":`, project.progress || 0));
            
            if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                this.projects[index].progress = newProgress;
                this.projects[index].updated = new Date().toISOString();
                
                if (newProgress === 100) {
                    this.projects[index].status = 'completed';
                } else if (newProgress > 0) {
                    this.projects[index].status = 'in_progress';
                }
                
                this.saveProjects();
                this.renderProjects();
                
                this.showNotification(`Updated progress for "${project.name}" to ${newProgress}%`);
            }
        }
    }

    editProject(index) {
        if (index >= 0 && index < this.projects.length) {
            const project = this.projects[index];
            
            // Populate form
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-faction').value = project.faction || '';
            document.getElementById('project-status').value = project.status;
            document.getElementById('project-minis').value = project.minis || 1;
            document.getElementById('project-points').value = project.points || '';
            document.getElementById('project-deadline').value = project.deadline || '';
            document.getElementById('project-notes').value = project.notes || '';
            
            // Store current index for update
            this.editingProjectIndex = index;
            
            // Change form submit handler
            const form = document.getElementById('project-form');
            const oldSubmit = form.onsubmit;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateProject(index);
                form.onsubmit = oldSubmit;
            };
            
            document.getElementById('project-modal').style.display = 'flex';
        }
    }

    updateProject(index) {
        if (index >= 0 && index < this.projects.length) {
            this.projects[index] = {
                ...this.projects[index],
                name: document.getElementById('project-name').value,
                faction: document.getElementById('project-faction').value,
                status: document.getElementById('project-status').value,
                minis: parseInt(document.getElementById('project-minis').value) || 1,
                points: document.getElementById('project-points').value ? parseInt(document.getElementById('project-points').value) : null,
                deadline: document.getElementById('project-deadline').value || null,
                notes: document.getElementById('project-notes').value || '',
                updated: new Date().toISOString()
            };
            
            this.saveProjects();
            this.renderProjects();
            
            document.getElementById('project-modal').style.display = 'none';
            document.getElementById('project-form').reset();
            
            this.showNotification(`Project "${this.projects[index].name}" updated`);
        }
    }

    deleteProject(index) {
        if (index >= 0 && index < this.projects.length) {
            const projectName = this.projects[index].name;
            
            if (confirm(`Delete project "${projectName}"?`)) {
                this.projects.splice(index, 1);
                this.saveProjects();
                this.renderProjects();
                
                this.showNotification(`Deleted project "${projectName}"`);
            }
        }
    }

    loadRecipes() {
        this.savedRecipes = JSON.parse(localStorage.getItem('warhammerRecipes') || '[]');
    }

    loadPaintBrand(brand) {
        this.currentBrand = brand;
        this.renderPaints();
        this.showNotification(`Loaded ${this.formatBrand(brand)} paints`);
    }

    calculatePaintNeeded() {
        const armySize = parseInt(document.getElementById('army-size').value) || 2000;
        const miniCount = parseInt(document.getElementById('miniature-count').value) || 50;
        const paintType = document.getElementById('paint-type').value;
        const coverage = document.getElementById('coverage').value;
        
        // Simple calculation
        let basePots, layerPots, shadePots;
        
        if (paintType === 'contrast') {
            basePots = Math.ceil(miniCount / 20); // Contrast goes further
            layerPots = Math.ceil(miniCount / 40);
            shadePots = Math.ceil(miniCount / 60);
        } else {
            basePots = Math.ceil(miniCount / 15);
            layerPots = Math.ceil(miniCount / 30);
            shadePots = Math.ceil(miniCount / 50);
        }
        
        // Adjust for coverage
        if (coverage === 'thin') {
            basePots = Math.ceil(basePots * 1.5);
        } else if (coverage === 'thick') {
            basePots = Math.ceil(basePots * 0.75);
        }
        
        const cost = (basePots * 7.50) + (layerPots * 7.50) + (shadePots * 7.50);
        
        // Update results
        document.getElementById('base-paint').textContent = `${basePots} pots`;
        document.getElementById('layer-paint').textContent = `${layerPots} pots`;
        document.getElementById('shade-paint').textContent = `${shadePots} pots`;
        document.getElementById('paint-cost').textContent = `$${cost.toFixed(2)}`;
        
        this.showNotification('Paint calculation complete');
    }

    startTimer() {
        if (this.timerRunning) return;
        
        this.timerRunning = true;
        document.getElementById('start-timer').disabled = true;
        document.getElementById('pause-timer').disabled = false;
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
        
        this.showNotification('Timer started');
    }

    pauseTimer() {
        if (!this.timerRunning) return;
        
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        
        this.showNotification('Timer paused');
    }

    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.timerSeconds = 0;
        
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        this.updateTimerDisplay();
        
        this.showNotification('Timer reset');
    }

    updateTimerDisplay() {
        const hours = Math.floor(this.timerSeconds / 3600);
        const minutes = Math.floor((this.timerSeconds % 3600) / 60);
        const seconds = this.timerSeconds % 60;
        
        const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer-display').textContent = display;
    }

    openTutorial(tutorialId) {
        const tutorials = {
            'basecoating': {
                title: 'Basecoating Techniques',
                duration: '15 minutes',
                difficulty: 'Beginner',
                tools: 'Basic Brush, Palette',
                description: 'Learn how to apply smooth, even base coats to your miniatures. Proper basecoating is essential for good paint adhesion and color consistency.',
                materials: ['Primed miniature', 'Base paint', 'Paint brush (size 2-3)', 'Palette', 'Water cup'],
                steps: [
                    'Prepare your paint by shaking the pot thoroughly',
                    'Transfer a small amount to your palette',
                    'Thin the paint with a few drops of water',
                    'Load your brush with paint',
                    'Apply smooth, even strokes',
                    'Allow first coat to dry completely',
                    'Apply second coat if needed'
                ]
            },
            'layering': {
                title: 'Layering and Blending',
                duration: '25 minutes',
                difficulty: 'Intermediate',
                tools: 'Detail Brushes',
                description: 'Master the art of layering paint to create smooth transitions and build up color intensity.',
                materials: ['Basecoated miniature', '2-3 layer paints', 'Detail brushes', 'Wet palette', 'Water'],
                steps: [
                    'Start with your base coat',
                    'Mix a mid-tone between base and highlight',
                    'Apply to raised areas',
                    'Mix a lighter tone',
                    'Apply to highest points',
                    'Feather edges for smooth transitions',
                    'Repeat with progressively lighter tones'
                ]
            }
            // Add more tutorials as needed
        };
        
        const tutorial = tutorials[tutorialId] || tutorials.basecoating;
        
        document.getElementById('tutorial-title').textContent = tutorial.title;
        document.getElementById('tutorial-duration').textContent = tutorial.duration;
        document.getElementById('tutorial-difficulty').textContent = tutorial.difficulty;
        document.getElementById('tutorial-tools').textContent = tutorial.tools;
        document.getElementById('tutorial-description').textContent = tutorial.description;
        
        const materialsList = document.getElementById('tutorial-materials');
        materialsList.innerHTML = tutorial.materials.map(material => `<li>${material}</li>`).join('');
        
        const stepsContainer = document.getElementById('tutorial-steps');
        stepsContainer.innerHTML = tutorial.steps.map((step, index) => `
            <div class="tutorial-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step}</div>
            </div>
        `).join('');
        
        document.getElementById('tutorial-modal').style.display = 'flex';
    }

    filterTutorials(difficulty) {
        const tutorialCards = document.querySelectorAll('.tutorial-card');
        
        tutorialCards.forEach(card => {
            if (difficulty === 'all' || card.dataset.difficulty === difficulty) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupTutorialFilters() {
        // Already set up in HTML event listeners
    }

    loadReferenceGallery() {
        const gallery = document.getElementById('reference-gallery');
        
        // Sample reference images (in a real app, these would be actual images)
        const references = [
            { id: 'ref1', category: 'space_marines', title: 'Ultramarines Color Scheme' },
            { id: 'ref2', category: 'space_marines', title: 'Blood Angels Highlighting' },
            { id: 'ref3', category: 'imperial_guard', title: 'Cadian Camo Patterns' },
            { id: 'ref4', category: 'chaos', title: 'Death Guard Weathering' },
            { id: 'ref5', category: 'xenos', title: 'Necron Metal Effects' },
            { id: 'ref6', category: 'vehicles', title: 'Tank Weathering' },
            { id: 'ref7', category: 'bases', title: 'Urban Base Tutorial' },
            { id: 'ref8', category: 'bases', title: 'Jungle Base' }
        ];
        
        gallery.innerHTML = references.map(ref => `
            <div class="gallery-item" data-category="${ref.category}">
                <div class="gallery-image ${ref.category}">
                    <div class="image-overlay">
                        <h5>${ref.title}</h5>
                        <button class="view-reference">
                            <i class="fas fa-search-plus"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    showProgressTracker() {
        this.showNotification('Progress tracker opened in main section');
        // Scroll to progress tracker section
        document.querySelector('.progress-tracker').scrollIntoView({ behavior: 'smooth' });
    }

    downloadGuides() {
        this.showNotification('Downloading painting guides...', 'info');
        // In a real app, this would trigger actual file downloads
    }

    // Helper Methods
    formatPaintType(type) {
        const types = {
            'base': 'Base',
            'layer': 'Layer',
            'shade': 'Shade',
            'contrast': 'Contrast',
            'dry': 'Dry',
            'technical': 'Technical',
            'air': 'Air'
        };
        return types[type] || type;
    }

    formatBrand(brand) {
        const brands = {
            'citadel': 'Citadel',
            'vallejo': 'Vallejo',
            'army-painter': 'Army Painter',
            'scale75': 'Scale75'
        };
        return brands[brand] || brand;
    }

    formatColorGroup(group) {
        const groups = {
            'reds': 'Reds',
            'blues': 'Blues',
            'greens': 'Greens',
            'yellows': 'Yellows',
            'purples': 'Purples',
            'browns': 'Browns',
            'blacks': 'Blacks',
            'metals': 'Metals',
            'skins': 'Skin Tones',
            'neutrals': 'Neutrals'
        };
        return groups[group] || group;
    }

    formatFaction(faction) {
        const factions = {
            'ultramarines': 'Ultramarines',
            'blood_angels': 'Blood Angels',
            'dark_angels': 'Dark Angels',
            'imperial_fists': 'Imperial Fists',
            'space_wolves': 'Space Wolves',
            'cadian': 'Cadian Guard',
            'catachan': 'Catachan',
            'death_guard': 'Death Guard',
            'necron': 'Necrons',
            'ork_green': 'Orks',
            'tau': 'T\'au',
            'aeldari': 'Aeldari'
        };
        return factions[faction] || faction;
    }

    formatStatus(status) {
        const statuses = {
            'planning': 'Planning',
            'in_progress': 'In Progress',
            'paused': 'Paused',
            'completed': 'Completed'
        };
        return statuses[status] || status;
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(27, 94, 32, 0.9)' : type === 'error' ? 'rgba(183, 28, 28, 0.9)' : type === 'warning' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(13, 71, 161, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            border: 1px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#b71c1c' : type === 'warning' ? '#ff9800' : '#0d47a1'};
            font-family: 'Cinzel', serif;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
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

// Initialize the painting guide
document.addEventListener('DOMContentLoaded', () => {
    const paintingGuide = new PaintingGuide();
    window.paintingGuide = paintingGuide;
});// Warhammer 40k Painting Guide
class PaintingGuide {
    constructor() {
        this.selectedColors = [];
        this.currentBrand = 'citadel';
        this.paintBrands = {};
        this.projects = [];
        this.savedRecipes = [];
        this.sessionTimer = null;
        this.timerSeconds = 0;
        this.timerRunning = false;
        
        this.init();
    }

    init() {
        this.loadPaints();
        this.loadProjects();
        this.loadRecipes();
        this.setupEventListeners();
        this.renderPaints();
        this.renderProjects();
        this.renderSavedRecipes();
        this.loadReferenceGallery();
        this.setupTutorialFilters();
    }

    loadPaints() {
        // Citadel Paint Database
        this.paintBrands.citadel = [
            // Base Paints
            { id: 'abaddon-black', name: 'Abaddon Black', type: 'base', group: 'blacks', hex: '#231f20' },
            { id: 'mephiston-red', name: 'Mephiston Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 'macragge-blue', name: 'Macragge Blue', type: 'base', group: 'blues', hex: '#0f3d7c' },
            { id: 'waagh-flesh', name: 'Waagh! Flesh', type: 'base', group: 'greens', hex: '#0b3b36' },
            { id: 'zandri-dust', name: 'Zandri Dust', type: 'base', group: 'browns', hex: '#988e76' },
            { id: 'leadbelcher', name: 'Leadbelcher', type: 'base', group: 'metals', hex: '#8a8a8a' },
            { id: 'retributor-armour', name: 'Retributor Armour', type: 'base', group: 'metals', hex: '#c89d3c' },
            { id: 'bugmans-glow', name: 'Bugman\'s Glow', type: 'base', group: 'skins', hex: '#804d43' },
            { id: 'celestra-grey', name: 'Celestra Grey', type: 'base', group: 'neutrals', hex: '#8fa6a2' },
            { id: 'daemonette-hide', name: 'Daemonette Hide', type: 'base', group: 'purples', hex: '#696682' },
            
            // Layer Paints
            { id: 'evil-sunz-scarlet', name: 'Evil Sunz Scarlet', type: 'layer', group: 'reds', hex: '#c01411' },
            { id: 'wild-rider-red', name: 'Wild Rider Red', type: 'layer', group: 'reds', hex: '#e82d20' },
            { id: 'calgar-blue', name: 'Calgar Blue', type: 'layer', group: 'blues', hex: '#2a497f' },
            { id: 'fenrisian-grey', name: 'Fenrisian Grey', type: 'layer', group: 'blues', hex: '#6d93b3' },
            { id: 'warboss-green', name: 'Warboss Green', type: 'layer', group: 'greens', hex: '#317e57' },
            { id: 'skarsnik-green', name: 'Skarsnik Green', type: 'layer', group: 'greens', hex: '#578c6a' },
            { id: 'averland-sunset', name: 'Averland Sunset', type: 'layer', group: 'yellows', hex: '#fbb81c' },
            { id: 'yriel-yellow', name: 'Yriel Yellow', type: 'layer', group: 'yellows', hex: '#fcd20e' },
            { id: 'xereus-purple', name: 'Xereus Purple', type: 'layer', group: 'purples', hex: '#47125a' },
            { id: 'genestealer-purple', name: 'Genestealer Purple', type: 'layer', group: 'purples', hex: '#7658a5' },
            { id: 'ushabti-bone', name: 'Ushabti Bone', type: 'layer', group: 'browns', hex: '#aba173' },
            { id: 'screaming-skull', name: 'Screaming Skull', type: 'layer', group: 'browns', hex: '#d1c8a6' },
            { id: 'kislev-flesh', name: 'Kislev Flesh', type: 'layer', group: 'skins', hex: '#d1a570' },
            { id: 'cadian-fleshtone', name: 'Cadian Fleshtone', type: 'layer', group: 'skins', hex: '#c47652' },
            
            // Shade Paints
            { id: 'nuln-oil', name: 'Nuln Oil', type: 'shade', group: 'blacks', hex: '#14171c' },
            { id: 'agrax-earthshade', name: 'Agrax Earthshade', type: 'shade', group: 'browns', hex: '#4c3d31' },
            { id: 'reikland-fleshshade', name: 'Reikland Fleshshade', type: 'shade', group: 'browns', hex: '#bd6b41' },
            { id: 'drakenhof-nightshade', name: 'Drakenhof Nightshade', type: 'shade', group: 'blues', hex: '#122b4e' },
            { id: 'carroburg-crimson', name: 'Carroburg Crimson', type: 'shade', group: 'reds', hex: '#5a1a2a' },
            { id: 'biel-tan-green', name: 'Biel-tan Green', type: 'shade', group: 'greens', hex: '#1e5141' },
            { id: 'seraphim-sepia', name: 'Seraphim Sepia', type: 'shade', group: 'browns', hex: '#835718' },
            
            // Contrast Paints
            { id: 'black-templar', name: 'Black Templar', type: 'contrast', group: 'blacks', hex: '#1a1d23' },
            { id: 'blood-angels-red', name: 'Blood Angels Red', type: 'contrast', group: 'reds', hex: '#a7121e' },
            { id: 'ultramarines-blue', name: 'Ultramarines Blue', type: 'contrast', group: 'blues', hex: '#1c3d8c' },
            { id: 'dark-angels-green', name: 'Dark Angels Green', type: 'contrast', group: 'greens', hex: '#0d412d' },
            { id: 'imperial-fists-yellow', name: 'Imperial Fists Yellow', type: 'contrast', group: 'yellows', hex: '#f5c542' },
            { id: 'space-wolves-grey', name: 'Space Wolves Grey', type: 'contrast', group: 'blues', hex: '#647c94' },
            { id: 'magos-purple', name: 'Magos Purple', type: 'contrast', group: 'purples', hex: '#9067b5' },
            { id: 'skeleton-horde', name: 'Skeleton Horde', type: 'contrast', group: 'browns', hex: '#b79a6e' },
            { id: 'guilliman-flesh', name: 'Guilliman Flesh', type: 'contrast', group: 'skins', hex: '#bc7055' },
            
            // Technical Paints
            { id: 'ardcoat', name: 'Ardcoat', type: 'technical', group: 'neutrals', hex: '#ffffff' },
            { id: 'nihilakh-oxide', name: 'Nihilakh Oxide', type: 'technical', group: 'blues', hex: '#008872' },
            { id: 'typhus-corrosion', name: 'Typhus Corrosion', type: 'technical', group: 'browns', hex: '#423d37' },
            { id: 'blood-for-the-blood-god', name: 'Blood for the Blood God', type: 'technical', group: 'reds', hex: '#a60710' },
            { id: 'nurgles-rot', name: 'Nurgle\'s Rot', type: 'technical', group: 'greens', hex: '#475426' },
        ];

        // Vallejo paints (simplified)
        this.paintBrands.vallejo = [
            { id: 'v-black', name: 'Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 'v-white', name: 'White', type: 'base', group: 'neutrals', hex: '#ffffff' },
            { id: 'v-red', name: 'Red', type: 'base', group: 'reds', hex: '#c10000' },
            { id: 'v-blue', name: 'Blue', type: 'base', group: 'blues', hex: '#003399' },
            { id: 'v-gold', name: 'Gold', type: 'base', group: 'metals', hex: '#c9a347' },
            { id: 'v-silver', name: 'Silver', type: 'base', group: 'metals', hex: '#a0a0a0' },
        ];

        // Army Painter paints (simplified)
        this.paintBrands['army-painter'] = [
            { id: 'ap-matt-black', name: 'Matt Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 'ap-dragon-red', name: 'Dragon Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 'ap-crystal-blue', name: 'Crystal Blue', type: 'base', group: 'blues', hex: '#3a6b8c' },
            { id: 'ap-greedy-gold', name: 'Greedy Gold', type: 'base', group: 'metals', hex: '#c89d3c' },
        ];

        // Scale75 paints (simplified)
        this.paintBrands.scale75 = [
            { id: 's75-black', name: 'Black', type: 'base', group: 'blacks', hex: '#000000' },
            { id: 's75-red', name: 'Red', type: 'base', group: 'reds', hex: '#9a0c13' },
            { id: 's75-blue', name: 'Blue', type: 'base', group: 'blues', hex: '#1c3d8c' },
            { id: 's75-gold', name: 'Gold', type: 'base', group: 'metals', hex: '#c89d3c' },
        ];
    }

    setupEventListeners() {
        // Paint search
        document.getElementById('paint-search').addEventListener('input', (e) => {
            this.filterPaints(e.target.value);
        });
        
        // Color type filter
        document.getElementById('color-type').addEventListener('change', (e) => {
            this.filterPaints();
        });
        
        // Color group filter
        document.getElementById('color-group').addEventListener('change', (e) => {
            this.filterPaints();
        });
        
        // Clear palette
        document.getElementById('clear-palette').addEventListener('click', () => {
            this.clearPalette();
        });
        
        // Save palette
        document.getElementById('save-palette').addEventListener('click', () => {
            this.savePalette();
        });
        
        // Load palette
        document.getElementById('load-palette').addEventListener('click', () => {
            this.loadPalette();
        });
        
        // Generate recipe from palette
        document.getElementById('generate-recipe').addEventListener('click', () => {
            this.generateRecipeFromPalette();
        });
        
        // Export palette
        document.getElementById('export-palette').addEventListener('click', () => {
            this.exportPalette();
        });
        
        // Recipe generation
        document.getElementById('generate-faction-recipe').addEventListener('click', () => {
            this.generateFactionRecipe();
        });
        
        // Random recipe
        document.getElementById('random-recipe').addEventListener('click', () => {
            this.generateRandomRecipe();
        });
        
        // Save recipe
        document.getElementById('save-recipe').addEventListener('click', () => {
            this.saveCurrentRecipe();
        });
        
        // Share recipe
        document.getElementById('share-recipe').addEventListener('click', () => {
            this.shareRecipe();
        });
        
        // Add recipe step
        document.getElementById('add-step').addEventListener('click', () => {
            this.addRecipeStep();
        });
        
        // Clear recipe
        document.getElementById('clear-recipe').addEventListener('click', () => {
            this.clearRecipe();
        });
        
        // Project form submission
        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });
        
        // Paint calculator
        document.getElementById('calculate-paint').addEventListener('click', () => {
            this.calculatePaintNeeded();
        });
        
        // Timer controls
        document.getElementById('start-timer').addEventListener('click', () => {
            this.startTimer();
        });
        
        document.getElementById('pause-timer').addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('reset-timer').addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Download guides
        document.getElementById('download-guides').addEventListener('click', () => {
            this.downloadGuides();
        });
        
        // Open progress tracker
        document.getElementById('open-progress').addEventListener('click', () => {
            this.showProgressTracker();
        });
    }

    renderPaints() {
        const colorGrid = document.getElementById('color-grid');
        const paints = this.paintBrands[this.currentBrand] || [];
        
        if (paints.length === 0) {
            colorGrid.innerHTML = `
                <div class="empty-paints">
                    <i class="fas fa-paint-brush"></i>
                    <p>No paints found for this brand</p>
                </div>
            `;
            return;
        }
        
        colorGrid.innerHTML = paints.map(paint => `
            <div class="color-swatch" data-id="${paint.id}" data-type="${paint.type}" data-group="${paint.group}">
                <div class="swatch-color" style="background-color: ${paint.hex};"></div>
                <div class="swatch-info">
                    <span class="swatch-name">${paint.name}</span>
                    <span class="swatch-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                </div>
                <button class="add-to-palette" data-id="${paint.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
        
        // Add click event to swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-palette')) {
                    const paintId = swatch.dataset.id;
                    this.showPaintInfo(paintId);
                }
            });
        });
        
        // Add click event to add buttons
        document.querySelectorAll('.add-to-palette').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paintId = btn.dataset.id;
                this.addToPalette(paintId);
            });
        });
    }

    filterPaints(searchTerm = '') {
        const typeFilter = document.getElementById('color-type').value;
        const groupFilter = document.getElementById('color-group').value;
        const paints = this.paintBrands[this.currentBrand] || [];
        
        const filtered = paints.filter(paint => {
            // Search term filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                if (!paint.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            
            // Type filter
            if (typeFilter !== 'all' && paint.type !== typeFilter) {
                return false;
            }
            
            // Group filter
            if (groupFilter !== 'all' && paint.group !== groupFilter) {
                return false;
            }
            
            return true;
        });
        
        this.renderFilteredPaints(filtered);
    }

    renderFilteredPaints(paints) {
        const colorGrid = document.getElementById('color-grid');
        
        if (paints.length === 0) {
            colorGrid.innerHTML = `
                <div class="empty-paints">
                    <i class="fas fa-search"></i>
                    <p>No paints match your search</p>
                </div>
            `;
            return;
        }
        
        colorGrid.innerHTML = paints.map(paint => `
            <div class="color-swatch" data-id="${paint.id}" data-type="${paint.type}" data-group="${paint.group}">
                <div class="swatch-color" style="background-color: ${paint.hex};"></div>
                <div class="swatch-info">
                    <span class="swatch-name">${paint.name}</span>
                    <span class="swatch-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                </div>
                <button class="add-to-palette" data-id="${paint.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
        
        // Re-attach event listeners
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-palette')) {
                    const paintId = swatch.dataset.id;
                    this.showPaintInfo(paintId);
                }
            });
        });
        
        document.querySelectorAll('.add-to-palette').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const paintId = btn.dataset.id;
                this.addToPalette(paintId);
            });
        });
    }

    addToPalette(paintId) {
        const paints = this.paintBrands[this.currentBrand] || [];
        const paint = paints.find(p => p.id === paintId);
        
        if (!paint) return;
        
        // Check if already in palette
        if (this.selectedColors.some(color => color.id === paintId)) {
            this.showNotification(`${paint.name} is already in your palette`, 'info');
            return;
        }
        
        // Add to palette
        this.selectedColors.push({
            ...paint,
            brand: this.currentBrand
        });
        
        this.updatePalette();
        this.showNotification(`Added ${paint.name} to palette`);
    }

    updatePalette() {
        const palette = document.getElementById('palette');
        const paletteCount = document.getElementById('palette-count');
        const generateBtn = document.getElementById('generate-recipe');
        const exportBtn = document.getElementById('export-palette');
        
        paletteCount.textContent = `${this.selectedColors.length} color${this.selectedColors.length !== 1 ? 's' : ''}`;
        
        // Enable/disable buttons
        generateBtn.disabled = this.selectedColors.length === 0;
        exportBtn.disabled = this.selectedColors.length === 0;
        
        if (this.selectedColors.length === 0) {
            palette.innerHTML = `
                <div class="empty-palette">
                    <i class="fas fa-palette"></i>
                    <p>No colors selected</p>
                    <p>Click paint swatches to add them to your palette</p>
                </div>
            `;
            return;
        }
        
        palette.innerHTML = this.selectedColors.map((color, index) => `
            <div class="palette-color" data-index="${index}">
                <div class="palette-swatch" style="background-color: ${color.hex};"></div>
                <div class="palette-info">
                    <span class="palette-name">${color.name}</span>
                    <span class="palette-brand">${this.formatBrand(color.brand)}</span>
                </div>
                <button class="remove-color" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add remove event listeners
        document.querySelectorAll('.remove-color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeFromPalette(index);
            });
        });
    }

    removeFromPalette(index) {
        if (index >= 0 && index < this.selectedColors.length) {
            const removedColor = this.selectedColors[index];
            this.selectedColors.splice(index, 1);
            this.updatePalette();
            this.showNotification(`Removed ${removedColor.name} from palette`);
        }
    }

    clearPalette() {
        if (this.selectedColors.length === 0) return;
        
        if (confirm('Clear all colors from your palette?')) {
            this.selectedColors = [];
            this.updatePalette();
            this.showNotification('Palette cleared');
        }
    }

    savePalette() {
        if (this.selectedColors.length === 0) {
            this.showNotification('Palette is empty', 'warning');
            return;
        }
        
        const paletteName = prompt('Enter a name for your palette:', 'My Palette');
        if (!paletteName) return;
        
        const palette = {
            name: paletteName,
            colors: this.selectedColors,
            created: new Date().toISOString(),
            brand: this.currentBrand
        };
        
        // Save to localStorage
        const savedPalettes = JSON.parse(localStorage.getItem('warhammerPalettes') || '[]');
        savedPalettes.push(palette);
        localStorage.setItem('warhammerPalettes', JSON.stringify(savedPalettes));
        
        this.showNotification(`Palette "${paletteName}" saved`);
    }

    loadPalette() {
        const savedPalettes = JSON.parse(localStorage.getItem('warhammerPalettes') || '[]');
        
        if (savedPalettes.length === 0) {
            this.showNotification('No saved palettes found', 'info');
            return;
        }
        
        // Create selection dialog
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 1rem;
        `;
        
        modal.innerHTML = `
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Load Palette</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="palettes-list">
                        ${savedPalettes.map((palette, index) => `
                            <div class="palette-item" data-index="${index}">
                                <h4>${palette.name}</h4>
                                <div class="palette-preview">
                                    ${palette.colors.slice(0, 5).map(color => `
                                        <div class="preview-swatch" style="background-color: ${color.hex};"></div>
                                    `).join('')}
                                    ${palette.colors.length > 5 ? `<span class="more-count">+${palette.colors.length - 5}</span>` : ''}
                                </div>
                                <div class="palette-meta">
                                    <span>${palette.colors.length} colors</span>
                                    <span>${new Date(palette.created).toLocaleDateString()}</span>
                                </div>
                                <button class="load-palette-btn" data-index="${index}">Load</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelectorAll('.load-palette-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                const palette = savedPalettes[index];
                
                // Load palette
                this.selectedColors = palette.colors;
                this.currentBrand = palette.brand;
                
                // Update brand button
                document.querySelectorAll('.brand-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.brand === palette.brand);
                });
                
                this.updatePalette();
                this.renderPaints();
                document.body.removeChild(modal);
                
                this.showNotification(`Loaded palette "${palette.name}"`);
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    exportPalette() {
        if (this.selectedColors.length === 0) return;
        
        const exportData = {
            palette: this.selectedColors,
            exported: new Date().toISOString(),
            brand: this.currentBrand
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `warhammer-palette-${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
        
        this.showNotification('Palette exported');
    }

    showPaintInfo(paintId) {
        const paints = this.paintBrands[this.currentBrand] || [];
        const paint = paints.find(p => p.id === paintId);
        
        if (!paint) return;
        
        const colorInfo = document.getElementById('color-info');
        colorInfo.innerHTML = `
            <div class="color-detail">
                <div class="color-header">
                    <div class="color-swatch-large" style="background-color: ${paint.hex};"></div>
                    <div class="color-title">
                        <h4>${paint.name}</h4>
                        <span class="color-type ${paint.type}">${this.formatPaintType(paint.type)}</span>
                        <span class="color-brand">${this.formatBrand(this.currentBrand)}</span>
                    </div>
                </div>
                
                <div class="color-properties">
                    <div class="property">
                        <span>Hex Color:</span>
                        <strong>${paint.hex.toUpperCase()}</strong>
                    </div>
                    <div class="property">
                        <span>Color Group:</span>
                        <strong>${this.formatColorGroup(paint.group)}</strong>
                    </div>
                </div>
                
                <div class="color-uses">
                    <h5>Common Uses:</h5>
                    <ul>
                        ${this.getPaintUses(paint).map(use => `<li>${use}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="color-alternatives">
                    <h5>Alternative Paints:</h5>
                    <div class="alternatives-list">
                        ${this.getAlternativePaints(paint).map(alt => `
                            <div class="alternative">
                                <div class="alt-swatch" style="background-color: ${alt.hex};"></div>
                                <span class="alt-name">${alt.name}</span>
                                <span class="alt-brand">${this.formatBrand(alt.brand)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        colorInfo.style.display = 'block';
    }

    getPaintUses(paint) {
        const uses = {
            'abaddon-black': ['Armor black', 'Weapons', 'Vehicle trim'],
            'mephiston-red': ['Blood Angels armor', 'Red details', 'Weapon casings'],
            'macragge-blue': ['Ultramarines armor', 'Blue armor plates', 'Vehicle panels'],
            'leadbelcher': ['Metallic surfaces', 'Weapons', 'Armor trim'],
            'retributor-armour': ['Gold details', 'Relics', 'Officer trim'],
            'nuln-oil': ['All-over wash', 'Recess shading', 'Weathering'],
            'agrax-earthshade': ['Brown shading', 'Dirt effects', 'Weathering'],
        };
        
        return uses[paint.id] || ['Base coating', 'Layer highlights', 'Details'];
    }

    getAlternativePaints(paint) {
        // Simple alternative finder by color group
        const alternatives = [];
        const currentHex = paint.hex.toLowerCase();
        
        Object.entries(this.paintBrands).forEach(([brand, paints]) => {
            if (brand === this.currentBrand) return;
            
            const similar = paints.find(p => 
                p.group === paint.group && 
                p.type === paint.type &&
                p.hex.toLowerCase() !== currentHex
            );
            
            if (similar) {
                alternatives.push({
                    ...similar,
                    brand: brand
                });
            }
        });
        
        return alternatives.slice(0, 3);
    }

    generateRecipeFromPalette() {
        if (this.selectedColors.length === 0) return;
        
        const recipeResult = document.getElementById('recipe-result');
        
        const recipe = {
            name: 'Custom Palette Recipe',
            steps: [
                '1. Prepare your miniature with proper assembly and priming',
                '2. Apply base coats using your selected colors',
                '3. Add shading with appropriate washes',
                '4. Build up layers for highlights',
                '5. Add final details and edge highlights'
            ],
            colors: this.selectedColors,
            estimatedTime: '2-4 hours',
            difficulty: 'Intermediate'
        };
        
        recipeResult.innerHTML = this.renderRecipe(recipe);
    }

    generateFactionRecipe() {
        const faction = document.getElementById('recipe-faction').value;
        const quality = document.getElementById('recipe-quality').value;
        const speed = document.getElementById('recipe-speed').value;
        
        if (!faction) {
            this.showNotification('Please select a faction', 'warning');
            return;
        }
        
        const recipes = {
            'ultramarines': {
                name: 'Ultramarines Army Scheme',
                steps: [
                    '1. Prime with Macragge Blue spray',
                    '2. Base coat all armor with Macragge Blue',
                    '3. Wash recesses with Drakenhof Nightshade',
                    '4. Layer up with Calgar Blue',
                    '5. Edge highlight with Fenrisian Grey',
                    '6. Paint gold details with Retributor Armour',
                    '7. Wash gold with Reikland Fleshshade',
                    '8. Highlight gold with Liberator Gold',
                    '9. Paint weapons with Abaddon Black',
                    '10. Highlight weapons with Eshin Grey'
                ],
                colors: [
                    { name: 'Macragge Blue', type: 'base', hex: '#0f3d7c' },
                    { name: 'Calgar Blue', type: 'layer', hex: '#2a497f' },
                    { name: 'Fenrisian Grey', type: 'layer', hex: '#6d93b3' },
                    { name: 'Drakenhof Nightshade', type: 'shade', hex: '#122b4e' },
                    { name: 'Retributor Armour', type: 'base', hex: '#c89d3c' },
                    { name: 'Reikland Fleshshade', type: 'shade', hex: '#bd6b41' },
                    { name: 'Abaddon Black', type: 'base', hex: '#231f20' }
                ],
                estimatedTime: '3-5 hours per squad',
                difficulty: 'Intermediate'
            },
            'blood_angels': {
                name: 'Blood Angels Army Scheme',
                steps: [
                    '1. Prime with Mephiston Red spray',
                    '2. Base coat all armor with Mephiston Red',
                    '3. Wash recesses with Carroburg Crimson',
                    '4. Layer up with Evil Sunz Scarlet',
                    '5. Edge highlight with Wild Rider Red',
                    '6. Paint black details with Abaddon Black',
                    '7. Highlight black with Eshin Grey',
                    '8. Paint gold details with Retributor Armour'
                ],
                colors: [
                    { name: 'Mephiston Red', type: 'base', hex: '#9a0c13' },
                    { name: 'Evil Sunz Scarlet', type: 'layer', hex: '#c01411' },
                    { name: 'Wild Rider Red', type: 'layer', hex: '#e82d20' },
                    { name: 'Carroburg Crimson', type: 'shade', hex: '#5a1a2a' },
                    { name: 'Abaddon Black', type: 'base', hex: '#231f20' },
                    { name: 'Retributor Armour', type: 'base', hex: '#c89d3c' }
                ],
                estimatedTime: '3-4 hours per squad',
                difficulty: 'Intermediate'
            },
            'cadian': {
                name: 'Cadian Imperial Guard',
                steps: [
                    '1. Prime with Zandri Dust spray',
                    '2. Base coat fatigues with Zandri Dust',
                    '3. Base coat armor with Castellan Green',
                    '4. Wash entire model with Agrax Earthshade',
                    '5. Layer fatigues with Ushabti Bone',
                    '6. Layer armor with Loren Forest',
                    '7. Paint weapons with Leadbelcher',
                    '8. Wash metals with Nuln Oil',
                    '9. Paint skin with Cadian Fleshtone',
                    '10. Wash skin with Reikland Fleshshade'
                ],
                colors: [
                    { name: 'Zandri Dust', type: 'base', hex: '#988e76' },
                    { name: 'Castellan Green', type: 'base', hex: '#264715' },
                    { name: 'Ushabti Bone', type: 'layer', hex: '#aba173' },
                    { name: 'Loren Forest', type: 'layer', hex: '#507021' },
                    { name: 'Agrax Earthshade', type: 'shade', hex: '#4c3d31' },
                    { name: 'Leadbelcher', type: 'base', hex: '#8a8a8a' },
                    { name: 'Cadian Fleshtone', type: 'layer', hex: '#c47652' }
                ],
                estimatedTime: '2-3 hours per squad',
                difficulty: 'Beginner'
            }
        };
        
        const recipe = recipes[faction] || {
            name: 'Custom Faction Recipe',
            steps: ['Recipe generation for this faction is coming soon!'],
            colors: [],
            estimatedTime: 'Unknown',
            difficulty: 'Unknown'
        };
        
        // Adjust recipe based on quality and speed
        if (quality === 'tabletop') {
            recipe.steps = recipe.steps.slice(0, 4); // Fewer steps for tabletop
            recipe.estimatedTime = '1-2 hours per squad';
            recipe.difficulty = 'Beginner';
        } else if (quality === 'display') {
            recipe.steps.push('11. Add volumetric highlights');
            recipe.steps.push('12. Apply weathering effects');
            recipe.steps.push('13. Add object source lighting');
            recipe.estimatedTime = '6-8 hours per model';
            recipe.difficulty = 'Advanced';
        }
        
        if (speed === 'fast') {
            recipe.steps = recipe.steps.filter(step => 
                !step.includes('highlight') && !step.includes('layer')
            );
            recipe.estimatedTime = '30-60 minutes per squad';
        }
        
        const recipeResult = document.getElementById('recipe-result');
        recipeResult.innerHTML = this.renderRecipe(recipe);
        
        // Store current recipe for saving
        this.currentRecipe = recipe;
    }

    renderRecipe(recipe) {
        return `
            <div class="recipe-display">
                <div class="recipe-header">
                    <h4>${recipe.name}</h4>
                    <div class="recipe-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i> ${recipe.estimatedTime}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i> ${recipe.difficulty}
                        </span>
                    </div>
                </div>
                
                <div class="recipe-steps">
                    <h5>Painting Steps:</h5>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                ${recipe.colors.length > 0 ? `
                    <div class="recipe-colors">
                        <h5>Required Paints:</h5>
                        <div class="colors-list">
                            ${recipe.colors.map(color => `
                                <div class="recipe-color">
                                    <div class="recipe-swatch" style="background-color: ${color.hex};"></div>
                                    <span class="color-name">${color.name}</span>
                                    <span class="color-type ${color.type}">${this.formatPaintType(color.type)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="recipe-tips">
                    <h5>Tips:</h5>
                    <ul>
                        <li>Thin your paints with water or medium</li>
                        <li>Allow each layer to dry completely before applying the next</li>
                        <li>Use multiple thin coats rather than one thick coat</li>
                        <li>Keep your brush clean and pointed</li>
                    </ul>
                </div>
            </div>
        `;
    }

    generateRandomRecipe() {
        const factions = [
            'ultramarines', 'blood_angels', 'dark_angels', 'imperial_fists',
            'space_wolves', 'cadian', 'necron', 'ork_green', 'tau'
        ];
        
        const randomFaction = factions[Math.floor(Math.random() * factions.length)];
        document.getElementById('recipe-faction').value = randomFaction;
        this.generateFactionRecipe();
        
        this.showNotification(`Generated random recipe for ${this.formatFaction(randomFaction)}`);
    }

    saveCurrentRecipe() {
        if (!this.currentRecipe) {
            this.showNotification('No recipe to save', 'warning');
            return;
        }
        
        const recipeName = prompt('Enter a name for this recipe:', this.currentRecipe.name);
        if (!recipeName) return;
        
        const recipeToSave = {
            ...this.currentRecipe,
            name: recipeName,
            saved: new Date().toISOString(),
            faction: document.getElementById('recipe-faction').value
        };
        
        this.savedRecipes.push(recipeToSave);
        localStorage.setItem('warhammerRecipes', JSON.stringify(this.savedRecipes));
        this.renderSavedRecipes();
        
        this.showNotification(`Recipe "${recipeName}" saved`);
    }

    renderSavedRecipes() {
        const list = document.getElementById('saved-recipes-list');
        
        if (this.savedRecipes.length === 0) {
            list.innerHTML = `
                <div class="empty-saved">
                    <p>No saved recipes yet</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.savedRecipes.map((recipe, index) => `
            <div class="saved-recipe">
                <div class="saved-recipe-header">
                    <h5>${recipe.name}</h5>
                    <span class="saved-date">${new Date(recipe.saved).toLocaleDateString()}</span>
                </div>
                <div class="saved-recipe-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${recipe.estimatedTime}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-signal"></i> ${recipe.difficulty}
                    </span>
                    ${recipe.faction ? `<span class="meta-item">
                        <i class="fas fa-flag"></i> ${this.formatFaction(recipe.faction)}
                    </span>` : ''}
                </div>
                <div class="saved-recipe-actions">
                    <button class="load-recipe" data-index="${index}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="delete-recipe" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.load-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.loadSavedRecipe(index);
            });
        });
        
        document.querySelectorAll('.delete-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.deleteSavedRecipe(index);
            });
        });
    }

    loadSavedRecipe(index) {
        if (index >= 0 && index < this.savedRecipes.length) {
            const recipe = this.savedRecipes[index];
            this.currentRecipe = recipe;
            
            const recipeResult = document.getElementById('recipe-result');
            recipeResult.innerHTML = this.renderRecipe(recipe);
            
            // Scroll to recipe
            recipeResult.scrollIntoView({ behavior: 'smooth' });
            
            this.showNotification(`Loaded recipe "${recipe.name}"`);
        }
    }

    deleteSavedRecipe(index) {
        if (index >= 0 && index < this.savedRecipes.length) {
            const recipeName = this.savedRecipes[index].name;
            
            if (confirm(`Delete recipe "${recipeName}"?`)) {
                this.savedRecipes.splice(index, 1);
                localStorage.setItem('warhammerRecipes', JSON.stringify(this.savedRecipes));
                this.renderSavedRecipes();
                
                this.showNotification(`Deleted recipe "${recipeName}"`);
            }
        }
    }

    shareRecipe() {
        if (!this.currentRecipe) {
            this.showNotification('No recipe to share', 'warning');
            return;
        }
        
        const shareText = `Warhammer 40k Painting Recipe: ${this.currentRecipe.name}\n\n` +
                         `Steps:\n${this.currentRecipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n` +
                         `Generated with Artisan's Painting Guide`;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentRecipe.name,
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Recipe copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy recipe', 'error');
        });
    }

    addRecipeStep() {
        const stepText = prompt('Enter a new painting step:');
        if (!stepText) return;
        
        const recipeResult = document.getElementById('recipe-result');
        const currentRecipe = recipeResult.querySelector('.recipe-display');
        
        if (!currentRecipe) {
            this.showNotification('Please generate a recipe first', 'warning');
            return;
        }
        
        const stepsList = currentRecipe.querySelector('ol');
        if (stepsList) {
            const newStep = document.createElement('li');
            newStep.textContent = stepText;
            stepsList.appendChild(newStep);
            
            this.showNotification('Step added to recipe');
        }
    }

    clearRecipe() {
        if (confirm('Clear the current recipe?')) {
            const recipeResult = document.getElementById('recipe-result');
            recipeResult.innerHTML = `
                <div class="empty-recipe">
                    <i class="fas fa-flask"></i>
                    <h4>No Recipe Generated</h4>
                    <p>Select a faction or build a custom recipe to get started</p>
                </div>
            `;
            
            this.currentRecipe = null;
            this.showNotification('Recipe cleared');
        }
    }

    loadProjects() {
        this.projects = JSON.parse(localStorage.getItem('warhammerProjects') || '[]');
    }

    saveProjects() {
        localStorage.setItem('warhammerProjects', JSON.stringify(this.projects));
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        
        if (this.projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-projects">
                    <i class="fas fa-paint-brush"></i>
                    <h4>No Painting Projects</h4>
                    <p>Start by adding your first painting project</p>
                    <button class="imperial-btn-small" id="add-first-project">Add First Project</button>
                </div>
            `;
            
            document.getElementById('add-first-project').addEventListener('click', () => {
                document.getElementById('project-modal').style.display = 'flex';
            });
            
            return;
        }
        
        projectsGrid.innerHTML = this.projects.map((project, index) => `
            <div class="project-card" data-index="${index}">
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <span class="project-status ${project.status}">${this.formatStatus(project.status)}</span>
                </div>
                
                ${project.faction ? `
                    <div class="project-faction">
                        <i class="fas fa-flag"></i> ${this.formatFaction(project.faction)}
                    </div>
                ` : ''}
                
                <div class="project-stats">
                    <div class="project-stat">
                        <span>Miniatures:</span>
                        <strong>${project.minis || 1}</strong>
                    </div>
                    ${project.points ? `
                        <div class="project-stat">
                            <span>Points:</span>
                            <strong>${project.points}</strong>
                        </div>
                    ` : ''}
                    ${project.deadline ? `
                        <div class="project-stat">
                            <span>Deadline:</span>
                            <strong>${new Date(project.deadline).toLocaleDateString()}</strong>
                        </div>
                    ` : ''}
                </div>
                
                ${project.notes ? `
                    <div class="project-notes">
                        <p>${project.notes.substring(0, 100)}${project.notes.length > 100 ? '...' : ''}</p>
                    </div>
                ` : ''}
                
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${project.progress || 0}% Complete</span>
                </div>
                
                <div class="project-actions">
                    <button class="project-action-btn update-progress" data-index="${index}">
                        <i class="fas fa-chart-line"></i> Update
                    </button>
                    <button class="project-action-btn edit-project" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="project-action-btn delete-project" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.update-progress').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.updateProjectProgress(index);
            });
        });
        
        document.querySelectorAll('.edit-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.editProject(index);
            });
        });
        
        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.deleteProject(index);
            });
        });
    }

    saveProject() {
        const project = {
            id: 'project-' + Date.now(),
            name: document.getElementById('project-name').value,
            faction: document.getElementById('project-faction').value,
            status: document.getElementById('project-status').value,
            minis: parseInt(document.getElementById('project-minis').value) || 1,
            points: document.getElementById('project-points').value ? parseInt(document.getElementById('project-points').value) : null,
            deadline: document.getElementById('project-deadline').value || null,
            notes: document.getElementById('project-notes').value || '',
            progress: 0,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        this.projects.push(project);
        this.saveProjects();
        this.renderProjects();
        
        document.getElementById('project-modal').style.display = 'none';
        document.getElementById('project-form').reset();
        
        this.showNotification(`Project "${project.name}" saved`);
    }

    updateProjectProgress(index) {
        if (index >= 0 && index < this.projects.length) {
            const project = this.projects[index];
            const newProgress = parseInt(prompt(`Enter progress percentage for "${project.name}":`, project.progress || 0));
            
            if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                this.projects[index].progress = newProgress;
                this.projects[index].updated = new Date().toISOString();
                
                if (newProgress === 100) {
                    this.projects[index].status = 'completed';
                } else if (newProgress > 0) {
                    this.projects[index].status = 'in_progress';
                }
                
                this.saveProjects();
                this.renderProjects();
                
                this.showNotification(`Updated progress for "${project.name}" to ${newProgress}%`);
            }
        }
    }

    editProject(index) {
        if (index >= 0 && index < this.projects.length) {
            const project = this.projects[index];
            
            // Populate form
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-faction').value = project.faction || '';
            document.getElementById('project-status').value = project.status;
            document.getElementById('project-minis').value = project.minis || 1;
            document.getElementById('project-points').value = project.points || '';
            document.getElementById('project-deadline').value = project.deadline || '';
            document.getElementById('project-notes').value = project.notes || '';
            
            // Store current index for update
            this.editingProjectIndex = index;
            
            // Change form submit handler
            const form = document.getElementById('project-form');
            const oldSubmit = form.onsubmit;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updateProject(index);
                form.onsubmit = oldSubmit;
            };
            
            document.getElementById('project-modal').style.display = 'flex';
        }
    }

    updateProject(index) {
        if (index >= 0 && index < this.projects.length) {
            this.projects[index] = {
                ...this.projects[index],
                name: document.getElementById('project-name').value,
                faction: document.getElementById('project-faction').value,
                status: document.getElementById('project-status').value,
                minis: parseInt(document.getElementById('project-minis').value) || 1,
                points: document.getElementById('project-points').value ? parseInt(document.getElementById('project-points').value) : null,
                deadline: document.getElementById('project-deadline').value || null,
                notes: document.getElementById('project-notes').value || '',
                updated: new Date().toISOString()
            };
            
            this.saveProjects();
            this.renderProjects();
            
            document.getElementById('project-modal').style.display = 'none';
            document.getElementById('project-form').reset();
            
            this.showNotification(`Project "${this.projects[index].name}" updated`);
        }
    }

    deleteProject(index) {
        if (index >= 0 && index < this.projects.length) {
            const projectName = this.projects[index].name;
            
            if (confirm(`Delete project "${projectName}"?`)) {
                this.projects.splice(index, 1);
                this.saveProjects();
                this.renderProjects();
                
                this.showNotification(`Deleted project "${projectName}"`);
            }
        }
    }

    loadRecipes() {
        this.savedRecipes = JSON.parse(localStorage.getItem('warhammerRecipes') || '[]');
    }

    loadPaintBrand(brand) {
        this.currentBrand = brand;
        this.renderPaints();
        this.showNotification(`Loaded ${this.formatBrand(brand)} paints`);
    }

    calculatePaintNeeded() {
        const armySize = parseInt(document.getElementById('army-size').value) || 2000;
        const miniCount = parseInt(document.getElementById('miniature-count').value) || 50;
        const paintType = document.getElementById('paint-type').value;
        const coverage = document.getElementById('coverage').value;
        
        // Simple calculation
        let basePots, layerPots, shadePots;
        
        if (paintType === 'contrast') {
            basePots = Math.ceil(miniCount / 20); // Contrast goes further
            layerPots = Math.ceil(miniCount / 40);
            shadePots = Math.ceil(miniCount / 60);
        } else {
            basePots = Math.ceil(miniCount / 15);
            layerPots = Math.ceil(miniCount / 30);
            shadePots = Math.ceil(miniCount / 50);
        }
        
        // Adjust for coverage
        if (coverage === 'thin') {
            basePots = Math.ceil(basePots * 1.5);
        } else if (coverage === 'thick') {
            basePots = Math.ceil(basePots * 0.75);
        }
        
        const cost = (basePots * 7.50) + (layerPots * 7.50) + (shadePots * 7.50);
        
        // Update results
        document.getElementById('base-paint').textContent = `${basePots} pots`;
        document.getElementById('layer-paint').textContent = `${layerPots} pots`;
        document.getElementById('shade-paint').textContent = `${shadePots} pots`;
        document.getElementById('paint-cost').textContent = `$${cost.toFixed(2)}`;
        
        this.showNotification('Paint calculation complete');
    }

    startTimer() {
        if (this.timerRunning) return;
        
        this.timerRunning = true;
        document.getElementById('start-timer').disabled = true;
        document.getElementById('pause-timer').disabled = false;
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
        
        this.showNotification('Timer started');
    }

    pauseTimer() {
        if (!this.timerRunning) return;
        
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        
        this.showNotification('Timer paused');
    }

    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.timerSeconds = 0;
        
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        this.updateTimerDisplay();
        
        this.showNotification('Timer reset');
    }

    updateTimerDisplay() {
        const hours = Math.floor(this.timerSeconds / 3600);
        const minutes = Math.floor((this.timerSeconds % 3600) / 60);
        const seconds = this.timerSeconds % 60;
        
        const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer-display').textContent = display;
    }

    openTutorial(tutorialId) {
        const tutorials = {
            'basecoating': {
                title: 'Basecoating Techniques',
                duration: '15 minutes',
                difficulty: 'Beginner',
                tools: 'Basic Brush, Palette',
                description: 'Learn how to apply smooth, even base coats to your miniatures. Proper basecoating is essential for good paint adhesion and color consistency.',
                materials: ['Primed miniature', 'Base paint', 'Paint brush (size 2-3)', 'Palette', 'Water cup'],
                steps: [
                    'Prepare your paint by shaking the pot thoroughly',
                    'Transfer a small amount to your palette',
                    'Thin the paint with a few drops of water',
                    'Load your brush with paint',
                    'Apply smooth, even strokes',
                    'Allow first coat to dry completely',
                    'Apply second coat if needed'
                ]
            },
            'layering': {
                title: 'Layering and Blending',
                duration: '25 minutes',
                difficulty: 'Intermediate',
                tools: 'Detail Brushes',
                description: 'Master the art of layering paint to create smooth transitions and build up color intensity.',
                materials: ['Basecoated miniature', '2-3 layer paints', 'Detail brushes', 'Wet palette', 'Water'],
                steps: [
                    'Start with your base coat',
                    'Mix a mid-tone between base and highlight',
                    'Apply to raised areas',
                    'Mix a lighter tone',
                    'Apply to highest points',
                    'Feather edges for smooth transitions',
                    'Repeat with progressively lighter tones'
                ]
            }
            // Add more tutorials as needed
        };
        
        const tutorial = tutorials[tutorialId] || tutorials.basecoating;
        
        document.getElementById('tutorial-title').textContent = tutorial.title;
        document.getElementById('tutorial-duration').textContent = tutorial.duration;
        document.getElementById('tutorial-difficulty').textContent = tutorial.difficulty;
        document.getElementById('tutorial-tools').textContent = tutorial.tools;
        document.getElementById('tutorial-description').textContent = tutorial.description;
        
        const materialsList = document.getElementById('tutorial-materials');
        materialsList.innerHTML = tutorial.materials.map(material => `<li>${material}</li>`).join('');
        
        const stepsContainer = document.getElementById('tutorial-steps');
        stepsContainer.innerHTML = tutorial.steps.map((step, index) => `
            <div class="tutorial-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step}</div>
            </div>
        `).join('');
        
        document.getElementById('tutorial-modal').style.display = 'flex';
    }

    filterTutorials(difficulty) {
        const tutorialCards = document.querySelectorAll('.tutorial-card');
        
        tutorialCards.forEach(card => {
            if (difficulty === 'all' || card.dataset.difficulty === difficulty) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupTutorialFilters() {
        // Already set up in HTML event listeners
    }

    loadReferenceGallery() {
        const gallery = document.getElementById('reference-gallery');
        
        // Sample reference images (in a real app, these would be actual images)
        const references = [
            { id: 'ref1', category: 'space_marines', title: 'Ultramarines Color Scheme' },
            { id: 'ref2', category: 'space_marines', title: 'Blood Angels Highlighting' },
            { id: 'ref3', category: 'imperial_guard', title: 'Cadian Camo Patterns' },
            { id: 'ref4', category: 'chaos', title: 'Death Guard Weathering' },
            { id: 'ref5', category: 'xenos', title: 'Necron Metal Effects' },
            { id: 'ref6', category: 'vehicles', title: 'Tank Weathering' },
            { id: 'ref7', category: 'bases', title: 'Urban Base Tutorial' },
            { id: 'ref8', category: 'bases', title: 'Jungle Base' }
        ];
        
        gallery.innerHTML = references.map(ref => `
            <div class="gallery-item" data-category="${ref.category}">
                <div class="gallery-image ${ref.category}">
                    <div class="image-overlay">
                        <h5>${ref.title}</h5>
                        <button class="view-reference">
                            <i class="fas fa-search-plus"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterGallery(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    showProgressTracker() {
        this.showNotification('Progress tracker opened in main section');
        // Scroll to progress tracker section
        document.querySelector('.progress-tracker').scrollIntoView({ behavior: 'smooth' });
    }

    downloadGuides() {
        this.showNotification('Downloading painting guides...', 'info');
        // In a real app, this would trigger actual file downloads
    }

    // Helper Methods
    formatPaintType(type) {
        const types = {
            'base': 'Base',
            'layer': 'Layer',
            'shade': 'Shade',
            'contrast': 'Contrast',
            'dry': 'Dry',
            'technical': 'Technical',
            'air': 'Air'
        };
        return types[type] || type;
    }

    formatBrand(brand) {
        const brands = {
            'citadel': 'Citadel',
            'vallejo': 'Vallejo',
            'army-painter': 'Army Painter',
            'scale75': 'Scale75'
        };
        return brands[brand] || brand;
    }

    formatColorGroup(group) {
        const groups = {
            'reds': 'Reds',
            'blues': 'Blues',
            'greens': 'Greens',
            'yellows': 'Yellows',
            'purples': 'Purples',
            'browns': 'Browns',
            'blacks': 'Blacks',
            'metals': 'Metals',
            'skins': 'Skin Tones',
            'neutrals': 'Neutrals'
        };
        return groups[group] || group;
    }

    formatFaction(faction) {
        const factions = {
            'ultramarines': 'Ultramarines',
            'blood_angels': 'Blood Angels',
            'dark_angels': 'Dark Angels',
            'imperial_fists': 'Imperial Fists',
            'space_wolves': 'Space Wolves',
            'cadian': 'Cadian Guard',
            'catachan': 'Catachan',
            'death_guard': 'Death Guard',
            'necron': 'Necrons',
            'ork_green': 'Orks',
            'tau': 'T\'au',
            'aeldari': 'Aeldari'
        };
        return factions[faction] || faction;
    }

    formatStatus(status) {
        const statuses = {
            'planning': 'Planning',
            'in_progress': 'In Progress',
            'paused': 'Paused',
            'completed': 'Completed'
        };
        return statuses[status] || status;
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(27, 94, 32, 0.9)' : type === 'error' ? 'rgba(183, 28, 28, 0.9)' : type === 'warning' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(13, 71, 161, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            border: 1px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#b71c1c' : type === 'warning' ? '#ff9800' : '#0d47a1'};
            font-family: 'Cinzel', serif;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
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

// Initialize the painting guide
document.addEventListener('DOMContentLoaded', () => {
    const paintingGuide = new PaintingGuide();
    window.paintingGuide = paintingGuide;
});