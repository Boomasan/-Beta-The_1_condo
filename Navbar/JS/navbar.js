let currentLang = 'th';

// Language toggle functionality
document.getElementById('langToggle').addEventListener('click', function() {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    this.textContent = currentLang === 'th' ? 'EN' : 'TH';

    // Update all menu items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.textContent = item.getAttribute('data-' + currentLang);
    });

    // Add click animation
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
        this.style.transform = 'scale(1.05)';
    }, 100);
});

// Add interactive functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.style.background = 'rgba(93, 64, 55, 0.8)';
        });

        // Add active state to clicked item
        this.style.background = 'rgba(93, 64, 55, 1)';

        console.log('Navigating to:', this.textContent);
    });
});

// Profile button click handler
document.querySelector('.profile-btn').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1.1)';
    }, 100);

    console.log('Profile menu clicked');
});

// Add smooth scroll effect on page load
window.addEventListener('load', function() {
    const navbar = document.querySelector('.navbar');
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.8s ease';

    setTimeout(() => {
        navbar.style.transform = 'translateY(0)';
    }, 100);
});
