document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Highlight active nav link
(function highlightActiveNav(){
    const nav = document.getElementById('primaryNav');
    if (!nav) return;
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    nav.querySelectorAll('a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.endsWith(current)) {
            a.classList.add('active');
        }
    });
})();

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

// Close mobile nav on link click
const navLinks = primaryNav ? primaryNav.querySelectorAll('a') : [];
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (primaryNav.classList.contains('open')) {
            primaryNav.classList.remove('open');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

// Contact form handling with Formspree
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    // Function to reset button state
    function resetButtonState() {
        console.log('Resetting button state...');
        if (submitBtn && btnText && btnLoading) {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            console.log('Button state reset successfully');
        } else {
            console.error('Some button elements not found:', { submitBtn, btnText, btnLoading });
        }
    }

    // Function to set loading state
    function setLoadingState() {
        console.log('Setting loading state...');
        if (submitBtn && btnText && btnLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            console.log('Loading state set successfully');
        } else {
            console.error('Some button elements not found:', { submitBtn, btnText, btnLoading });
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        setLoadingState();
        if (formMessage) formMessage.classList.add('hidden');
        
        // Get form data
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                // Error
                try {
                    const errorData = await response.json();
                    showMessage('Sorry, there was an error sending your message. Please try again or email me directly.', 'error');
                    console.error('Formspree error:', errorData);
                } catch (parseError) {
                    showMessage('Sorry, there was an error sending your message. Please try again or email me directly.', 'error');
                    console.error('Formspree response error:', response.status, response.statusText);
                }
            }
        } catch (error) {
            // Network error
            showMessage('Network error. Please check your connection and try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Always reset button state
            resetButtonState();
        }
    });
    
    function showMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `mt-4 p-4 rounded-lg ${
            type === 'success' 
                ? 'bg-green-900/20 border border-green-500/30 text-green-300' 
                : 'bg-red-900/20 border border-red-500/30 text-red-300'
        }`;
        formMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (formMessage) formMessage.classList.add('hidden');
        }, 5000);
    }
}

// Projects filtering (only runs if filter controls exist)
const filterContainer = document.querySelector('[data-filter-container]');
if (filterContainer) {
    const filterButtons = /** @type {NodeListOf<HTMLButtonElement>} */(filterContainer.querySelectorAll('[data-filter]'));
    const projectItems = /** @type {NodeListOf<HTMLElement>} */(document.querySelectorAll('[data-category]'));

    const applyFilter = (category) => {
        projectItems.forEach(card => {
            const match = category === 'all' || card.dataset.category === category;
            card.style.display = match ? '' : 'none';
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });
}
