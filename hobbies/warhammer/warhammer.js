// Enhanced Navigation Manager for Warhammer Website
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
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Check if it's an anchor link on the current page
                if (href.startsWith('#') && this.isOnMainPage()) {
                    e.preventDefault();
                    this.handleAnchorLink(href, link);
                }
                // Check if it's a link to the same page (different anchor)
                else if (href.includes('.html') && !this.isLinkToDifferentPage(href)) {
                    // It's a link to another section on the same page
                    if (href.includes('#')) {
                        e.preventDefault();
                        const [page, anchor] = href.split('#');
                        if (page === '' || page.includes(this.currentPage)) {
                            this.handleAnchorLink('#' + anchor, link);
                        }
                    }
                }
                // For all other links (to other HTML files), let browser handle normally
            });
        });
    }

    isOnMainPage() {
        return this.currentPage === 'warhammer' || 
               window.location.pathname.includes('warhammer.html') ||
               window.location.pathname.endsWith('/warhammer');
    }

    isLinkToDifferentPage(href) {
        // Check if href points to a different HTML file
        if (!href.includes('.html')) return false;
        
        const linkedPage = href.split('/').pop().replace('.html', '');
        return linkedPage !== this.currentPage;
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
            
            // Check if this link is for the current page/section
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
            // Check if it's the main page link without anchor
            if (href === '#' || href === '' || href === 'warhammer.html') {
                return window.location.hash === '' || window.location.hash === '#';
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
            
            // Also highlight the "home" link if at top
            if (window.pageYOffset < 100) {
                const homeLink = document.querySelector('.nav-link[href="#"], .nav-link[href="#home"], .nav-link[href="warhammer.html"]');
                if (homeLink) {
                    anchorLinks.forEach(l => l.classList.remove('active'));
                    homeLink.classList.add('active');
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code (keep dice roller, army cards, etc.) ...
    
    // Initialize navigation manager
    const navManager = new NavigationManager();
    
    // ... rest of your existing code ...
});