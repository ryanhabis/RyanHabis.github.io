// Warhammer 40k Collection Tracker
class CollectionTracker {
    constructor() {
        this.collection = [];
        this.wishlist = [];
        this.goals = [];
        this.currentView = 'grid';
        this.filters = {
            faction: 'all',
            status: 'all',
            type: 'all',
            sortBy: 'date_added',
            sortOrder: 'desc',
            search: ''
        };
        
        this.init();
    }

    init() {
        this.loadCollection();
        this.loadWishlist();
        this.loadGoals();
        this.setupEventListeners();
        this.updateStats();
        this.renderCollection();
        this.renderWishlist();
        this.renderCharts();
    }

    loadCollection() {
        try {
            const saved = localStorage.getItem('warhammerCollection');
            this.collection = saved ? JSON.parse(saved) : [];
            
            // Load sample data if empty
            if (this.collection.length === 0) {
                this.loadSampleCollection();
            }
        } catch (e) {
            console.error('Error loading collection:', e);
            this.collection = [];
            this.loadSampleCollection();
        }
    }

    loadSampleCollection() {
        this.collection = [
            {
                id: 'mini-1',
                name: 'Intercessor Squad',
                faction: 'space_marines',
                subfaction: 'Ultramarines',
                type: 'infantry',
                points: 100,
                pl: 5,
                role: 'troops',
                unitSize: 5,
                status: 'painted',
                paintScheme: 'Ultramarines Blue',
                paintHours: 8,
                paintDate: '2024-01-15',
                description: 'Standard battleline troops',
                source: 'Games Workshop',
                cost: 60,
                purchaseDate: '2024-01-01',
                storage: 'Display Case',
                condition: 'painted',
                tags: ['troops', 'primaris', 'ultramarines'],
                createdAt: '2024-01-01',
                updatedAt: '2024-01-15',
                favorite: true
            },
            {
                id: 'mini-2',
                name: 'Cadian Shock Troops',
                faction: 'imperial_guard',
                subfaction: 'Cadians',
                type: 'infantry',
                points: 55,
                pl: 3,
                role: 'troops',
                unitSize: 10,
                status: 'wip',
                paintScheme: 'Cadian Camo',
                paintHours: 5,
                description: 'Imperial Guard infantry',
                source: 'Games Workshop',
                cost: 50,
                purchaseDate: '2024-01-10',
                storage: 'Painting Station',
                condition: 'built',
                tags: ['troops', 'guard', 'cadians'],
                createdAt: '2024-01-10',
                updatedAt: '2024-01-12',
                favorite: false
            }
        ];
        
        this.saveCollection();
    }

    saveCollection() {
        try {
            localStorage.setItem('warhammerCollection', JSON.stringify(this.collection));
        } catch (e) {
            console.error('Error saving collection:', e);
        }
    }

    loadWishlist() {
        try {
            const saved = localStorage.getItem('warhammerWishlist');
            this.wishlist = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading wishlist:', e);
            this.wishlist = [];
        }
    }

    saveWishlist() {
        try {
            localStorage.setItem('warhammerWishlist', JSON.stringify(this.wishlist));
        } catch (e) {
            console.error('Error saving wishlist:', e);
        }
    }

    loadGoals() {
        try {
            const saved = localStorage.getItem('warhammerGoals');
            this.goals = saved ? JSON.parse(saved) : this.getDefaultGoals();
        } catch (e) {
            console.error('Error loading goals:', e);
            this.goals = this.getDefaultGoals();
        }
    }

    getDefaultGoals() {
        return [
            {
                id: 'goal-1',
                name: 'Paint 10 Miniatures',
                description: 'Complete painting 10 miniatures to a tabletop standard',
                target: 10,
                current: 3,
                type: 'count',
                deadline: '2024-12-31',
                active: true
            },
            {
                id: 'goal-2',
                name: 'Complete 1000pt Army',
                description: 'Finish painting a 1000 point army',
                target: 1000,
                current: 155,
                type: 'points',
                deadline: '2024-06-30',
                active: true
            }
        ];
    }

    saveGoals() {
        try {
            localStorage.setItem('warhammerGoals', JSON.stringify(this.goals));
        } catch (e) {
            console.error('Error saving goals:', e);
        }
    }

    setupEventListeners() {
        // Quick action buttons
        document.getElementById('add-miniature-btn').addEventListener('click', () => {
            this.showAddMiniModal();
        });
        
        document.getElementById('add-first-mini').addEventListener('click', () => {
            this.showAddMiniModal();
        });
        
        document.getElementById('add-unit-btn').addEventListener('click', () => {
            this.showAddUnitModal();
        });
        
        document.getElementById('bulk-add-btn').addEventListener('click', () => {
            this.showBulkAddModal();
        });
        
        document.getElementById('generate-report-btn').addEventListener('click', () => {
            this.generateReport();
        });
        
        document.getElementById('export-collection-btn').addEventListener('click', () => {
            this.exportCollection();
        });
        
        document.getElementById('backup-collection-btn').addEventListener('click', () => {
            this.backupCollection();
        });
        
        document.getElementById('import-collection').addEventListener('click', () => {
            this.importCollection();
        });
        
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.switchView(this.currentView);
            });
        });
        
        // Filter controls
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });
        
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
        
        document.getElementById('collection-search').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('clear-search').addEventListener('click', () => {
            document.getElementById('collection-search').value = '';
            this.filters.search = '';
            this.applyFilters();
        });
        
        // Display actions
        document.getElementById('select-all').addEventListener('click', () => {
            this.selectAllItems();
        });
        
        document.getElementById('deselect-all').addEventListener('click', () => {
            this.deselectAllItems();
        });
        
        document.getElementById('delete-selected').addEventListener('click', () => {
            this.deleteSelectedItems();
        });
        
        document.getElementById('batch-update').addEventListener('click', () => {
            this.showBatchUpdateModal();
        });
        
        // Wishlist
        document.getElementById('add-to-wishlist').addEventListener('click', () => {
            this.showAddWishlistModal();
        });
        
        // Goals
        document.getElementById('add-goal-btn').addEventListener('click', () => {
            this.addNewGoal();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    modal.style.display = 'none';
                    // Reset forms if needed
                    const form = modal.querySelector('form');
                    if (form) form.reset();
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
        
        // Form tabs
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchFormTab(tabId);
            });
        });
        
        // Add miniature form
        document.getElementById('add-mini-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMiniature();
        });
        
        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderCharts();
            });
        });
    }

    updateStats() {
        const totalMinis = this.collection.length;
        const paintedMinis = this.collection.filter(m => m.status === 'painted' || m.status === 'based' || m.status === 'display').length;
        const paintedPercentage = totalMinis > 0 ? Math.round((paintedMinis / totalMinis) * 100) : 0;
        
        // Count unique factions
        const factions = [...new Set(this.collection.map(m => m.faction))];
        
        // Calculate totals
        const totalPoints = this.collection.reduce((sum, m) => sum + (m.points || 0), 0);
        const totalPL = this.collection.reduce((sum, m) => sum + (m.pl || 0), 0);
        const totalHours = this.collection.reduce((sum, m) => sum + (m.paintHours || 0), 0);
        
        // Update display
        document.getElementById('total-minis').textContent = totalMinis;
        document.getElementById('painted-minis').textContent = paintedMinis;
        document.getElementById('painted-percentage').textContent = `${paintedPercentage}%`;
        document.getElementById('painted-progress').style.width = `${paintedPercentage}%`;
        document.getElementById('total-armies').textContent = factions.length;
        document.getElementById('total-points').textContent = totalPoints;
        document.getElementById('total-pl').textContent = totalPL;
        document.getElementById('total-hours').textContent = totalHours;
        
        // Update wishlist stats
        const wishlistCost = this.wishlist.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
        const priorityItems = this.wishlist.filter(item => item.priority).length;
        
        document.getElementById('wishlist-count').textContent = this.wishlist.length;
        document.getElementById('wishlist-cost').textContent = `$${wishlistCost.toFixed(2)}`;
        document.getElementById('priority-count').textContent = priorityItems;
    }

    renderCollection() {
        this.applyFilters(); // This will trigger the actual rendering
    }

    applyFilters() {
        // Get current filter values
        this.filters.faction = document.getElementById('faction-filter').value;
        this.filters.status = document.getElementById('status-filter').value;
        this.filters.type = document.getElementById('type-filter').value;
        this.filters.sortBy = document.getElementById('sort-by').value;
        this.filters.sortOrder = document.getElementById('sort-order').value;
        this.filters.search = document.getElementById('collection-search').value.toLowerCase();
        
        // Filter collection
        let filtered = [...this.collection];
        
        // Apply filters
        if (this.filters.faction !== 'all') {
            filtered = filtered.filter(m => m.faction === this.filters.faction);
        }
        
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(m => m.status === this.filters.status);
        }
        
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(m => m.type === this.filters.type);
        }
        
        // Apply search
        if (this.filters.search) {
            filtered = filtered.filter(m => 
                m.name.toLowerCase().includes(this.filters.search) ||
                (m.description && m.description.toLowerCase().includes(this.filters.search)) ||
                (m.subfaction && m.subfaction.toLowerCase().includes(this.filters.search)) ||
                (m.tags && m.tags.some(tag => tag.toLowerCase().includes(this.filters.search)))
            );
        }
        
        // Sort collection
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch(this.filters.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'faction':
                    aValue = a.faction.toLowerCase();
                    bValue = b.faction.toLowerCase();
                    break;
                case 'points':
                    aValue = a.points || 0;
                    bValue = b.points || 0;
                    break;
                case 'pl':
                    aValue = a.pl || 0;
                    bValue = b.pl || 0;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default: // date_added
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
            }
            
            if (this.filters.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        // Update display count
        document.getElementById('display-count').textContent = `(${filtered.length} items)`;
        
        // Render based on current view
        switch(this.currentView) {
            case 'grid':
                this.renderGridView(filtered);
                break;
            case 'list':
                this.renderListView(filtered);
                break;
            case 'table':
                this.renderTableView(filtered);
                break;
        }
    }

    resetFilters() {
        document.getElementById('faction-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('sort-by').value = 'date_added';
        document.getElementById('sort-order').value = 'desc';
        document.getElementById('collection-search').value = '';
        
        this.filters = {
            faction: 'all',
            status: 'all',
            type: 'all',
            sortBy: 'date_added',
            sortOrder: 'desc',
            search: ''
        };
        
        this.applyFilters();
    }

    switchView(view) {
        // Hide all views
        document.getElementById('grid-view').classList.remove('active');
        document.getElementById('list-view').style.display = 'none';
        document.getElementById('table-view').style.display = 'none';
        
        // Show selected view
        switch(view) {
            case 'grid':
                document.getElementById('grid-view').classList.add('active');
                break;
            case 'list':
                document.getElementById('list-view').style.display = 'block';
                break;
            case 'table':
                document.getElementById('table-view').style.display = 'block';
                break;
        }
        
        // Re-render collection for the new view
        this.applyFilters();
    }

    renderGridView(miniatures) {
        const grid = document.getElementById('miniature-grid');
        
        if (miniatures.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎨</div>
                    <h4>No Miniatures Found</h4>
                    <p>Try changing your filters or add new miniatures.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = miniatures.map(mini => `
            <div class="miniature-card" data-id="${mini.id}">
                <div class="miniature-card-header">
                    <div class="miniature-status ${mini.status}">
                        ${this.getStatusIcon(mini.status)}
                    </div>
                    <div class="miniature-actions">
                        <button class="mini-action-btn edit-mini" data-id="${mini.id}">✏️</button>
                        <button class="mini-action-btn delete-mini" data-id="${mini.id}">🗑️</button>
                    </div>
                </div>
                
                <div class="miniature-card-body">
                    <h4 class="miniature-name">${mini.name}</h4>
                    <div class="miniature-faction">
                        <span class="faction-badge ${mini.faction}">${this.formatFaction(mini.faction)}</span>
                        ${mini.subfaction ? `<span class="subfaction">${mini.subfaction}</span>` : ''}
                    </div>
                    
                    <div class="miniature-stats">
                        ${mini.points ? `<div class="stat">
                            <span>Points:</span>
                            <strong>${mini.points}</strong>
                        </div>` : ''}
                        
                        ${mini.pl ? `<div class="stat">
                            <span>PL:</span>
                            <strong>${mini.pl}</strong>
                        </div>` : ''}
                        
                        ${mini.unitSize ? `<div class="stat">
                            <span>Models:</span>
                            <strong>${mini.unitSize}</strong>
                        </div>` : ''}
                    </div>
                    
                    ${mini.description ? `<p class="miniature-description">${mini.description}</p>` : ''}
                    
                    ${mini.paintScheme ? `<div class="paint-info">
                        <span class="paint-scheme">${mini.paintScheme}</span>
                        ${mini.paintHours ? `<span class="paint-hours">${mini.paintHours}h</span>` : ''}
                    </div>` : ''}
                    
                    ${mini.tags && mini.tags.length > 0 ? `
                        <div class="miniature-tags">
                            ${mini.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="miniature-card-footer">
                    <div class="miniature-date">
                        Added: ${new Date(mini.createdAt).toLocaleDateString()}
                    </div>
                    ${mini.favorite ? `<div class="miniature-favorite">⭐</div>` : ''}
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        grid.querySelectorAll('.edit-mini').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const miniId = e.target.dataset.id || e.target.closest('.edit-mini').dataset.id;
                this.editMiniature(miniId);
            });
        });
        
        grid.querySelectorAll('.delete-mini').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const miniId = e.target.dataset.id || e.target.closest('.delete-mini').dataset.id;
                this.deleteMiniature(miniId);
            });
        });
        
        grid.querySelectorAll('.miniature-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.miniature-actions')) {
                    const miniId = card.dataset.id;
                    this.viewMiniature(miniId);
                }
            });
        });
    }

    renderListView(miniatures) {
        const tableBody = document.getElementById('list-table-body');
        
        if (miniatures.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-table">
                        <div class="empty-icon">🎨</div>
                        <h4>No Miniatures Found</h4>
                        <p>Try changing your filters or add new miniatures.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = miniatures.map(mini => `
            <tr data-id="${mini.id}">
                <td><input type="checkbox" class="select-item" data-id="${mini.id}"></td>
                <td>
                    <strong>${mini.name}</strong>
                    ${mini.favorite ? '<span class="favorite-star">⭐</span>' : ''}
                </td>
                <td>
                    <span class="faction-label ${mini.faction}">${this.formatFaction(mini.faction)}</span>
                    ${mini.subfaction ? `<br><small>${mini.subfaction}</small>` : ''}
                </td>
                <td>${this.formatType(mini.type)}</td>
                <td>${mini.points || '-'}</td>
                <td>${mini.pl || '-'}</td>
                <td>
                    <span class="status-badge ${mini.status}">
                        ${this.formatStatus(mini.status)}
                    </span>
                </td>
                <td>${new Date(mini.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="table-action-btn view" data-id="${mini.id}">View</button>
                    <button class="table-action-btn edit" data-id="${mini.id}">Edit</button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners
        tableBody.querySelectorAll('.view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const miniId = e.target.dataset.id;
                this.viewMiniature(miniId);
            });
        });
        
        tableBody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const miniId = e.target.dataset.id;
                this.editMiniature(miniId);
            });
        });
        
        // Checkbox for select all
        document.getElementById('select-all-checkbox').addEventListener('change', (e) => {
            const checkboxes = tableBody.querySelectorAll('.select-item');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }

    renderTableView(miniatures) {
        const container = document.getElementById('table-container');
        
        if (miniatures.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎨</div>
                    <h4>No Miniatures Found</h4>
                    <p>Try changing your filters or add new miniatures.</p>
                </div>
            `;
            return;
        }
        
        // Create detailed table
        let tableHTML = `
            <table class="detailed-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Faction</th>
                        <th>Type</th>
                        <th>Points</th>
                        <th>PL</th>
                        <th>Status</th>
                        <th>Paint Scheme</th>
                        <th>Hours</th>
                        <th>Cost</th>
                        <th>Added</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        miniatures.forEach(mini => {
            tableHTML += `
                <tr data-id="${mini.id}">
                    <td>
                        <strong>${mini.name}</strong>
                        ${mini.favorite ? '<span class="favorite-star">⭐</span>' : ''}
                        ${mini.description ? `<br><small>${mini.description}</small>` : ''}
                    </td>
                    <td>${this.formatFaction(mini.faction)}${mini.subfaction ? `<br><small>${mini.subfaction}</small>` : ''}</td>
                    <td>${this.formatType(mini.type)}</td>
                    <td>${mini.points || '-'}</td>
                    <td>${mini.pl || '-'}</td>
                    <td class="status-cell ${mini.status}">${this.formatStatus(mini.status)}</td>
                    <td>${mini.paintScheme || '-'}</td>
                    <td>${mini.paintHours || '-'}</td>
                    <td>${mini.cost ? `$${mini.cost.toFixed(2)}` : '-'}</td>
                    <td>${new Date(mini.createdAt).toLocaleDateString()}</td>
                </tr>
            `;
        });
        
        tableHTML += `</tbody></table>`;
        container.innerHTML = tableHTML;
        
        // Add click event to rows
        container.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                const miniId = row.dataset.id;
                this.viewMiniature(miniId);
            });
        });
    }

    renderWishlist() {
        const container = document.getElementById('wishlist-items');
        
        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-icon">🎯</div>
                    <h4>Your Wishlist is Empty</h4>
                    <p>Add models you plan to purchase in the future!</p>
                    <button id="add-first-wishlist" class="imperial-btn-small">Add to Wishlist</button>
                </div>
            `;
            
            document.getElementById('add-first-wishlist')?.addEventListener('click', () => {
                this.showAddWishlistModal();
            });
            
            return;
        }
        
        container.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item" data-id="${item.id}">
                <div class="wishlist-header">
                    <h4>${item.name}</h4>
                    <span class="wishlist-priority ${item.priority ? 'high' : 'normal'}">
                        ${item.priority ? 'High Priority' : 'Normal'}
                    </span>
                </div>
                
                <div class="wishlist-details">
                    <span class="wishlist-faction">${this.formatFaction(item.faction)}</span>
                    <span class="wishlist-type">${this.formatType(item.type)}</span>
                    <span class="wishlist-cost">$${item.estimatedCost?.toFixed(2) || '?'}</span>
                </div>
                
                ${item.reason ? `<p class="wishlist-reason">${item.reason}</p>` : ''}
                
                <div class="wishlist-actions">
                    <button class="wishlist-action-btn mark-purchased" data-id="${item.id}">Mark Purchased</button>
                    <button class="wishlist-action-btn edit-wishlist" data-id="${item.id}">Edit</button>
                    <button class="wishlist-action-btn remove-wishlist" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.mark-purchased').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                this.markWishlistPurchased(itemId);
            });
        });
        
        container.querySelectorAll('.edit-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                this.editWishlistItem(itemId);
            });
        });
        
        container.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                this.removeWishlistItem(itemId);
            });
        });
    }

    renderCharts() {
        // This is a simplified chart rendering using HTML/CSS
        // In a real application, you might use Chart.js or similar
        
        // Status distribution
        const statusCounts = {
            unpainted: 0,
            primed: 0,
            wip: 0,
            painted: 0,
            based: 0,
            display: 0
        };
        
        this.collection.forEach(mini => {
            if (statusCounts[mini.status] !== undefined) {
                statusCounts[mini.status]++;
            }
        });
        
        const statusChart = document.getElementById('status-chart');
        statusChart.innerHTML = this.createBarChart(statusCounts);
        
        // Faction breakdown
        const factionCounts = {};
        this.collection.forEach(mini => {
            factionCounts[mini.faction] = (factionCounts[mini.faction] || 0) + 1;
        });
        
        const factionChart = document.getElementById('faction-chart');
        factionChart.innerHTML = this.createBarChart(factionCounts);
    }

    createBarChart(data) {
        const maxValue = Math.max(...Object.values(data));
        
        let chartHTML = '<div class="chart-bars">';
        
        Object.entries(data).forEach(([key, value]) => {
            if (value > 0) {
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                chartHTML += `
                    <div class="chart-bar">
                        <div class="bar-label">${this.formatKey(key)}</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${percentage}%">
                                <span class="bar-value">${value}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        chartHTML += '</div>';
        return chartHTML;
    }

    showAddMiniModal() {
        // Reset form
        document.getElementById('add-mini-form').reset();
        
        // Reset tabs to basic
        this.switchFormTab('basic');
        
        // Set default date to today
        document.getElementById('mini-purchase-date').valueAsDate = new Date();
        document.getElementById('mini-paint-date').valueAsDate = new Date();
        
        // Show modal
        document.getElementById('add-mini-modal').style.display = 'flex';
    }

    switchFormTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });
        
        // Deactivate all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabId}-tab`).style.display = 'block';
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Activate selected tab button
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }

    addMiniature() {
        // Get form data
        const formData = {
            id: 'mini-' + Date.now(),
            name: document.getElementById('mini-name').value,
            faction: document.getElementById('mini-faction').value,
            subfaction: document.getElementById('mini-subfaction').value || null,
            type: document.getElementById('mini-type').value,
            description: document.getElementById('mini-description').value || null,
            points: parseInt(document.getElementById('mini-points').value) || null,
            pl: parseInt(document.getElementById('mini-pl').value) || null,
            role: document.getElementById('mini-role').value || null,
            unitSize: parseInt(document.getElementById('mini-unit-count').value) || 1,
            status: document.getElementById('mini-status').value,
            paintScheme: document.getElementById('mini-paint-scheme').value || null,
            paintHours: parseFloat(document.getElementById('mini-paint-hours').value) || null,
            paintDate: document.getElementById('mini-paint-date').value || null,
            source: document.getElementById('mini-source').value || null,
            cost: parseFloat(document.getElementById('mini-cost').value) || null,
            purchaseDate: document.getElementById('mini-purchase-date').value || null,
            storage: document.getElementById('mini-storage').value || null,
            condition: document.getElementById('mini-condition').value || 'new',
            favorite: document.getElementById('mini-favorite').checked,
            tags: document.getElementById('mini-tags').value ? 
                  document.getElementById('mini-tags').value.split(',').map(t => t.trim()) : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to collection
        this.collection.push(formData);
        this.saveCollection();
        
        // Close modal
        document.getElementById('add-mini-modal').style.display = 'none';
        
        // Update UI
        this.updateStats();
        this.renderCollection();
        this.renderCharts();
        
        this.showNotification(`"${formData.name}" added to collection!`);
    }

    editMiniature(miniId) {
        const mini = this.collection.find(m => m.id === miniId);
        if (!mini) return;
        
        // Create edit form (similar to add form but with current values)
        const modal = document.getElementById('edit-mini-modal');
        const form = document.getElementById('edit-mini-form');
        
        // Populate form with mini data
        form.innerHTML = this.createEditForm(mini);
        
        // Show modal
        modal.style.display = 'flex';
        
        // Setup form submission
        const submitHandler = (e) => {
            e.preventDefault();
            this.updateMiniature(miniId, form);
            modal.style.display = 'none';
            form.removeEventListener('submit', submitHandler);
        };
        
        form.addEventListener('submit', submitHandler);
    }

    createEditForm(mini) {
        return `
            <div class="form-group">
                <label for="edit-name">Model Name</label>
                <input type="text" id="edit-name" value="${mini.name}" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-faction">Faction</label>
                    <select id="edit-faction" required>
                        <option value="space_marines" ${mini.faction === 'space_marines' ? 'selected' : ''}>Space Marines</option>
                        <option value="imperial_guard" ${mini.faction === 'imperial_guard' ? 'selected' : ''}>Imperial Guard</option>
                        <option value="chaos" ${mini.faction === 'chaos' ? 'selected' : ''}>Chaos Space Marines</option>
                        <!-- Add other factions -->
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-status">Paint Status</label>
                    <select id="edit-status" required>
                        <option value="unpainted" ${mini.status === 'unpainted' ? 'selected' : ''}>Unpainted</option>
                        <option value="primed" ${mini.status === 'primed' ? 'selected' : ''}>Primed</option>
                        <option value="wip" ${mini.status === 'wip' ? 'selected' : ''}>Work in Progress</option>
                        <option value="painted" ${mini.status === 'painted' ? 'selected' : ''}>Painted</option>
                        <option value="based" ${mini.status === 'based' ? 'selected' : ''}>Based</option>
                        <option value="display" ${mini.status === 'display' ? 'selected' : ''}>Display Quality</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="edit-points">Points Value</label>
                <input type="number" id="edit-points" value="${mini.points || ''}" min="0" step="5">
            </div>
            
            <div class="form-group">
                <label for="edit-paint-scheme">Paint Scheme</label>
                <input type="text" id="edit-paint-scheme" value="${mini.paintScheme || ''}">
            </div>
            
            <div class="form-group">
                <label for="edit-description">Description</label>
                <textarea id="edit-description" rows="2">${mini.description || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="edit-favorite" ${mini.favorite ? 'checked' : ''}>
                    Mark as Favorite
                </label>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="imperial-btn">Update</button>
                <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                <button type="button" class="imperial-btn-clear delete-from-edit" data-id="${mini.id}">Delete</button>
            </div>
        `;
    }

    updateMiniature(miniId, form) {
        const miniIndex = this.collection.findIndex(m => m.id === miniId);
        if (miniIndex === -1) return;
        
        // Update mini data
        this.collection[miniIndex] = {
            ...this.collection[miniIndex],
            name: document.getElementById('edit-name').value,
            faction: document.getElementById('edit-faction').value,
            status: document.getElementById('edit-status').value,
            points: parseInt(document.getElementById('edit-points').value) || null,
            paintScheme: document.getElementById('edit-paint-scheme').value || null,
            description: document.getElementById('edit-description').value || null,
            favorite: document.getElementById('edit-favorite').checked,
            updatedAt: new Date().toISOString()
        };
        
        this.saveCollection();
        this.updateStats();
        this.renderCollection();
        
        this.showNotification(`"${this.collection[miniIndex].name}" updated!`);
    }

    deleteMiniature(miniId) {
        if (confirm('Delete this miniature from your collection?')) {
            const miniIndex = this.collection.findIndex(m => m.id === miniId);
            if (miniIndex !== -1) {
                const miniName = this.collection[miniIndex].name;
                this.collection.splice(miniIndex, 1);
                this.saveCollection();
                
                this.updateStats();
                this.renderCollection();
                this.renderCharts();
                
                this.showNotification(`"${miniName}" removed from collection`);
            }
        }
    }

    viewMiniature(miniId) {
        const mini = this.collection.find(m => m.id === miniId);
        if (!mini) return;
        
        // Create a detailed view modal
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
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${mini.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="miniature-details">
                        <div class="detail-row">
                            <span class="detail-label">Faction:</span>
                            <span class="detail-value">${this.formatFaction(mini.faction)}${mini.subfaction ? ` (${mini.subfaction})` : ''}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${this.formatType(mini.type)}</span>
                        </div>
                        ${mini.role ? `
                            <div class="detail-row">
                                <span class="detail-label">Role:</span>
                                <span class="detail-value">${this.formatRole(mini.role)}</span>
                            </div>
                        ` : ''}
                        ${mini.points ? `
                            <div class="detail-row">
                                <span class="detail-label">Points:</span>
                                <span class="detail-value">${mini.points}</span>
                            </div>
                        ` : ''}
                        ${mini.pl ? `
                            <div class="detail-row">
                                <span class="detail-label">Power Level:</span>
                                <span class="detail-value">${mini.pl}</span>
                            </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Paint Status:</span>
                            <span class="detail-value status-badge ${mini.status}">${this.formatStatus(mini.status)}</span>
                        </div>
                        ${mini.paintScheme ? `
                            <div class="detail-row">
                                <span class="detail-label">Paint Scheme:</span>
                                <span class="detail-value">${mini.paintScheme}</span>
                            </div>
                        ` : ''}
                        ${mini.paintHours ? `
                            <div class="detail-row">
                                <span class="detail-label">Painting Hours:</span>
                                <span class="detail-value">${mini.paintHours}</span>
                            </div>
                        ` : ''}
                        ${mini.cost ? `
                            <div class="detail-row">
                                <span class="detail-label">Cost:</span>
                                <span class="detail-value">$${mini.cost.toFixed(2)}</span>
                            </div>
                        ` : ''}
                        ${mini.description ? `
                            <div class="detail-row full-width">
                                <span class="detail-label">Description:</span>
                                <p class="detail-value">${mini.description}</p>
                            </div>
                        ` : ''}
                        ${mini.tags && mini.tags.length > 0 ? `
                            <div class="detail-row">
                                <span class="detail-label">Tags:</span>
                                <div class="detail-tags">
                                    ${mini.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Added:</span>
                            <span class="detail-value">${new Date(mini.createdAt).toLocaleDateString()}</span>
                        </div>
                        ${mini.updatedAt !== mini.createdAt ? `
                            <div class="detail-row">
                                <span class="detail-label">Last Updated:</span>
                                <span class="detail-value">${new Date(mini.updatedAt).toLocaleDateString()}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="imperial-btn edit-from-view" data-id="${mini.id}">Edit</button>
                        <button class="imperial-btn-secondary close-modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.edit-from-view').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.editMiniature(miniId);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showAddWishlistModal() {
        // Simple prompt for now - could be expanded to a full form
        const name = prompt('Enter model name for wishlist:');
        if (!name) return;
        
        const faction = prompt('Enter faction:');
        if (!faction) return;
        
        const cost = parseFloat(prompt('Enter estimated cost (optional):', '0')) || 0;
        const priority = confirm('Mark as high priority?');
        
        const wishlistItem = {
            id: 'wish-' + Date.now(),
            name,
            faction,
            estimatedCost: cost,
            priority,
            addedAt: new Date().toISOString()
        };
        
        this.wishlist.push(wishlistItem);
        this.saveWishlist();
        this.renderWishlist();
        this.updateStats();
        
        this.showNotification(`"${name}" added to wishlist!`);
    }

    markWishlistPurchased(itemId) {
        const itemIndex = this.wishlist.findIndex(w => w.id === itemId);
        if (itemIndex === -1) return;
        
        const item = this.wishlist[itemIndex];
        
        if (confirm(`Mark "${item.name}" as purchased and add to collection?`)) {
            // Remove from wishlist
            this.wishlist.splice(itemIndex, 1);
            this.saveWishlist();
            
            // Add to collection
            const newMini = {
                id: 'mini-' + Date.now(),
                name: item.name,
                faction: item.faction,
                type: 'infantry', // Default type
                status: 'unpainted',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                cost: item.estimatedCost || null,
                purchaseDate: new Date().toISOString().split('T')[0]
            };
            
            this.collection.push(newMini);
            this.saveCollection();
            
            // Update UI
            this.renderWishlist();
            this.updateStats();
            this.renderCollection();
            
            this.showNotification(`"${item.name}" moved to collection!`);
        }
    }

        removeWishlistItem(itemId) {
        const itemIndex = this.wishlist.findIndex(w => w.id === itemId);
        if (itemIndex === -1) return;
        
        const itemName = this.wishlist[itemIndex].name;
        
        if (confirm(`Remove "${itemName}" from wishlist?`)) {
            this.wishlist.splice(itemIndex, 1);
            this.saveWishlist();
            this.renderWishlist();
            this.updateStats();
            
            this.showNotification(`"${itemName}" removed from wishlist`);
        }
    }

    editWishlistItem(itemId) {
        const itemIndex = this.wishlist.findIndex(w => w.id === itemId);
        if (itemIndex === -1) return;
        
        const item = this.wishlist[itemIndex];
        
        // Create a simple edit form
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
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>Edit Wishlist Item</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="edit-wishlist-form">
                        <div class="form-group">
                            <label for="edit-wishlist-name">Name</label>
                            <input type="text" id="edit-wishlist-name" value="${item.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-wishlist-faction">Faction</label>
                            <select id="edit-wishlist-faction" required>
                                <option value="space_marines" ${item.faction === 'space_marines' ? 'selected' : ''}>Space Marines</option>
                                <option value="imperial_guard" ${item.faction === 'imperial_guard' ? 'selected' : ''}>Imperial Guard</option>
                                <option value="chaos" ${item.faction === 'chaos' ? 'selected' : ''}>Chaos Space Marines</option>
                                <option value="aeldari" ${item.faction === 'aeldari' ? 'selected' : ''}>Aeldari</option>
                                <option value="ork" ${item.faction === 'ork' ? 'selected' : ''}>Orks</option>
                                <option value="necron" ${item.faction === 'necron' ? 'selected' : ''}>Necrons</option>
                                <option value="tyranid" ${item.faction === 'tyranid' ? 'selected' : ''}>Tyranids</option>
                                <option value="tau" ${item.faction === 'tau' ? 'selected' : ''}>T'au Empire</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="edit-wishlist-cost">Estimated Cost ($)</label>
                            <input type="number" id="edit-wishlist-cost" value="${item.estimatedCost || 0}" min="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="edit-wishlist-priority" ${item.priority ? 'checked' : ''}>
                                High Priority
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="imperial-btn">Update</button>
                            <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const form = modal.querySelector('#edit-wishlist-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            this.wishlist[itemIndex] = {
                ...this.wishlist[itemIndex],
                name: document.getElementById('edit-wishlist-name').value,
                faction: document.getElementById('edit-wishlist-faction').value,
                estimatedCost: parseFloat(document.getElementById('edit-wishlist-cost').value) || 0,
                priority: document.getElementById('edit-wishlist-priority').checked
            };
            
            this.saveWishlist();
            this.renderWishlist();
            this.updateStats();
            document.body.removeChild(modal);
            
            this.showNotification(`"${this.wishlist[itemIndex].name}" updated!`);
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showBatchUpdateModal() {
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked'))
            .map(cb => cb.dataset.id);
        
        if (selectedItems.length === 0) {
            this.showNotification('No items selected!', 'warning');
            return;
        }
        
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
                    <h3>Batch Update (${selectedItems.length} items)</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="batch-update-form">
                        <div class="form-group">
                            <label for="batch-status">Update Status</label>
                            <select id="batch-status">
                                <option value="">-- Keep Current --</option>
                                <option value="unpainted">Unpainted</option>
                                <option value="primed">Primed</option>
                                <option value="wip">Work in Progress</option>
                                <option value="painted">Painted</option>
                                <option value="based">Based</option>
                                <option value="display">Display Quality</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="batch-favorite">Update Favorite</label>
                            <select id="batch-favorite">
                                <option value="">-- Keep Current --</option>
                                <option value="true">Mark as Favorite</option>
                                <option value="false">Remove Favorite</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="batch-storage">Update Storage Location</label>
                            <input type="text" id="batch-storage" placeholder="Leave blank to keep current">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="imperial-btn">Apply Updates</button>
                            <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = modal.querySelector('#batch-update-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const status = document.getElementById('batch-status').value;
            const favorite = document.getElementById('batch-favorite').value;
            const storage = document.getElementById('batch-storage').value.trim();
            
            selectedItems.forEach(miniId => {
                const miniIndex = this.collection.findIndex(m => m.id === miniId);
                if (miniIndex !== -1) {
                    const updates = {};
                    
                    if (status) updates.status = status;
                    if (favorite !== '') updates.favorite = favorite === 'true';
                    if (storage) updates.storage = storage;
                    
                    this.collection[miniIndex] = {
                        ...this.collection[miniIndex],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                }
            });
            
            this.saveCollection();
            this.updateStats();
            this.renderCollection();
            document.body.removeChild(modal);
            
            this.showNotification(`Updated ${selectedItems.length} items!`);
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    selectAllItems() {
        document.querySelectorAll('.select-item').forEach(cb => {
            cb.checked = true;
        });
    }

    deselectAllItems() {
        document.querySelectorAll('.select-item').forEach(cb => {
            cb.checked = false;
        });
    }

    deleteSelectedItems() {
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked'))
            .map(cb => cb.dataset.id);
        
        if (selectedItems.length === 0) {
            this.showNotification('No items selected!', 'warning');
            return;
        }
        
        if (confirm(`Delete ${selectedItems.length} selected miniatures? This action cannot be undone.`)) {
            // Remove from collection
            this.collection = this.collection.filter(m => !selectedItems.includes(m.id));
            this.saveCollection();
            
            // Update UI
            this.updateStats();
            this.renderCollection();
            this.renderCharts();
            
            this.showNotification(`Deleted ${selectedItems.length} miniatures!`);
        }
    }

    generateReport() {
        // Create a comprehensive report
        const report = {
            generated: new Date().toISOString(),
            collection: {
                total: this.collection.length,
                painted: this.collection.filter(m => m.status === 'painted' || m.status === 'based' || m.status === 'display').length,
                factions: this.getFactionBreakdown(),
                points: {
                    total: this.collection.reduce((sum, m) => sum + (m.points || 0), 0),
                    average: Math.round(this.collection.reduce((sum, m) => sum + (m.points || 0), 0) / this.collection.length) || 0
                },
                paintHours: this.collection.reduce((sum, m) => sum + (m.paintHours || 0), 0)
            },
            wishlist: {
                total: this.wishlist.length,
                priority: this.wishlist.filter(item => item.priority).length,
                estimatedCost: this.wishlist.reduce((sum, item) => sum + (item.estimatedCost || 0), 0)
            }
        };
        
        // Create report modal
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
            <div class="modal" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Collection Report</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="report-content" style="color: #b0b0b0; line-height: 1.6;">
                        <h4 style="color: #d4af37; margin-bottom: 1rem;">Collection Overview</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                            <div class="report-stat">
                                <strong>Total Miniatures:</strong> ${report.collection.total}
                            </div>
                            <div class="report-stat">
                                <strong>Painted Miniatures:</strong> ${report.collection.painted}
                            </div>
                            <div class="report-stat">
                                <strong>Painted Percentage:</strong> ${report.collection.total > 0 ? Math.round((report.collection.painted / report.collection.total) * 100) : 0}%
                            </div>
                            <div class="report-stat">
                                <strong>Total Points Value:</strong> ${report.collection.points.total}
                            </div>
                            <div class="report-stat">
                                <strong>Total Painting Hours:</strong> ${report.collection.paintHours}
                            </div>
                            <div class="report-stat">
                                <strong>Unique Factions:</strong> ${Object.keys(report.collection.factions).length}
                            </div>
                        </div>
                        
                        <h4 style="color: #d4af37; margin-bottom: 1rem;">Faction Breakdown</h4>
                        <div style="margin-bottom: 2rem;">
                            ${Object.entries(report.collection.factions).map(([faction, count]) => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(40, 40, 40, 0.5);">
                                    <span>${this.formatFaction(faction)}:</span>
                                    <strong>${count}</strong>
                                </div>
                            `).join('')}
                        </div>
                        
                        <h4 style="color: #d4af37; margin-bottom: 1rem;">Wishlist Summary</h4>
                        <div style="margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Wishlist Items:</span>
                                <strong>${report.wishlist.total}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>High Priority Items:</span>
                                <strong>${report.wishlist.priority}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Estimated Cost:</span>
                                <strong>$${report.wishlist.estimatedCost.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-actions" style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button id="export-report-json" class="imperial-btn">Export as JSON</button>
                        <button id="export-report-csv" class="imperial-btn-secondary">Export as CSV</button>
                        <button class="imperial-btn-clear close-modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#export-report-json').addEventListener('click', () => {
            this.exportReportAsJSON(report);
        });
        
        modal.querySelector('#export-report-csv').addEventListener('click', () => {
            this.exportReportAsCSV(report);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    exportReportAsJSON(report) {
        const dataStr = JSON.stringify(report, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `warhammer-collection-report-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Report exported as JSON!');
    }

    exportReportAsCSV(report) {
        // Create CSV content
        let csvContent = "Warhammer 40k Collection Report\n\n";
        csvContent += "Generated," + new Date().toLocaleString() + "\n\n";
        
        csvContent += "COLLECTION OVERVIEW\n";
        csvContent += "Total Miniatures," + report.collection.total + "\n";
        csvContent += "Painted Miniatures," + report.collection.painted + "\n";
        csvContent += "Painted Percentage," + (report.collection.total > 0 ? Math.round((report.collection.painted / report.collection.total) * 100) : 0) + "%\n";
        csvContent += "Total Points," + report.collection.points.total + "\n";
        csvContent += "Average Points," + report.collection.points.average + "\n";
        csvContent += "Total Painting Hours," + report.collection.paintHours + "\n\n";
        
        csvContent += "FACTION BREAKDOWN\n";
        Object.entries(report.collection.factions).forEach(([faction, count]) => {
            csvContent += this.formatFaction(faction) + "," + count + "\n";
        });
        csvContent += "\n";
        
        csvContent += "WISHLIST SUMMARY\n";
        csvContent += "Total Items," + report.wishlist.total + "\n";
        csvContent += "High Priority Items," + report.wishlist.priority + "\n";
        csvContent += "Estimated Cost,$" + report.wishlist.estimatedCost.toFixed(2) + "\n";
        
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const exportFileDefaultName = `warhammer-collection-report-${new Date().toISOString().split('T')[0]}.csv`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Report exported as CSV!');
    }

    exportCollection() {
        const exportData = {
            version: '1.0',
            exported: new Date().toISOString(),
            collection: this.collection,
            wishlist: this.wishlist,
            goals: this.goals
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `warhammer-collection-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Collection exported successfully!');
    }

    importCollection() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('Importing will replace your current collection. Continue?')) {
                        if (data.collection) {
                            this.collection = data.collection;
                            this.saveCollection();
                        }
                        
                        if (data.wishlist) {
                            this.wishlist = data.wishlist;
                            this.saveWishlist();
                        }
                        
                        if (data.goals) {
                            this.goals = data.goals;
                            this.saveGoals();
                        }
                        
                        this.updateStats();
                        this.renderCollection();
                        this.renderWishlist();
                        this.renderCharts();
                        
                        this.showNotification('Collection imported successfully!');
                    }
                } catch (error) {
                    this.showNotification('Error importing collection: Invalid file format', 'error');
                    console.error('Import error:', error);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    backupCollection() {
        // Create a comprehensive backup
        const backup = {
            metadata: {
                version: '1.0',
                backupDate: new Date().toISOString(),
                itemCount: this.collection.length
            },
            collection: this.collection,
            wishlist: this.wishlist,
            goals: this.goals,
            settings: {
                filters: this.filters,
                currentView: this.currentView
            }
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `warhammer-collection-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Backup created successfully!');
    }

    showAddUnitModal() {
        // This would be similar to showAddMiniModal but for multi-unit entries
        this.showNotification('Add unit feature coming soon!', 'info');
    }

    showBulkAddModal() {
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
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Bulk Add Miniatures</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <p style="color: #b0b0b0; margin-bottom: 1rem;">
                        Enter one miniature per line in the format:<br>
                        <code>Name | Faction | Points | Status</code><br>
                        Example: <code>Intercessor Squad | space_marines | 100 | painted</code>
                    </p>
                    <form id="bulk-add-form">
                        <div class="form-group">
                            <label for="bulk-miniatures">Miniature Data</label>
                            <textarea id="bulk-miniatures" rows="10" placeholder="Intercessor Squad | space_marines | 100 | painted
Cadian Shock Troops | imperial_guard | 55 | wip"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="imperial-btn">Add Miniatures</button>
                            <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = modal.querySelector('#bulk-add-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = document.getElementById('bulk-miniatures');
            const lines = textarea.value.split('\n').filter(line => line.trim());
            
            let addedCount = 0;
            let errorCount = 0;
            
            lines.forEach(line => {
                const parts = line.split('|').map(part => part.trim());
                
                if (parts.length >= 2) {
                    const mini = {
                        id: 'mini-' + Date.now() + '-' + Math.random(),
                        name: parts[0],
                        faction: parts[1],
                        points: parts[2] ? parseInt(parts[2]) : null,
                        status: parts[3] || 'unpainted',
                        type: 'infantry',
                        unitSize: 1,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    this.collection.push(mini);
                    addedCount++;
                } else {
                    errorCount++;
                }
            });
            
            if (addedCount > 0) {
                this.saveCollection();
                this.updateStats();
                this.renderCollection();
                this.renderCharts();
            }
            
            document.body.removeChild(modal);
            
            this.showNotification(`Added ${addedCount} miniatures${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    addNewGoal() {
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
                    <h3>Add New Goal</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="new-goal-form">
                        <div class="form-group">
                            <label for="goal-name">Goal Name</label>
                            <input type="text" id="goal-name" placeholder="e.g., Paint 10 miniatures" required>
                        </div>
                        <div class="form-group">
                            <label for="goal-description">Description</label>
                            <textarea id="goal-description" rows="3" placeholder="Optional description"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="goal-type">Type</label>
                                <select id="goal-type" required>
                                    <option value="count">Miniature Count</option>
                                    <option value="points">Points Value</option>
                                    <option value="hours">Painting Hours</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="goal-target">Target</label>
                                <input type="number" id="goal-target" min="1" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="goal-deadline">Deadline (optional)</label>
                            <input type="date" id="goal-deadline">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="imperial-btn">Add Goal</button>
                            <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set default date to 30 days from now
        const deadlineInput = modal.querySelector('#goal-deadline');
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        deadlineInput.valueAsDate = defaultDate;
        
        const form = modal.querySelector('#new-goal-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newGoal = {
                id: 'goal-' + Date.now(),
                name: document.getElementById('goal-name').value,
                description: document.getElementById('goal-description').value || '',
                type: document.getElementById('goal-type').value,
                target: parseInt(document.getElementById('goal-target').value),
                current: 0,
                deadline: document.getElementById('goal-deadline').value || null,
                active: true,
                created: new Date().toISOString()
            };
            
            this.goals.push(newGoal);
            this.saveGoals();
            document.body.removeChild(modal);
            
            this.showNotification(`Goal "${newGoal.name}" added!`);
            
            // Update goals display if it exists
            const goalsContainer = document.getElementById('goals-container');
            if (goalsContainer) {
                this.renderGoals();
            }
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    renderGoals() {
        const container = document.getElementById('goals-container');
        if (!container) return;
        
        container.innerHTML = this.goals.map(goal => `
            <div class="goal-card" data-id="${goal.id}">
                <div class="goal-header">
                    <h4>${goal.name}</h4>
                    <span class="goal-status ${goal.active ? 'active' : 'completed'}">
                        ${goal.active ? 'Active' : 'Completed'}
                    </span>
                </div>
                
                ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${goal.current} / ${goal.target} ${this.getGoalUnit(goal.type)}</span>
                        <span>${Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                </div>
                
                <div class="goal-info">
                    ${goal.deadline ? `
                        <div class="goal-deadline">
                            <span>Deadline:</span>
                            <strong>${new Date(goal.deadline).toLocaleDateString()}</strong>
                        </div>
                    ` : ''}
                    <div class="goal-created">
                        <span>Created:</span>
                        <strong>${new Date(goal.created).toLocaleDateString()}</strong>
                    </div>
                </div>
                
                <div class="goal-actions">
                    <button class="goal-action-btn update-progress" data-id="${goal.id}">Update Progress</button>
                    <button class="goal-action-btn edit-goal" data-id="${goal.id}">Edit</button>
                    <button class="goal-action-btn delete-goal" data-id="${goal.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.update-progress').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.dataset.id;
                this.updateGoalProgress(goalId);
            });
        });
        
        container.querySelectorAll('.edit-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.dataset.id;
                this.editGoal(goalId);
            });
        });
        
        container.querySelectorAll('.delete-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.dataset.id;
                this.deleteGoal(goalId);
            });
        });
    }

    getGoalUnit(type) {
        switch(type) {
            case 'count': return 'miniatures';
            case 'points': return 'points';
            case 'hours': return 'hours';
            default: return '';
        }
    }

    updateGoalProgress(goalId) {
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return;
        
        const goal = this.goals[goalIndex];
        const currentProgress = parseInt(prompt(`Enter current progress for "${goal.name}":`, goal.current));
        
        if (!isNaN(currentProgress) && currentProgress >= 0) {
            this.goals[goalIndex].current = currentProgress;
            
            // Check if goal is completed
            if (currentProgress >= goal.target && goal.active) {
                this.goals[goalIndex].active = false;
                this.showNotification(`Goal "${goal.name}" completed! 🎉`, 'success');
            }
            
            this.saveGoals();
            this.renderGoals();
        }
    }

    editGoal(goalId) {
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return;
        
        const goal = this.goals[goalIndex];
        
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
                    <h3>Edit Goal</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="edit-goal-form">
                        <div class="form-group">
                            <label for="edit-goal-name">Goal Name</label>
                            <input type="text" id="edit-goal-name" value="${goal.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-goal-description">Description</label>
                            <textarea id="edit-goal-description" rows="3">${goal.description || ''}</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-goal-target">Target</label>
                                <input type="number" id="edit-goal-target" value="${goal.target}" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-goal-current">Current</label>
                                <input type="number" id="edit-goal-current" value="${goal.current}" min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="edit-goal-deadline">Deadline</label>
                            <input type="date" id="edit-goal-deadline" value="${goal.deadline || ''}">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="edit-goal-active" ${goal.active ? 'checked' : ''}>
                                Active Goal
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="imperial-btn">Update Goal</button>
                            <button type="button" class="imperial-btn-secondary close-modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = modal.querySelector('#edit-goal-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            this.goals[goalIndex] = {
                ...this.goals[goalIndex],
                name: document.getElementById('edit-goal-name').value,
                description: document.getElementById('edit-goal-description').value || '',
                target: parseInt(document.getElementById('edit-goal-target').value),
                current: parseInt(document.getElementById('edit-goal-current').value) || 0,
                deadline: document.getElementById('edit-goal-deadline').value || null,
                active: document.getElementById('edit-goal-active').checked
            };
            
            this.saveGoals();
            this.renderGoals();
            document.body.removeChild(modal);
            
            this.showNotification(`Goal "${this.goals[goalIndex].name}" updated!`);
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    deleteGoal(goalId) {
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return;
        
        const goalName = this.goals[goalIndex].name;
        
        if (confirm(`Delete goal "${goalName}"?`)) {
            this.goals.splice(goalIndex, 1);
            this.saveGoals();
            this.renderGoals();
            
            this.showNotification(`Goal "${goalName}" deleted`);
        }
    }

    // Helper Methods
    getFactionBreakdown() {
        const factions = {};
        this.collection.forEach(mini => {
            factions[mini.faction] = (factions[mini.faction] || 0) + 1;
        });
        return factions;
    }

    formatFaction(faction) {
        const factionNames = {
            'space_marines': 'Space Marines',
            'imperial_guard': 'Imperial Guard',
            'chaos': 'Chaos Space Marines',
            'aeldari': 'Aeldari',
            'ork': 'Orks',
            'necron': 'Necrons',
            'tyranid': 'Tyranids',
            'tau': 'T\'au Empire',
            'dark_eldar': 'Drukhari',
            'sisters': 'Adepta Sororitas',
            'custodes': 'Adeptus Custodes',
            'knights': 'Imperial Knights',
            'chaos_knights': 'Chaos Knights',
            'genestealer_cult': 'Genestealer Cults'
        };
        return factionNames[faction] || faction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatType(type) {
        const typeNames = {
            'infantry': 'Infantry',
            'vehicle': 'Vehicle',
            'monster': 'Monster',
            'character': 'Character',
            'beast': 'Beast',
            'flyer': 'Flyer',
            'fortification': 'Fortification'
        };
        return typeNames[type] || type.replace(/\b\w/g, l => l.toUpperCase());
    }

    formatStatus(status) {
        const statusNames = {
            'unpainted': 'Unpainted',
            'primed': 'Primed',
            'wip': 'Work in Progress',
            'painted': 'Painted',
            'based': 'Based',
            'display': 'Display Quality'
        };
        return statusNames[status] || status.replace(/\b\w/g, l => l.toUpperCase());
    }

    formatRole(role) {
        const roleNames = {
            'hq': 'HQ',
            'troops': 'Troops',
            'elites': 'Elites',
            'fast_attack': 'Fast Attack',
            'heavy_support': 'Heavy Support',
            'flyer': 'Flyer',
            'dedicated_transport': 'Dedicated Transport',
            'lord_of_war': 'Lord of War'
        };
        return roleNames[role] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getStatusIcon(status) {
        const icons = {
            'unpainted': '⬜',
            'primed': '⚪',
            'wip': '🟡',
            'painted': '✅',
            'based': '🎨',
            'display': '⭐'
        };
        return icons[status] || '❓';
    }

    formatKey(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        
        // Add keyframes for animations
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

// Initialize the collection tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tracker = new CollectionTracker();
    
    // Make tracker available globally for debugging
    window.warhammerTracker = tracker;
    
    // Initialize form with faction options
    const factionSelect = document.getElementById('mini-faction');
    if (factionSelect) {
        const factions = [
            'space_marines', 'imperial_guard', 'chaos', 'aeldari', 'ork',
            'necron', 'tyranid', 'tau', 'dark_eldar', 'sisters',
            'custodes', 'knights', 'chaos_knights', 'genestealer_cult'
        ];
        
        factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction;
            option.textContent = tracker.formatFaction(faction);
            factionSelect.appendChild(option);
        });
    }
    
    // Add CSS for missing elements if needed
    if (!document.getElementById('tracker-styles')) {
        const style = document.createElement('style');
        style.id = 'tracker-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 4px;
                font-family: 'Cinzel', serif;
                z-index: 10001;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                max-width: 300px;
            }
            
            .notification.success {
                background: rgba(27, 94, 32, 0.9);
                color: white;
                border: 1px solid #4caf50;
            }
            
            .notification.error {
                background: rgba(183, 28, 28, 0.9);
                color: white;
                border: 1px solid #b71c1c;
            }
            
            .notification.warning {
                background: rgba(255, 152, 0, 0.9);
                color: white;
                border: 1px solid #ff9800;
            }
            
            .notification.info {
                background: rgba(13, 71, 161, 0.9);
                color: white;
                border: 1px solid #0d47a1;
            }
            
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
});

// Add global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's' && window.warhammerTracker) {
        e.preventDefault();
        window.warhammerTracker.saveCollection();
        window.warhammerTracker.showNotification('Collection saved!');
    }
    
    if (e.ctrlKey && e.key === 'b' && window.warhammerTracker) {
        e.preventDefault();
        window.warhammerTracker.backupCollection();
    }
    
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});