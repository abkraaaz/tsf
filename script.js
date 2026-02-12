/* ============================================
   GLOBAL VARIABLES & SETUP
   ============================================ */

let currentGalleryIndex = 0;
let autoSlideInterval;
let isGalleryAnimating = false;
let isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isGalleryPaused = false;
let pollIndex = 0;
let spinWheelNames = ['Najiya', 'Naziya', 'Zara', 'Sophia', 'Emma', 'Ananya'];

// Crush names for spin game
const crushNames = ['Najiya ❤️', 'Naziya 💕', 'Zara ✨', 'Sophia 🌟', 'Emma 💖', 'Ananya 💝'];

// Poll Questions Data
const pollQuestions = [
    {
        question: "What's your favorite color?",
        options: ["Pink", "Purple", "Blue", "Red"],
    },
    {
        question: "How do you celebrate birthdays?",
        options: ["Family Gathering", "Friends Party", "Quiet Celebration", "Adventure"],
    },
    {
        question: "What's your favorite birthday gift?",
        options: ["Gift Card", "Experience", "Personal Gift", "Free Time"],
    },
    {
        question: "How important is your birthday?",
        options: ["Very Important", "Somewhat Important", "Not Much", "Special"],
    },
];

/* ============================================
   PRELOADER HIDE
   ============================================ */

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
    }, 2000);
});

/* ============================================
   INIT FUNCTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupCanvasEffects();
    initHearWave();
    initFirecrackers();
    initGallery();
    setupMessageWall();
    setupPolls();
    setupBackgroundMusic();
    setupClickSparkles();
    setupScrollAnimations();
    setupSocialButtons();
    setupSpecialGiftSection();
}

/* ============================================
   CANVAS & PARTICLE EFFECTS
   ============================================ */

function setupCanvasEffects() {
    const canvas = document.getElementById('effectsCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    // Particle class for sparkles and explosions
    class Particle {
        constructor(x, y, angle, color = '#FF69B4', size = 4, life = 40) {
            this.x = x;
            this.y = y;
            this.vx = Math.cos(angle) * 5;
            this.vy = Math.sin(angle) * 5;
            this.color = color;
            this.size = size;
            this.life = life;
            this.maxLife = life;
            this.gravity = 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.life -= 1;
            this.size *= 0.98;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Add particles on click
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            // reduce sparkles on mobile for performance
            if (isMobileDevice) {
                // fewer sparkles on mobile
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI * 2 * i) / 6;
                    particles.push(new Particle(e.clientX, e.clientY, angle, ['#FFD700', '#FF69B4', '#00FFFF', '#FF1493', '#FFB6C1'][Math.floor(Math.random() * 5)], 3, 28));
                }
            } else {
                createSparklesAtPoint(e.clientX, e.clientY, particles);
            }
        }
    });

    // Double tap for floating hearts
    let lastTap = 0;
    document.addEventListener('click', (e) => {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            // smaller explosion on mobile
            if (isMobileDevice) {
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 * i) / 5;
                    particles.push(new Particle(e.clientX, e.clientY, angle, '#FF1493', 4, 40));
                }
            } else {
                createHeartExplosion(e.clientX, e.clientY, particles);
            }
        }
        lastTap = currentTime;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.createSparklesAtPoint = (x, y, particleArray) => {
        const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#FF1493', '#FFB6C1'];
        const count = isMobileDevice ? 6 : 12;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            particleArray.push(new Particle(x, y, angle, colors[Math.floor(Math.random() * colors.length)], 3, isMobileDevice ? 28 : 35));
        }
    };

    window.createHeartExplosion = (x, y, particleArray) => {
        const count = isMobileDevice ? 5 : 8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            particleArray.push(new Particle(x, y, angle, '#FF1493', isMobileDevice ? 4 : 5, isMobileDevice ? 40 : 50));
        }
    };
}

/* ============================================
   HEART RAIN EFFECT
   ============================================ */

function initHearWave() {
    const rainContainer = document.getElementById('heartRain');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = (-30 - Math.random() * 50) + 'px';
        // smaller hearts on mobile
        heart.style.fontSize = (isMobileDevice ? (Math.random() * 10 + 8) : (Math.random() * 15 + 10)) + 'px';
        heart.style.opacity = isMobileDevice ? (Math.random() * 0.5 + 0.4) : (Math.random() * 0.5 + 0.3);
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '4';
        const duration = Math.random() * 8 + 10;
        heart.style.animation = `heartFall ${duration}s linear forwards`;
        
        rainContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), duration * 1000);
    }

    // Add CSS animation for heart fall
    if (!document.getElementById('heartRainStyle')) {
        const style = document.createElement('style');
        style.id = 'heartRainStyle';
        style.textContent = `
            @keyframes heartFall {
                0% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0.5;
                }
                10% {
                    opacity: 0.7;
                }
                90% {
                    opacity: 0.5;
                }
                to {
                    transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
            @keyframes heartSway {
                0%, 100% { transform: translateX(0px); }
                50% { transform: translateX(30px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Create hearts continuously (throttle on mobile)
    setInterval(createHeart, isMobileDevice ? 700 : 300);
}

/* ============================================
   FIRECRACKER ANIMATION
   ============================================ */

function initFirecrackers() {
    const container = document.getElementById('firecrackerContainer');
    
    // Initial firecracker burst
    function createFirecracker() {
        const colors = ['#FF1493', '#FFD700', '#00FFFF', '#FF6347', '#32CD32'];
        const firecracker = document.createElement('div');
        
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * (window.innerHeight * 0.5);
        
        firecracker.style.position = 'absolute';
        firecracker.style.left = randomX + 'px';
        firecracker.style.top = randomY + 'px';
        firecracker.style.width = '5px';
        firecracker.style.height = '5px';
        firecracker.style.borderRadius = '50%';
        firecracker.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        firecracker.style.boxShadow = `0 0 10px ${firecracker.style.backgroundColor}`;
        firecracker.style.animation = 'fireExplosion 1.5s ease-out forwards';
        firecracker.style.pointerEvents = 'none';
        
        container.appendChild(firecracker);
        setTimeout(() => firecracker.remove(), 1500);
    }

    // Add firecracker animation
    if (!document.getElementById('firecrackerStyle')) {
        const style = document.createElement('style');
        style.id = 'firecrackerStyle';
        style.textContent = `
            @keyframes fireExplosion {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create initial burst
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createFirecracker(), i * 50);
    }

    // Create periodic firecrackers
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFirecracker();
        }
    }, 2000);
}

/* ============================================
   SPARKLE EFFECT ON CLICK
   ============================================ */

function setupClickSparkles() {
    document.addEventListener('click', (e) => {
        const particlesCanvas = document.getElementById('particlesCanvas');
        if (particlesCanvas) {
            const particles = particlesCanvas.parentElement;
        }
    });
}

/* ============================================
   GALLERY FUNCTIONALITY
   ============================================ */

function initGallery() {
    const slides = document.querySelectorAll('.gallery-slide');
    const slideContainer = document.getElementById('gallerySlides');
    const indicatorsContainer = document.getElementById('galleryIndicators');

    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `gallery-indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    // Auto slide
    function autoSlide() {
        if (!isGalleryPaused) {
            currentGalleryIndex = (currentGalleryIndex + 1) % slides.length;
            updateGallerySlide();
        }
    }

    autoSlideInterval = setInterval(autoSlide, 5000);

    // Touch support for mobile
    let touchStartX = 0;
    slideContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        isGalleryPaused = true;
        clearInterval(autoSlideInterval);
    }, false);

    slideContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            slideGallery(1);
        } else if (touchEndX - touchStartX > 50) {
            slideGallery(-1);
        }
        isGalleryPaused = false;
        autoSlideInterval = setInterval(autoSlide, 5000);
    }, false);

    // Pause on click-hold
    slideContainer.addEventListener('mousedown', () => {
        isGalleryPaused = true;
        clearInterval(autoSlideInterval);
    });

    slideContainer.addEventListener('mouseup', () => {
        isGalleryPaused = false;
        autoSlideInterval = setInterval(autoSlide, 5000);
    });

    slideContainer.addEventListener('mouseleave', () => {
        isGalleryPaused = false;
        autoSlideInterval = setInterval(autoSlide, 5000);
    });
}

function slideGallery(direction) {
    const slides = document.querySelectorAll('.gallery-slide');
    currentGalleryIndex = (currentGalleryIndex + direction + slides.length) % slides.length;
    updateGallerySlide();
}

function updateGallerySlide() {
    const slides = document.querySelectorAll('.gallery-slide');
    const slideContainer = document.getElementById('gallerySlides');
    const indicators = document.querySelectorAll('.gallery-indicator');

    // prevent overlapping animations
    if (isGalleryAnimating) return;
    isGalleryAnimating = true;

    // use translate3d for GPU acceleration and smoother animation
    window.requestAnimationFrame(() => {
        slideContainer.style.willChange = 'transform';
        slideContainer.style.transform = `translate3d(-${currentGalleryIndex * 100}%, 0, 0)`;
    });

    indicators.forEach((ind, index) => {
        ind.classList.toggle('active', index === currentGalleryIndex);
    });

    // read computed transition duration from CSS (fallback to 600ms)
    const computed = window.getComputedStyle(slideContainer).transitionDuration || '0.6s';
    let durationMs = 600;
    try {
        if (computed.includes('ms')) durationMs = parseFloat(computed);
        else if (computed.includes('s')) durationMs = parseFloat(computed) * 1000;
    } catch (e) { durationMs = 600; }

    // ensure a small buffer
    setTimeout(() => {
        isGalleryAnimating = false;
        slideContainer.style.willChange = 'auto';
    }, durationMs + 50);
}

function closeGalleryFullscreen() {
    const modal = document.getElementById('galleryFullscreen');
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

/* ============================================
   MESSAGE WALL - FIREBASE
   ============================================ */

function setupMessageWall() {
    const charCountSpan = document.getElementById('charCount');
    const messageTextarea = document.getElementById('userMessage');
    const submitBtn = document.getElementById('submitMessage');
    const messagesContainer = document.getElementById('messagesContainer');

    messageTextarea.addEventListener('input', (e) => {
        charCountSpan.textContent = e.target.value.length;
    });

    submitBtn.addEventListener('click', submitMessage);

    messageTextarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitMessage();
        }
    });

    // Load messages from Firebase
    loadMessagesFromFirebase();
}

function submitMessage() {
    const nameInput = document.getElementById('userName');
    const messageInput = document.getElementById('userMessage');
    const submitBtn = document.getElementById('submitMessage');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        alert('Please fill in all fields!');
        return;
    }

    if (message.length > 200) {
        alert('Message is too long! Max 200 characters.');
        return;
    }

    // Save to Firebase
    saveMessageToFirebase(name, message);

    // Clear inputs
    nameInput.value = '';
    messageInput.value = '';
    document.getElementById('charCount').textContent = '0';

    // Show success message
    submitBtn.textContent = 'Sent! ✨';
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.textContent = 'Send Wishes ❤️';
        submitBtn.disabled = false;
    }, 2000);
}

function loadMessagesFromFirebase() {
    const messagesContainer = document.getElementById('messagesContainer');
    
    // Try to load from localStorage if Firebase is not available
    const savedMessages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    
    if (savedMessages.length === 0) {
        messagesContainer.innerHTML = '<div class="messages-empty">No messages yet. Be the first to send wishes! 💌</div>';
    } else {
        displayMessages(savedMessages);
    }
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    // Ensure messages sorted by timestamp ascending
    const sorted = messages.slice().sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    // Latest 10 messages
    const latest = sorted.slice(-10).reverse(); // newest first
    const remaining = sorted.slice(0, Math.max(0, sorted.length - 10));

    // Create slider wrapper
    const slider = document.createElement('div');
    slider.className = 'messages-slider';

    const slidesWrapper = document.createElement('div');
    slidesWrapper.className = 'messages-slides';

    latest.forEach((msg, idx) => {
        const slide = document.createElement('div');
        slide.className = 'message-slide';

        const timestamp = new Date(msg.timestamp);
        const timeStr = timestamp.toLocaleString();

        slide.innerHTML = `
            <div class="message-card">
                <div class="message-card-name">${escapeHtml(msg.name)}</div>
                <div class="message-card-text">${escapeHtml(msg.message)}</div>
                <div class="message-card-time">${timeStr}</div>
            </div>
        `;

        slidesWrapper.appendChild(slide);
    });

    slider.appendChild(slidesWrapper);

    // Controls
    const prevBtn = document.createElement('button');
    prevBtn.className = 'messages-prev';
    prevBtn.textContent = '❮';
    prevBtn.onclick = () => slideMessage(-1);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'messages-next';
    nextBtn.textContent = '❯';
    nextBtn.onclick = () => slideMessage(1);

    slider.appendChild(prevBtn);
    slider.appendChild(nextBtn);

    // Indicators
    const indicators = document.createElement('div');
    indicators.className = 'messages-indicators';
    latest.forEach((_, i) => {
        const ind = document.createElement('div');
        ind.className = `messages-indicator ${i === 0 ? 'active' : ''}`;
        ind.onclick = () => goToMessageSlide(i);
        indicators.appendChild(ind);
    });
    slider.appendChild(indicators);

    messagesContainer.appendChild(slider);

    // If there are remaining messages, add a button to view all
    if (remaining.length > 0) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'messages-more-btn';
        moreBtn.textContent = `View all messages (${remaining.length})`;
        moreBtn.onclick = () => openMessagesModal(remaining.concat(latest.slice().reverse()));
        messagesContainer.appendChild(moreBtn);
    }

    // Message slider state
    window._messageSliderIndex = 0;
    if (window._messageSlideInterval) clearInterval(window._messageSlideInterval);
    window._messageSlideInterval = setInterval(() => {
        slideMessage(1);
    }, 5000);

    // helper functions
    function slideMessage(direction) {
        const slides = slidesWrapper.children;
        const len = slides.length;
        window._messageSliderIndex = (window._messageSliderIndex + direction + len) % len;
        slidesWrapper.style.transform = `translate3d(-${window._messageSliderIndex * 100}%,0,0)`;
        const inds = document.querySelectorAll('.messages-indicator');
        inds.forEach((el, idx) => el.classList.toggle('active', idx === window._messageSliderIndex));
    }

    // Expose for controls
    window.slideMessage = (dir) => slideMessage(dir);
    window.goToMessageSlide = (i) => {
        window._messageSliderIndex = i;
        slidesWrapper.style.transform = `translate3d(-${i * 100}%,0,0)`;
        document.querySelectorAll('.messages-indicator').forEach((el, idx) => el.classList.toggle('active', idx === i));
    };

    // Modal to show all messages
    window.openMessagesModal = (allMessages) => {
        let modal = document.getElementById('messagesModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'messagesModal';
            modal.className = 'messages-modal';
            modal.innerHTML = `
                <div class="messages-modal-content">
                    <button class="messages-modal-close" onclick="closeMessagesModal()">✕</button>
                    <h3 class="messages-modal-title">All Messages</h3>
                    <div class="messages-modal-list"></div>
                </div>`;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeMessagesModal(); });
        }
        const list = modal.querySelector('.messages-modal-list');
        list.innerHTML = '';
        allMessages.slice().reverse().forEach(msg => {
            const item = document.createElement('div');
            item.className = 'message-card';
            const timeStr = new Date(msg.timestamp).toLocaleString();
            item.innerHTML = `
                <div class="message-card-name">${escapeHtml(msg.name)}</div>
                <div class="message-card-text">${escapeHtml(msg.message)}</div>
                <div class="message-card-time">${timeStr}</div>
            `;
            list.appendChild(item);
        });
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.closeMessagesModal = () => {
        const modal = document.getElementById('messagesModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    };
}

function saveMessageToFirebase(name, message) {
    const newMessage = {
        name: name,
        message: message,
        timestamp: new Date().getTime()
    };

    let messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
    messages.push(newMessage);
    localStorage.setItem('birthdayMessages', JSON.stringify(messages));

    // Trigger Firebase save if available
    if (typeof saveMessageToDatabase === 'function') {
        saveMessageToDatabase(newMessage);
    }

    loadMessagesFromFirebase();
    createConfetti();
}

function deleteMessage(index) {
    if (confirm('Delete this message?')) {
        let messages = JSON.parse(localStorage.getItem('birthdayMessages')) || [];
        messages.splice(messages.length - 1 - index, 1);
        localStorage.setItem('birthdayMessages', JSON.stringify(messages));
        loadMessagesFromFirebase();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ============================================
   VALENTINE SECTION - GAMES
   ============================================ */

function switchValentineTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.valentine-tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.valentine-tab').forEach(el => {
        el.classList.remove('active');
    });

    // Show selected tab
    const tabId = tab === 'calculator' ? 'calculatorTab' : 
                  tab === 'flames' ? 'flamesTab' : 'spinTab';
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchValentineTab('${tab}')"]`).classList.add('active');
}

// LOVE CALCULATOR
function calculateLove() {
    const name1 = document.getElementById('name1').value.trim().toLowerCase();
    const name2 = document.getElementById('name2').value.trim().toLowerCase();
    const resultContainer = document.getElementById('loveResult');

    if (!name1 || !name2) {
        resultContainer.innerHTML = '<p style="color: #d946ef;">Please enter both names!</p>';
        return;
    }

    let percentage = 0;

    // Special cases
    if ((name1 === 'taushif' && (name2 === 'najiya' || name2 === 'naziya')) ||
        (name2 === 'taushif' && (name1 === 'najiya' || name1 === 'naziya'))) {
        percentage = 1000;
    } else if (name1 === 'taushif' || name2 === 'taushif') {
        percentage = 99;
    } else {
        // Calculate based on combined letters
        const combined = name1 + name2;
        let sum = 0;
        for (let char of combined) {
            sum += char.charCodeAt(0);
        }
        percentage = (sum % 100) + 1;
    }

    // Create heart explosions
    createHeartExplosionEffect();

    // Track game activity
    trackGameActivity('Love Calculator', {
        name1: name1,
        name2: name2,
        result: percentage,
        timestamp: new Date().toLocaleString()
    });

    resultContainer.innerHTML = `
        <div class="love-percentage">${percentage}%</div>
        <div class="love-message">${getLoveMessage(percentage)}</div>
    `;
}

function getLoveMessage(percentage) {
    if (percentage === 1000) return "❤️ PERFECT MATCH! Made in heaven! ❤️";
    if (percentage >= 90) return "💕 Soulmates! Very high compatibility!";
    if (percentage >= 75) return "💖 Great match! Strong connection!";
    if (percentage >= 50) return "💗 Good potential! Worth exploring!";
    if (percentage >= 25) return "💝 Some spark! Keep trying!";
    return "💔 Maybe try again with someone else!";
}

function createHeartExplosionEffect() {
    const result = document.getElementById('loveResult');
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = result.offsetWidth / 2 + 'px';
        heart.style.top = result.offsetHeight / 2 + 'px';
        heart.style.fontSize = '20px';
        heart.style.animation = `heartExplosion${i} 1s ease-out forwards`;
        heart.style.pointerEvents = 'none';
        result.style.position = 'relative';
        result.appendChild(heart);

        const style = document.createElement('style');
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100;
        style.textContent = `
            @keyframes heartExplosion${i} {
                0% { transform: translate(0, 0); opacity: 1; }
                100% { transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => heart.remove(), 1000);
    }
}

// FLAMES GAME
function playFlames() {
    const name1 = document.getElementById('flamesName1').value.trim().toLowerCase();
    const name2 = document.getElementById('flamesName2').value.trim().toLowerCase();
    const resultContainer = document.getElementById('flamesResult');

    if (!name1 || !name2) {
        resultContainer.innerHTML = '<p style="color: #d946ef;">Please enter both names!</p>';
        return;
    }

    let result = '';

    // Special case for Taushif
    if ((name1 === 'taushif' && (name2 === 'najiya' || name2 === 'naziya')) ||
        (name2 === 'taushif' && (name1 === 'najiya' || name1 === 'naziya'))) {
        result = 'Marriage';
    } else {
        // Calculate FLAMES
        const flamesOptions = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Siblings'];
        let combined = name1 + name2;
        let count = combined.length;
        let flamesIndex = count % 6;
        result = flamesOptions[flamesIndex];
    }

    // Track game activity
    trackGameActivity('FLAMES Game', {
        name1: name1,
        name2: name2,
        result: result,
        timestamp: new Date().toLocaleString()
    });

    resultContainer.innerHTML = `
        <div class="flames-result-text">🔥 ${result} 🔥</div>
        <div style="margin-top: 20px; color: #666; font-size: 0.95rem;">
            ${getFlamesMessage(result)}
        </div>
    `;
}

function getFlamesMessage(result) {
    const messages = {
        'Friends': 'You two are great friends! 👫',
        'Love': 'There\'s love in the air! 💕',
        'Affection': 'Deep affection connects you! 💖',
        'Marriage': 'Destiny says you\'re meant to be! 💍',
        'Enemies': 'You challenge each other! ⚡',
        'Siblings': 'A sibling bond forever! 👫'
    };
    return messages[result] || result;
}

// SPIN WHEEL GAME
function startSpinGame() {
    const yourName = document.getElementById('yourName').value.trim();
    const resultContainer = document.getElementById('spinResult');

    if (!yourName) {
        resultContainer.innerHTML = '<p style="color: #d946ef;">Please enter your name!</p>';
        return;
    }

    const wheel = document.getElementById('spinWheel');
    const spins = Math.random() * 360 + 360 * 5;
    
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    
    setTimeout(() => {
        wheel.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        wheel.style.transform = `rotate(${spins}deg)`;
    }, 10);

    setTimeout(() => {
        const normalizedRotation = spins % 360;
        const segmentSize = 360 / crushNames.length;
        const selectedIndex = Math.floor(normalizedRotation / segmentSize);
        
        let match = crushNames[selectedIndex];
        
        // Override for special name
        if (yourName.toLowerCase() === 'taushif') {
            match = crushNames[0]; // Always Najiya for Taushif
        }

        // Track game activity
        trackGameActivity('Spin Wheel Game', {
            playerName: yourName,
            matchResult: match,
            timestamp: new Date().toLocaleString()
        });

        resultContainer.innerHTML = `
            <div class="spin-result-text">
                💫 Your Match: <strong>${match}</strong> 💫
            </div>
        `;
    }, 3000);
}

/* ============================================
   POLLS SECTION
   ============================================ */

function setupPolls() {
    displayPoll();
}

function displayPoll() {
    const pollCard = document.getElementById('pollCard');
    const currentPoll = pollQuestions[pollIndex];

    const pollQuestion = document.getElementById('pollQuestion');
    const pollOptions = document.getElementById('pollOptions');
    const pollCounter = document.getElementById('pollCounter');

    pollQuestion.textContent = currentPoll.question;

    pollOptions.innerHTML = currentPoll.options.map((option, idx) => {
        const votes = getPollVotes(pollIndex, idx);
        const totalVotes = getTotalPollVotes(pollIndex);
        const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

        return `
            <div class="poll-option">
                <label class="poll-option-label">
                    <input type="radio" name="poll_${pollIndex}" value="${idx}" onchange="votePoll(${pollIndex}, ${idx})">
                    <span class="poll-option-text">${option}</span>
                </label>
                <div class="poll-percentage">
                    <span>${percentage}% (${votes})</span>
                </div>
                <div class="poll-bar">
                    <div class="poll-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    pollCounter.textContent = `Question ${pollIndex + 1} of ${pollQuestions.length}`;

    // Disable navigation buttons if needed
    document.querySelectorAll('.poll-nav-btn').forEach(btn => {
        btn.disabled = false;
    });

    if (pollIndex === 0) {
        document.querySelector('.poll-nav-btn:first-of-type').disabled = true;
    }
    if (pollIndex === pollQuestions.length - 1) {
        document.querySelector('.poll-nav-btn:last-of-type').disabled = true;
    }
}

function previousPoll() {
    if (pollIndex > 0) {
        pollIndex--;
        displayPoll();
    }
}

function nextPoll() {
    if (pollIndex < pollQuestions.length - 1) {
        pollIndex++;
        displayPoll();
    }
}

function votePoll(questionIdx, optionIdx) {
    const votes = JSON.parse(localStorage.getItem('pollVotes')) || {};
    if (!votes[questionIdx]) {
        votes[questionIdx] = {};
    }
    votes[questionIdx][optionIdx] = (votes[questionIdx][optionIdx] || 0) + 1;
    localStorage.setItem('pollVotes', JSON.stringify(votes));

    // Save to Firebase if available
    if (typeof savePollVoteToDatabase === 'function') {
        savePollVoteToDatabase(questionIdx, optionIdx);
    }

    displayPoll();
}

function getPollVotes(questionIdx, optionIdx) {
    const votes = JSON.parse(localStorage.getItem('pollVotes')) || {};
    return votes[questionIdx]?.[optionIdx] || 0;
}

function getTotalPollVotes(questionIdx) {
    const votes = JSON.parse(localStorage.getItem('pollVotes')) || {};
    const questionVotes = votes[questionIdx] || {};
    return Object.values(questionVotes).reduce((a, b) => a + b, 0);
}

/* ============================================
   GAME ACTIVITY TRACKING
   ============================================ */

// PIN for accessing game stats
const GAME_STATS_PIN = "144590";
let pinAttempts = 0;
const MAX_PIN_ATTEMPTS = 3;

function trackGameActivity(gameName, gameData) {
    // Get existing activities from localStorage
    let activities = JSON.parse(localStorage.getItem('gameActivities')) || [];
    
    // Add new activity
    activities.push({
        game: gameName,
        data: gameData,
        id: Date.now()
    });
    
    // Save to localStorage
    localStorage.setItem('gameActivities', JSON.stringify(activities));
    
    // Save to Firebase if available
    if (typeof saveGameActivityToDatabase === 'function') {
        saveGameActivityToDatabase(gameName, gameData);
    }
    
    console.log(`Game Activity Tracked: ${gameName}`, gameData);
}

function getGameActivities() {
    return JSON.parse(localStorage.getItem('gameActivities')) || [];
}

function verifyPIN() {
    return new Promise((resolve) => {
        if (pinAttempts >= MAX_PIN_ATTEMPTS) {
            alert('❌ Too many incorrect PIN attempts! Please try again after 5 minutes.');
            resolve(false);
            return;
        }

        const pinInput = prompt(`🔐 Enter PIN to view Game Stats:\n\n(Attempt ${pinAttempts + 1}/${MAX_PIN_ATTEMPTS})`);
        
        if (pinInput === null) {
            // User clicked cancel
            resolve(false);
            return;
        }

        if (pinInput === GAME_STATS_PIN) {
            pinAttempts = 0; // Reset on success
            alert('✅ PIN Correct! Loading Game Stats...');
            resolve(true);
        } else {
            pinAttempts++;
            if (pinAttempts >= MAX_PIN_ATTEMPTS) {
                alert('❌ Game Stats locked for 5 minutes due to too many wrong attempts!');
                setTimeout(() => {
                    pinAttempts = 0;
                }, 300000); // 5 minute lockout
            } else {
                alert(`❌ Wrong PIN! ${MAX_PIN_ATTEMPTS - pinAttempts} attempts remaining.`);
            }
            resolve(false);
        }
    });
}

async function viewGameStats() {
    const isAuthorized = await verifyPIN();
    if (!isAuthorized) {
        console.log('Unauthorized access attempt to game stats');
        return;
    }

    const activities = getGameActivities();
    
    if (activities.length === 0) {
        alert('No game activities yet!');
        return;
    }
    
    let stats = {
        'Love Calculator': { total: 0, plays: [] },
        'FLAMES Game': { total: 0, plays: [] },
        'Spin Wheel Game': { total: 0, plays: [] }
    };
    
    activities.forEach(activity => {
        if (stats[activity.game]) {
            stats[activity.game].total++;
            stats[activity.game].plays.push(activity.data);
        }
    });
    
    // Open admin panel
    openGameStatsPanel(stats, activities);
}

function openGameStatsPanel(stats, activities) {
    const modal = document.createElement('div');
    modal.id = 'gameStatsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        padding: 20px;
    `;
    
    let statsHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            width: 100%;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="color: #d946ef; margin: 0;">🎮 Game Activity Dashboard</h2>
                <button onclick="document.getElementById('gameStatsModal').remove()" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                ">✕</button>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #d946ef; margin-top: 0;">📊 Overall Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
    `;
    
    // Add game stats
    Object.keys(stats).forEach(gameName => {
        statsHTML += `
            <div style="
                background: linear-gradient(135deg, #ff69b4, #d946ef);
                color: white;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
            ">
                <div style="font-size: 24px; font-weight: bold;">${stats[gameName].total}</div>
                <div style="font-size: 14px; margin-top: 5px;">${gameName}</div>
            </div>
        `;
    });
    
    statsHTML += `
                </div>
            </div>
            
            <div>
                <h3 style="color: #d946ef; margin-top: 0;">📝 Detailed Activity Log</h3>
                <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    // Add activity log
    if (activities.length === 0) {
        statsHTML += '<p style="color: #999; text-align: center;">No activities recorded yet</p>';
    } else {
        activities.reverse().forEach((activity, idx) => {
            statsHTML += `
                <div style="
                    background: #f3f4f6;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    border-left: 4px solid #d946ef;
                ">
                    <strong style="color: #d946ef;">${activity.game}</strong>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">
                        <div><strong>Time:</strong> ${activity.data.timestamp}</div>
            `;
            
            // Show relevant data based on game
            if (activity.game === 'Love Calculator') {
                statsHTML += `
                    <div><strong>Names:</strong> ${activity.data.name1} + ${activity.data.name2}</div>
                    <div><strong>Result:</strong> ${activity.data.result}%</div>
                `;
            } else if (activity.game === 'FLAMES Game') {
                statsHTML += `
                    <div><strong>Names:</strong> ${activity.data.name1} + ${activity.data.name2}</div>
                    <div><strong>Result:</strong> ${activity.data.result}</div>
                `;
            } else if (activity.game === 'Spin Wheel Game') {
                statsHTML += `
                    <div><strong>Player:</strong> ${activity.data.playerName}</div>
                    <div><strong>Match:</strong> ${activity.data.matchResult}</div>
                `;
            }
            
            statsHTML += `
                    </div>
                </div>
            `;
        });
    }
    
    statsHTML += `
                </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <button onclick="downloadGameStats()" style="
                    background: linear-gradient(135deg, #ff69b4, #d946ef);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-right: 10px;
                ">📥 Download as JSON</button>
                <button onclick="clearAllGameStats()" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">🗑️ Clear All Data</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = statsHTML;
    document.body.appendChild(modal);
}

function downloadGameStats() {
    const activities = getGameActivities();
    const dataStr = JSON.stringify(activities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function clearAllGameStats() {
    if (confirm('Are you sure you want to clear all game activity data? This cannot be undone!')) {
        localStorage.removeItem('gameActivities');
        document.getElementById('gameStatsModal').remove();
        alert('All game activity data has been cleared!');
    }
}

/* ============================================
   CONFETTI EFFECT
   ============================================ */

function createConfetti() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1500';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const confetti = [];

    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 3,
            size: Math.random() * 5 + 2,
            color: ['#FF1493', '#FFD700', '#00FFFF', '#FF6347', '#32CD32'][Math.floor(Math.random() * 5)],
            rotation: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c, i) => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.1;
            c.rotation += 0.1;

            if (c.y > canvas.height) {
                confetti.splice(i, 1);
            }

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            ctx.restore();
        });

        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    animate();
}

/* ============================================
   BACKGROUND MUSIC
   ============================================ */

function setupBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.2;
    
    // Try to autoplay
    bgMusic.play().catch(err => {
        console.log('Autoplay prevented: ', err);
        // Show message to user to click to start music
    });
}

/* ============================================
   SOCIAL BUTTONS
   ============================================ */

function setupSocialButtons() {
    const instagramLink = document.querySelector('.instagram-link');
    const snapchatLink = document.querySelector('.snapchat-link');

    instagramLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Replace with actual Instagram username
        const username = prompt('Enter Instagram username:', 'taushif_alam');
        if (username) {
            window.open(`https://instagram.com/${username}`, '_blank');
        }
    });

    snapchatLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Replace with actual Snapchat username
        const username = prompt('Enter Snapchat username:', 'taushif_alam');
        if (username) {
            window.open(`https://snapchat.com/add/${username}`, '_blank');
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

function scrollToSection(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Prevent accidental text selection
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('glowing-name')) {
        e.preventDefault();
    }
});

// Performance optimization - lazy load heavy animations
let performanceOptimized = false;
window.addEventListener('scroll', () => {
    if (!performanceOptimized && window.scrollY > window.innerHeight * 2) {
        // Reduce heart rain frequency on lower-end devices
        if (window.innerWidth < 768) {
            performanceOptimized = true;
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Adjust canvas sizes
    const effectsCanvas = document.getElementById('effectsCanvas');
    if (effectsCanvas) {
        effectsCanvas.width = window.innerWidth;
        effectsCanvas.height = window.innerHeight;
    }
});

// Debounced resize handler to keep gallery transform in sync and avoid jumpy animations
let _galleryResizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_galleryResizeTimer);
    _galleryResizeTimer = setTimeout(() => {
        const slideContainer = document.getElementById('gallerySlides');
        if (!slideContainer) return;
        // temporarily disable transition to reposition without visible jump
        const prevTransition = slideContainer.style.transition;
        slideContainer.style.transition = 'none';
        slideContainer.style.transform = `translate3d(-${currentGalleryIndex * 100}%, 0, 0)`;
        // force repaint
        void slideContainer.offsetWidth;
        // restore transition next frame
        requestAnimationFrame(() => {
            slideContainer.style.transition = prevTransition || '';
        });
    }, 120);
});
/* ============================================
   SPECIAL GIFT SECTION
   ============================================ */

function setupSpecialGiftSection() {
    const giftBox = document.querySelector('.gift-box');
    const giftModal = document.getElementById('giftModal');
    
    if (giftBox) {
        giftBox.addEventListener('click', openSpecialGift);
    }
    
    // Close modal when clicking outside
    if (giftModal) {
        giftModal.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                closeSpecialGift();
            }
        });
    }
}

function openSpecialGift() {
    const giftModal = document.getElementById('giftModal');
    if (giftModal) {
        giftModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Create confetti effect
        createGiftConfetti();
    }
}

function closeSpecialGift() {
    const giftModal = document.getElementById('giftModal');
    if (giftModal) {
        giftModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Allow scrolling again
    }
}

function createGiftConfetti() {
    const colors = ['#FF1493', '#FFD700', '#FF69B4', '#FFA500', '#00FFFF'];
    const count = isMobileDevice ? 18 : 50;
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '0px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '500';
        confetti.style.opacity = '0.7';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti animation
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(${window.innerHeight}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}