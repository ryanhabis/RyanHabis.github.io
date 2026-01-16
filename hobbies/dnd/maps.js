// ===== BATTLE MAP FUNCTIONALITY =====
let tokens = [];
let selectedTokenType = 'player';
let gridSize = 40;
let gridEnabled = true;
let zoomLevel = 1.0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let mapOffset = { x: 0, y: 0 };

// Initialize the map
function initMap() {
    generateGrid();
    setupEventListeners();
    loadSavedMap();
    console.log("Map initialized successfully!");
}

// Generate the grid
function generateGrid() {
    const battleMap = document.getElementById('battleMap');
    battleMap.innerHTML = '';
    
    // Set grid size based on selection
    const gridSelect = document.getElementById('gridSize');
    gridSize = parseInt(gridSelect.value);
    
    // Calculate number of cells based on container size
    const containerWidth = 800; // Approximate width
    const containerHeight = 600;
    const cols = Math.floor(containerWidth / gridSize);
    const rows = Math.floor(containerHeight / gridSize);
    
    // Update CSS grid
    battleMap.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
    battleMap.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`;
    
    // Create grid cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = col;
            cell.dataset.y = row;
            
            // Add click event for placing tokens
            cell.addEventListener('click', (e) => {
                if (e.target.classList.contains('grid-cell')) {
                    placeToken(col, row, selectedTokenType);
                }
            });
            
            // Right-click to remove tokens
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                removeTokenAt(col, row);
            });
            
            battleMap.appendChild(cell);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Token selection
    document.querySelectorAll('.token').forEach(token => {
        token.addEventListener('click', function() {
            selectedTokenType = this.dataset.type;
            document.querySelectorAll('.token').forEach(t => t.style.borderColor = 'transparent');
            this.style.borderColor = 'white';
        });
    });
    
    // Control buttons
    document.getElementById('toggleGrid').addEventListener('click', function() {
        gridEnabled = !gridEnabled;
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style.border = gridEnabled ? '1px solid rgba(74, 144, 226, 0.3)' : 'none';
        });
        this.innerHTML = gridEnabled ? 
            '<i class="fas fa-th"></i> Grid: ON' : 
            '<i class="fas fa-th"></i> Grid: OFF';
        this.classList.toggle('active', gridEnabled);
    });
    
    document.getElementById('clearTokens').addEventListener('click', clearAllTokens);
    document.getElementById('saveMap').addEventListener('click', saveMap);
    
    // Grid size change
    document.getElementById('gridSize').addEventListener('change', generateGrid);
    
    // Grid color change
    document.getElementById('gridColor').addEventListener('input', function() {
        const color = this.value;
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.style.borderColor = `${color}80`; // 80 = 50% opacity
        });
    });
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => zoomMap(0.1));
    document.getElementById('zoomOut').addEventListener('click', () => zoomMap(-0.1));
    document.getElementById('centerMap').addEventListener('click', centerMap);
    
    // Mouse movement tracking
    document.getElementById('battleMap').addEventListener('mousemove', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / gridSize);
        const y = Math.floor((e.clientY - rect.top) / gridSize);
        document.getElementById('coordinates').textContent = `X: ${x}, Y: ${y}`;
    });
}

// Place a token on the map
function placeToken(x, y, type) {
    // Remove any existing token at this position
    removeTokenAt(x, y);
    
    // Create new token
    const tokenId = Date.now(); // Unique ID
    const token = {
        id: tokenId,
        x: x,
        y: y,
        type: type,
        name: `Token ${tokens.length + 1}`
    };
    
    tokens.push(token);
    
    // Create visual element
    const battleMap = document.getElementById('battleMap');
    const tokenElement = document.createElement('div');
    tokenElement.className = 'token-placed';
    tokenElement.id = `token-${tokenId}`;
    tokenElement.style.left = `${x * gridSize + gridSize/2}px`;
    tokenElement.style.top = `${y * gridSize + gridSize/2}px`;
    
    // Set color based on type
    const colors = {
        player: '#4CAF50',
        enemy: '#f44336',
        npc: '#2196F3',
        object: '#FF9800',
        obstacle: '#795548'
    };
    
    tokenElement.style.background = colors[type] || '#4CAF50';
    tokenElement.innerHTML = `<i class="fas fa-${getTokenIcon(type)}"></i>`;
    tokenElement.title = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Make token draggable
    makeDraggable(tokenElement, token);
    
    battleMap.appendChild(tokenElement);
    saveMap(); // Auto-save
}

// Get appropriate icon for token type
function getTokenIcon(type) {
    const icons = {
        player: 'user',
        enemy: 'skull',
        npc: 'user-friends',
        object: 'cube',
        obstacle: 'mountain'
    };
    return icons[type] || 'circle';
}

// Make tokens draggable
function makeDraggable(element, token) {
    let isDraggingToken = false;
    let offset = { x: 0, y: 0 };
    
    element.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        
        isDraggingToken = true;
        const rect = element.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        
        element.style.zIndex = '1000';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        e.preventDefault();
    });
    
    function onMouseMove(e) {
        if (!isDraggingToken) return;
        
        const battleMap = document.getElementById('battleMap');
        const rect = battleMap.getBoundingClientRect();
        
        // Calculate new position
        let x = e.clientX - rect.left - offset.x + gridSize/2;
        let y = e.clientY - rect.top - offset.y + gridSize/2;
        
        // Snap to grid
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
        
        // Keep within bounds
        x = Math.max(gridSize/2, Math.min(x, rect.width - gridSize/2));
        y = Math.max(gridSize/2, Math.min(y, rect.height - gridSize/2));
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        // Update token coordinates
        token.x = Math.floor(x / gridSize);
        token.y = Math.floor(y / gridSize);
    }
    
    function onMouseUp() {
        isDraggingToken = false;
        element.style.zIndex = '10';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saveMap(); // Auto-save after drag
    }
}

// Remove token at specific coordinates
function removeTokenAt(x, y) {
    const tokenIndex = tokens.findIndex(t => t.x === x && t.y === y);
    if (tokenIndex !== -1) {
        const token = tokens[tokenIndex];
        const tokenElement = document.getElementById(`token-${token.id}`);
        if (tokenElement) {
            tokenElement.remove();
        }
        tokens.splice(tokenIndex, 1);
        saveMap();
    }
}

// Clear all tokens
function clearAllTokens() {
    if (confirm('Are you sure you want to clear all tokens?')) {
        tokens = [];
        document.querySelectorAll('.token-placed').forEach(el => el.remove());
        saveMap();
    }
}

// Save map to localStorage
function saveMap() {
    const mapData = {
        tokens: tokens,
        gridSize: gridSize,
        gridEnabled: gridEnabled,
        zoomLevel: zoomLevel,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('battleMapData', JSON.stringify(mapData));
    console.log('Map saved successfully!');
    
    // Show save confirmation
    const saveBtn = document.getElementById('saveMap');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
    }, 1500);
}

// Load map from localStorage
function loadSavedMap() {
    const savedData = localStorage.getItem('battleMapData');
    if (savedData) {
        try {
            const mapData = JSON.parse(savedData);
            tokens = mapData.tokens || [];
            gridSize = mapData.gridSize || 40;
            gridEnabled = mapData.gridEnabled !== false;
            
            // Restore tokens
            tokens.forEach(token => {
                setTimeout(() => placeToken(token.x, token.y, token.type), 10);
            });
            
            console.log('Map loaded successfully!');
        } catch (e) {
            console.error('Error loading map:', e);
        }
    }
}

// Zoom functionality
function zoomMap(delta) {
    const battleMap = document.getElementById('battleMap');
    zoomLevel += delta;
    zoomLevel = Math.max(0.5, Math.min(2.0, zoomLevel)); // Clamp between 0.5x and 2x
    
    battleMap.style.transform = `scale(${zoomLevel})`;
    
    // Update token positions for zoom
    document.querySelectorAll('.token-placed').forEach(element => {
        const tokenId = element.id.replace('token-', '');
        const token = tokens.find(t => t.id.toString() === tokenId);
        if (token) {
            element.style.left = `${token.x * gridSize + gridSize/2}px`;
            element.style.top = `${token.y * gridSize + gridSize/2}px`;
        }
    });
}

// Center the map
function centerMap() {
    const battleMap = document.getElementById('battleMap');
    battleMap.style.transform = 'scale(1)';
    battleMap.style.transformOrigin = 'center center';
    zoomLevel = 1.0;
}

// Load pre-made maps WITH BACKGROUND IMAGES
function loadMap(mapType) {
    if (!confirm('Load this map? Current tokens will be cleared.')) return;
    
    clearAllTokens();
    
    // Map configurations with background images
    const maps = {
        tavern: {
            background: 'https://external-preview.redd.it/zFwMuMdfe798RbWrC6al5hjRYfa8orXYazZ2EWTs7MM.jpg?width=640&crop=smart&auto=webp&s=254503bca3864a1314b8041142a6f2e92898d7d7',
            tokens: [
                { x: 5, y: 5, type: 'object', name: 'Bar Counter' },
                { x: 8, y: 3, type: 'object', name: 'Fireplace' },
                { x: 3, y: 7, type: 'object', name: 'Table' },
                { x: 10, y: 7, type: 'object', name: 'Table' }
            ]
        },
        dungeon: {
            background: 'https://images.unsplash.com/photo-1546448396-6aef80193ceb?auto=format&fit=crop&w=800&q=80',
            tokens: [
                { x: 4, y: 4, type: 'enemy', name: 'Skeleton Guard' },
                { x: 12, y: 8, type: 'enemy', name: 'Zombie' },
                { x: 8, y: 12, type: 'object', name: 'Treasure Chest' },
                { x: 15, y: 3, type: 'obstacle', name: 'Pillar' }
            ]
        },
        forest: {
            background: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            tokens: [
                { x: 6, y: 6, type: 'obstacle', name: 'Large Tree' },
                { x: 12, y: 4, type: 'obstacle', name: 'Rock' },
                { x: 8, y: 10, type: 'obstacle', name: 'Fallen Log' },
                { x: 15, y: 8, type: 'enemy', name: 'Goblin Archer' }
            ]
        },
        spacehulk: {
            background: '', // No image, will use gradient
            tokens: [
                { x: 3, y: 3, type: 'obstacle', name: 'Console' },
                { x: 10, y: 3, type: 'obstacle', name: 'Crate' },
                { x: 15, y: 7, type: 'enemy', name: 'Genestealer' },
                { x: 8, y: 12, type: 'enemy', name: 'Genestealer' }
            ]
        }
    };
    
    const map = maps[mapType];
    if (!map) return;
    
    // Set background image
    const mapWrapper = document.querySelector('.map-wrapper');
    if (map.background) {
        mapWrapper.style.backgroundImage = `url('${map.background}')`;
        mapWrapper.style.backgroundSize = 'cover';
        mapWrapper.style.backgroundPosition = 'center';
        mapWrapper.style.backgroundRepeat = 'no-repeat';
    } else {
        // Fallback for maps without images
        mapWrapper.style.backgroundImage = 'none';
        mapWrapper.style.backgroundColor = '#1a1a2e';
    }
    
    // Place tokens
    map.tokens.forEach(tokenData => {
        setTimeout(() => {
            placeToken(tokenData.x, tokenData.y, tokenData.type);
        }, 100);
    });
    
    alert(`${mapType.charAt(0).toUpperCase() + mapType.slice(1)} map loaded!`);
}

// Measurement tools (simplified version)
document.getElementById('checkLoS')?.addEventListener('click', function() {
    if (tokens.length >= 2) {
        alert('Line of Sight: Checking between first two tokens...\n(This is a simplified demo)');
    } else {
        alert('Place at least two tokens to check line of sight.');
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initMap);