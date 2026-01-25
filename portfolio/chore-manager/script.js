// ============================================
// Household Chore Manager
// A complete chore management system with LocalStorage
// ============================================

// Constants
const STORAGE_KEY = 'choreManagerData_v2';
const ROTATION_INTERVAL_DAYS = 7;
const POINTS_MAP = { easy: 5, medium: 10, hard: 15 };

// Initial Data Structure
let state = {
    housemates: [
        { id: 1, name: "Alex", color: "#667eea", points: 0, completed: 0, lastActive: null },
        { id: 2, name: "Sam", color: "#f5576c", points: 0, completed: 0, lastActive: null },
        { id: 3, name: "Jordan", color: "#4cd964", points: 0, completed: 0, lastActive: null },
        { id: 4, name: "Taylor", color: "#f093fb", points: 0, completed: 0, lastActive: null }
    ],
    chores: [],
    nextChoreId: 1,
    settings: {
        autoRotate: true,
        lastRotation: null,
        lastSave: null,
        version: '2.0'
    },
    defaultChores: [
        { name: "Clean Bathroom", frequency: "weekly", difficulty: "hard", category: "bathroom" },
        { name: "Vacuum Living Room", frequency: "weekly", difficulty: "medium", category: "common" },
        { name: "Take Out Trash & Recycling", frequency: "daily", difficulty: "easy", category: "trash" },
        { name: "Clean Kitchen Counters", frequency: "daily", difficulty: "easy", category: "kitchen" },
        { name: "Mop All Floors", frequency: "biweekly", difficulty: "hard", category: "cleaning" },
        { name: "Dust Common Areas", frequency: "weekly", difficulty: "easy", category: "common" },
        { name: "Clean Refrigerator", frequency: "monthly", difficulty: "medium", category: "kitchen" },
        { name: "Wash Windows", frequency: "monthly", difficulty: "hard", category: "cleaning" }
    ]
};

// DOM Elements
let elements = {};

// Initialize Application
function init() {
    cacheElements();
    loadFromStorage();
    setupDefaultChores();
    renderAll();
    setupEventListeners();
    setupAutoSave();
    setupPeriodicSave();
    updateLastSavedDisplay();
}

// Cache DOM Elements
function cacheElements() {
    elements = {
        // Containers
        choresContainer: document.getElementById('chores-container'),
        housematesContainer: document.getElementById('housemates-container'),
        calendar: document.getElementById('calendar'),
        emptyState: document.getElementById('empty-state'),
        notificationContainer: document.getElementById('notification-container'),
        
        // Stats
        completedCount: document.getElementById('completed-count'),
        pendingCount: document.getElementById('pending-count'),
        rotationDay: document.getElementById('rotation-day'),
        totalPoints: document.getElementById('total-points'),
        lastSaved: document.getElementById('last-saved'),
        totalChores: document.getElementById('total-chores'),
        lastRotation: document.getElementById('last-rotation'),
        storageStatus: document.getElementById('storage-status'),
        
        // Buttons
        addChoreBtn: document.getElementById('add-chore-btn'),
        rotateBtn: document.getElementById('rotate-btn'),
        resetWeekBtn: document.getElementById('reset-week-btn'),
        exportBtn: document.getElementById('export-btn'),
        importBtn: document.getElementById('import-btn'),
        clearDataBtn: document.getElementById('clear-data-btn'),
        importFile: document.getElementById('import-file'),
        
        // Modal
        modal: document.getElementById('add-chore-modal'),
        closeModal: document.querySelector('.close-modal'),
        closeModalBtn: document.querySelector('.close-modal-btn'),
        choreForm: document.getElementById('chore-form'),
        
        // Filters
        filterButtons: document.querySelectorAll('.filter-btn')
    };
}

// ============================================
// DATA PERSISTENCE
// ============================================

function saveToStorage() {
    try {
        // Update last save timestamp
        state.settings.lastSave = new Date().toISOString();
        
        // Calculate days until next rotation
        if (state.settings.lastRotation) {
            const lastRotation = new Date(state.settings.lastRotation);
            const daysSinceRotation = Math.floor((new Date() - lastRotation) / (1000 * 60 * 60 * 24));
            state.settings.daysUntilRotation = Math.max(0, ROTATION_INTERVAL_DAYS - daysSinceRotation);
        }
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateLastSavedDisplay();
        
        return true;
    } catch (error) {
        console.error('Save failed:', error);
        showNotification('Failed to save data. Storage might be full.', 'error');
        return false;
    }
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            // Merge with current state, preserving defaults for new fields
            state = {
                ...state,
                ...data,
                housemates: data.housemates || state.housemates,
                chores: data.chores || state.chores,
                settings: { ...state.settings, ...(data.settings || {}) }
            };
            
            // Ensure all chores have required fields
            state.chores.forEach(chore => {
                if (!chore.points) {
                    chore.points = POINTS_MAP[chore.difficulty] || 10;
                }
                if (!chore.category) {
                    chore.category = 'other';
                }
            });
            
            showNotification('Data loaded from previous session!', 'success');
            console.log('Loaded data from:', new Date(state.settings.lastSave).toLocaleString());
        } else {
            console.log('No saved data found, using defaults');
        }
    } catch (error) {
        console.error('Load failed:', error);
        showNotification('Failed to load saved data.', 'error');
        // Keep default state
    }
}

function clearStorage() {
    if (confirm('This will permanently delete ALL saved data. Are you sure?')) {
        localStorage.removeItem(STORAGE_KEY);
        showNotification('All data cleared!', 'warning');
        
        // Reset to initial state
        state = {
            ...state,
            chores: [],
            nextChoreId: 1,
            housemates: state.housemates.map(h => ({ ...h, points: 0, completed: 0 }))
        };
        
        renderAll();
        saveToStorage();
    }
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderAll() {
    updateStats();
    renderHousemates();
    renderChores();
    renderCalendar();
    updateDataInfo();
}

function updateStats() {
    const completed = state.chores.filter(chore => chore.completed).length;
    const pending = state.chores.length - completed;
    const totalPoints = state.housemates.reduce((sum, h) => sum + h.points, 0);
    
    elements.completedCount.textContent = completed;
    elements.pendingCount.textContent = pending;
    elements.totalPoints.textContent = totalPoints;
    
    // Calculate days until next rotation
    let daysLeft = ROTATION_INTERVAL_DAYS;
    if (state.settings.lastRotation) {
        const lastRotation = new Date(state.settings.lastRotation);
        const daysSinceRotation = Math.floor((new Date() - lastRotation) / (1000 * 60 * 60 * 24));
        daysLeft = Math.max(0, ROTATION_INTERVAL_DAYS - daysSinceRotation);
    }
    elements.rotationDay.textContent = daysLeft;
    
    // Show/hide empty state
    elements.emptyState.style.display = state.chores.length === 0 ? 'block' : 'none';
}

function renderHousemates() {
    elements.housematesContainer.innerHTML = '';
    
    // Sort housemates by points (descending)
    const sortedHousemates = [...state.housemates].sort((a, b) => b.points - a.points);
    
    sortedHousemates.forEach(housemate => {
        const pendingChores = state.chores.filter(chore => 
            chore.assignedTo === housemate.id && !chore.completed
        ).length;
        
        const card = document.createElement('div');
        card.className = 'housemate-card';
        card.innerHTML = `
            <div class="housemate-avatar" style="background: ${housemate.color}">
                ${housemate.name.charAt(0)}
            </div>
            <div class="housemate-name">${housemate.name}</div>
            <div class="housemate-points">${housemate.points} pts</div>
            <div class="housemate-stats">
                <span>${housemate.completed} done</span>
                <span>•</span>
                <span>${pendingChores} pending</span>
            </div>
        `;
        elements.housematesContainer.appendChild(card);
    });
}

function renderChores(filter = 'all') {
    elements.choresContainer.innerHTML = '';
    
    let filteredChores = state.chores;
    
    // Apply filter
    switch(filter) {
        case 'pending':
            filteredChores = state.chores.filter(chore => !chore.completed);
            break;
        case 'completed':
            filteredChores = state.chores.filter(chore => chore.completed);
            break;
        case 'all':
        default:
            filteredChores = state.chores;
    }
    
    // Sort: pending first, then by difficulty
    filteredChores.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
    
    filteredChores.forEach(chore => {
        const housemate = state.housemates.find(h => h.id === chore.assignedTo);
        if (!housemate) return;
        
        const card = document.createElement('div');
        card.className = `chore-card ${chore.difficulty} ${chore.completed ? 'completed' : ''}`;
        card.dataset.id = chore.id;
        
        const frequencyIcon = getFrequencyIcon(chore.frequency);
        const categoryIcon = getCategoryIcon(chore.category);
        
        card.innerHTML = `
            <div class="chore-header">
                <div class="chore-title">${chore.name}</div>
                <div class="chore-meta">
                    <span class="chore-difficulty ${chore.difficulty}">
                        ${chore.difficulty.charAt(0).toUpperCase()}
                    </span>
                    <span class="chore-frequency">
                        <i class="fas fa-${frequencyIcon}"></i> ${chore.frequency}
                    </span>
                    <span class="chore-category">
                        <i class="fas fa-${categoryIcon}"></i> ${chore.category}
                    </span>
                </div>
            </div>
            
            <div class="assigned-to">
                <div class="avatar" style="background: ${housemate.color}">
                    ${housemate.name.charAt(0)}
                </div>
                <div class="assigned-info">
                    <h4>${housemate.name}</h4>
                    <p><i class="fas fa-star"></i> ${chore.points} points • Assigned ${formatDate(chore.assignedDate)}</p>
                </div>
            </div>
            
            <div class="chore-actions">
                ${chore.completed ? 
                    `<span class="completed-badge">
                        <i class="fas fa-check"></i> Completed ${formatDate(chore.completedDate)}
                    </span>` :
                    `<button class="complete-btn" onclick="completeChore(${chore.id})">
                        <i class="fas fa-check"></i> Mark Complete (+${chore.points} pts)
                    </button>`
                }
                <span class="chore-id">#${chore.id.toString().padStart(3, '0')}</span>
            </div>
        `;
        
        elements.choresContainer.appendChild(card);
    });
}

function renderCalendar() {
    elements.calendar.innerHTML = '';
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 6 : today - 1; // Adjust for Monday start
    
    days.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = `day ${index === adjustedToday ? 'day-today' : ''}`;
        
        // Assign different chore types to different days
        const dayChores = getChoresForDay(day);
        
        dayElement.innerHTML = `
            <div class="day-name">${day}</div>
            <div class="day-chore">${dayChores}</div>
            ${index === adjustedToday ? '<div class="day-chore">TODAY</div>' : ''}
        `;
        
        elements.calendar.appendChild(dayElement);
    });
}

function getChoresForDay(day) {
    const dayChores = {
        'Mon': 'Kitchen & Trash',
        'Tue': 'Common Areas',
        'Wed': 'Bathroom Focus',
        'Thu': 'Deep Cleaning',
        'Fri': 'Weekly Review',
        'Sat': 'Rotation Day',
        'Sun': 'Planning'
    };
    return dayChores[day] || 'Flex Day';
}

function updateDataInfo() {
    elements.totalChores.textContent = state.chores.length;
    
    if (state.settings.lastRotation) {
        const lastRotation = new Date(state.settings.lastRotation);
        elements.lastRotation.textContent = formatDate(lastRotation, true);
    } else {
        elements.lastRotation.textContent = 'Never';
    }
    
    // Check storage availability
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        elements.storageStatus.textContent = 'LocalStorage ✓';
    } catch (e) {
        elements.storageStatus.textContent = 'Limited (Private Browsing)';
    }
}

function updateLastSavedDisplay() {
    if (state.settings.lastSave) {
        const lastSave = new Date(state.settings.lastSave);
        const now = new Date();
        const diffMinutes = Math.floor((now - lastSave) / (1000 * 60));
        
        let displayText;
        if (diffMinutes < 1) {
            displayText = 'Just now';
        } else if (diffMinutes < 60) {
            displayText = `${diffMinutes}m ago`;
        } else {
            displayText = formatDate(lastSave, true);
        }
        
        elements.lastSaved.textContent = displayText;
    }
}

// ============================================
// CHORE MANAGEMENT
// ============================================

function setupDefaultChores() {
    // Only add default chores if no chores exist
    if (state.chores.length === 0) {
        state.defaultChores.forEach((defaultChore, index) => {
            const housemate = state.housemates[index % state.housemates.length];
            
            const chore = {
                id: state.nextChoreId++,
                name: defaultChore.name,
                assignedTo: housemate.id,
                completed: false,
                difficulty: defaultChore.difficulty,
                frequency: defaultChore.frequency,
                category: defaultChore.category,
                points: POINTS_MAP[defaultChore.difficulty],
                assignedDate: new Date().toISOString(),
                completedDate: null
            };
            
            state.chores.push(chore);
        });
        
        showNotification('Default chores added!', 'success');
        saveToStorage();
    }
}

function addChore(name, frequency, difficulty, category, assignTo = 'auto') {
    // Determine who to assign to
    let assignedTo;
    if (assignTo === 'auto') {
        // Find housemate with least points
        const leastPoints = Math.min(...state.housemates.map(h => h.points));
        const candidates = state.housemates.filter(h => h.points === leastPoints);
        assignedTo = candidates[Math.floor(Math.random() * candidates.length)].id;
    } else {
        assignedTo = parseInt(assignTo);
    }
    
    const newChore = {
        id: state.nextChoreId++,
        name,
        assignedTo,
        completed: false,
        difficulty,
        frequency,
        category,
        points: POINTS_MAP[difficulty],
        assignedDate: new Date().toISOString(),
        completedDate: null
    };
    
    state.chores.push(newChore);
    renderAll();
    saveToStorage();
    
    showNotification(`"${name}" added!`, 'success');
    return newChore;
}

function completeChore(id) {
    const choreIndex = state.chores.findIndex(chore => chore.id === id);
    if (choreIndex === -1) return;
    
    const chore = state.chores[choreIndex];
    if (chore.completed) return;
    
    // Mark as completed
    chore.completed = true;
    chore.completedDate = new Date().toISOString();
    
    // Update housemate
    const housemateIndex = state.housemates.findIndex(h => h.id === chore.assignedTo);
    if (housemateIndex !== -1) {
        state.housemates[housemateIndex].points += chore.points;
        state.housemates[housemateIndex].completed += 1;
        state.housemates[housemateIndex].lastActive = new Date().toISOString();
    }
    
    renderAll();
    saveToStorage();
    
    // Check if all chores are completed
    const allCompleted = state.chores.every(c => c.completed);
    if (allCompleted) {
        setTimeout(() => {
            showNotification('🎉 All chores completed this week! Great job!', 'success');
        }, 500);
    }
}

function rotateAssignments() {
    if (state.chores.length === 0) {
        showNotification('No chores to rotate!', 'warning');
        return;
    }
    
    // Create a rotation schedule
    const shuffledHousemates = [...state.housemates].sort(() => Math.random() - 0.5);
    let housemateIndex = 0;
    
    // Only rotate pending chores
    state.chores.forEach(chore => {
        if (!chore.completed) {
            chore.assignedTo = shuffledHousemates[housemateIndex].id;
            chore.assignedDate = new Date().toISOString();
            housemateIndex = (housemateIndex + 1) % shuffledHousemates.length;
        }
    });
    
    state.settings.lastRotation = new Date().toISOString();
    renderAll();
    saveToStorage();
    
    showNotification('Chores rotated! New assignments set.', 'success');
}

function resetWeek() {
    if (state.chores.length === 0) {
        showNotification('No chores to reset!', 'warning');
        return;
    }
    
    if (confirm('Reset all chores to pending?\n\nCompleted points will be kept, but chore completion will be reset.')) {
        // Create backup
        const backup = {
            chores: JSON.parse(JSON.stringify(state.chores)),
            timestamp: new Date().toISOString()
        };
        
        // Reset chores
        state.chores.forEach(chore => {
            chore.completed = false;
            chore.completedDate = null;
            // Keep assignedTo and assignedDate
        });
        
        renderAll();
        saveToStorage();
        
        showNotification('Week reset! All chores are now pending.', 'success');
        
        // Offer restore option
        setTimeout(() => {
            if (confirm('Changed your mind? You can restore the previous state for 30 seconds.')) {
                state.chores = backup.chores;
                renderAll();
                saveToStorage();
                showNotification('Previous state restored!', 'success');
            }
        }, 10000);
    }
}

// ============================================
// IMPORT/EXPORT
// ============================================

function exportData() {
    try {
        const exportData = {
            ...state,
            exportDate: new Date().toISOString(),
            exportVersion: '2.0',
            totalChores: state.chores.length,
            totalPoints: state.housemates.reduce((sum, h) => sum + h.points, 0)
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chore-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Failed to export data.', 'error');
        return false;
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!confirm('This will replace ALL current data. Are you sure?')) {
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData.housemates || !importedData.chores) {
                throw new Error('Invalid file format');
            }
            
            // Merge data
            state = {
                ...state,
                ...importedData,
                settings: { ...state.settings, ...(importedData.settings || {}) }
            };
            
            // Reset file input
            event.target.value = '';
            
            // Re-render everything
            renderAll();
            saveToStorage();
            
            showNotification('Data imported successfully!', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Failed to import data. File may be corrupted.', 'error');
            event.target.value = '';
        }
    };
    reader.onerror = function() {
        showNotification('Failed to read file.', 'error');
        event.target.value = '';
    };
    reader.readAsText(file);
}

// ============================================
// EVENT HANDLERS & UTILITIES
// ============================================

function setupEventListeners() {
    // Modal handling
    elements.addChoreBtn.addEventListener('click', () => {
        elements.modal.style.display = 'flex';
    });
    
    elements.closeModal.addEventListener('click', closeModal);
    elements.closeModalBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
    
    // Form submission
    elements.choreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('chore-name').value.trim();
        const frequency = document.getElementById('chore-frequency').value;
        const difficulty = document.getElementById('chore-difficulty').value;
        const category = document.getElementById('chore-category').value;
        const assignTo = document.getElementById('assign-to').value;
        
        if (!name) {
            showNotification('Please enter a chore name', 'error');
            return;
        }
        
        addChore(name, frequency, difficulty, category, assignTo);
        elements.choreForm.reset();
        closeModal();
    });
    
    // Action buttons
    elements.rotateBtn.addEventListener('click', rotateAssignments);
    elements.resetWeekBtn.addEventListener('click', resetWeek);
    elements.exportBtn.addEventListener('click', exportData);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', importData);
    elements.clearDataBtn.addEventListener('click', clearStorage);
    
    // Filter buttons
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            elements.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter
            renderChores(btn.dataset.filter);
        });
    });
    
    // Auto-rotate check
    checkAutoRotation();
}

function closeModal() {
    elements.modal.style.display = 'none';
    elements.choreForm.reset();
}

function setupAutoSave() {
    // Wrap functions to auto-save
    const functionsToWrap = ['addChore', 'completeChore', 'rotateAssignments', 'resetWeek'];
    
    functionsToWrap.forEach(funcName => {
        const originalFunc = window[funcName];
        window[funcName] = function(...args) {
            const result = originalFunc.apply(this, args);
            saveToStorage();
            return result;
        };
    });
}

function setupPeriodicSave() {
    // Save every 30 seconds
    setInterval(saveToStorage, 30000);
    
    // Save when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) saveToStorage();
    });
    
    // Save before page unload
    window.addEventListener('beforeunload', saveToStorage);
}

function checkAutoRotation() {
    if (!state.settings.autoRotate || !state.settings.lastRotation) return;
    
    const lastRotation = new Date(state.settings.lastRotation);
    const daysSinceRotation = Math.floor((new Date() - lastRotation) / (1000 * 60 * 60 * 24));
    
    if (daysSinceRotation >= ROTATION_INTERVAL_DAYS) {
        // Auto-rotate if all chores are completed
        const allCompleted = state.chores.every(c => c.completed);
        if (allCompleted && state.chores.length > 0) {
            setTimeout(() => {
                if (confirm('Weekly rotation time! Rotate all chores?')) {
                    rotateAssignments();
                }
            }, 1000);
        }
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="notification-content">
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <p>${message}</p>
        </div>
    `;
    
    elements.notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function formatDate(dateString, short = false) {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (short) {
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getFrequencyIcon(frequency) {
    const icons = {
        daily: 'calendar-day',
        weekly: 'calendar-week',
        biweekly: 'calendar-alt',
        monthly: 'calendar'
    };
    return icons[frequency] || 'calendar';
}

function getCategoryIcon(category) {
    const icons = {
        cleaning: 'broom',
        kitchen: 'utensils',
        bathroom: 'bath',
        trash: 'trash-alt',
        common: 'home',
        other: 'tag'
    };
    return icons[category] || 'tag';
}

// ============================================
// INITIALIZATION
// ============================================

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make functions globally available for inline handlers
window.completeChore = completeChore;
window.rotateAssignments = rotateAssignments;
window.addChore = addChore;
window.exportData = exportData;