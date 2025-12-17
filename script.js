// Enhanced scroll animations and parallax
class ScrollEffects {
    constructor() {
        this.scrollProgress = document.getElementById('scrollProgress');
        this.particles = document.getElementById('particles');
        this.parallaxElements = document.querySelectorAll('.parallax-element');
        this.init();
    }

    init() {
        this.createParticles();
        this.updateScrollProgress();
        this.setupEventListeners();
        this.observeElements();
    }

    createParticles() {
        if (!this.particles) return;
        
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            this.particles.appendChild(particle);
        }
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        if (this.scrollProgress) {
            this.scrollProgress.style.width = scrollPercent + '%';
        }
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.updateParallax();
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.updateScrollProgress();
        });
    }

    updateParallax() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const speed = 0.5;
        
        this.parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const yPos = -(scrollTop - elementTop) * speed;
            
            if (Math.abs(yPos) < 500) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }
}

function getData() {
    const productList = document.getElementById("productList");
    if (productList) {
        // Show skeleton loading
        productList.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading Audio Collection...</div>
            </div>
        `;
    }

    fetch("assets/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(items => {
            if (!productList) {
                return;
            }

            productList.textContent = "";
            const cards = [];

            items.forEach((item, index) => {
                const card = document.createElement("div");

                // tambahkan href ini
                const productUrl = `detail.html?id=${encodeURIComponent(item.id)}`;

                card.className = "product fade-in"
                card.style.backgroundImage = `url(${item.image})`;
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <a class="product-content" href="${productUrl}">

                      <h1 class="title">${item.title}</h1>
                      <p class="subtitle">${item.subtitle}</p>

                      <div class="product-stats">

                        <div class="stat">
                            <span class="label">Warna</span>
                            <span class="value">${item.color}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Baterai</span>
                            <span class="value">${item.battery}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Bobot</span>
                            <span class="value">${item.weight}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Latency</span>
                            <span class="value">${item.latency}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Harga</span>
                            <span class="value">${item.price}</span>
                        </div>

                      </div>
                    </a>
                `;

                // tambahkan handler direction
                const content = card.querySelector(".product-content")
                
                if (content) {
                    content.href = productUrl;
                }

                productList.appendChild(card);
                cards.push(card);
            });

            function reveal() {
                for (const card of cards) {
                    const {top, bottom} = card.getBoundingClientRect();

                    if (top < window.innerHeight * 0.85 && bottom > window.innerHeight * 0.15) {
                        card.classList.add("show");
                    }
                }
            }

            // Enhanced reveal with staggered animation
            setTimeout(() => {
                reveal();
                window.addEventListener("scroll", reveal, {passive: true});
                window.addEventListener("resize", reveal);
                
                // Initialize scroll effects
                new ScrollEffects();
            }, 300);
        })
        .catch(() => {
            if (productList) {
                productList.innerHTML = `
                    <div class="loading-container">
                        <div class="loading-text">Gagal memuat data produk.</div>
                    </div>
                `;
            }
        });
}

getData()

// Chat Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatButton');
    const chatPopup = document.getElementById('chatPopup');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle chat popup
    if (chatButton && chatPopup) {
        chatButton.addEventListener('click', function() {
            chatPopup.classList.toggle('show');
            
            // Remove badge when opened
            const badge = chatButton.querySelector('.chat-badge');
            if (badge) {
                badge.style.display = 'none';
            }
            
            // Focus input when opened
            if (chatPopup.classList.contains('show') && chatInput) {
                setTimeout(() => chatInput.focus(), 300);
            }
        });
    }
    
    // Close chat popup
    if (chatClose && chatPopup) {
        chatClose.addEventListener('click', function() {
            chatPopup.classList.remove('show');
        });
    }
    
    // Handle chat form submission
    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Simulate bot response with keyword detection
            setTimeout(() => {
                const response = generateBotResponse(message);
                addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
        });
    }
    
    // Smart Bot Response Generator
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Product-related keywords
        if (message.includes('headphone') || message.includes('earphone') || message.includes('earbud')) {
            const responses = [
                "Kami punya berbagai macam headphone dan earbud premium! Ada yang lagi cari? Earbud ANC atau headphone over-ear?",
                "Nice choice! Kami ada koleksi headphone dan earbud dengan teknologi terbaru. Budget sekitar berapa yang Anda cari?",
                "Untuk headphone, saya rekomendasikan Arc Eclipse atau Pulse Mono. Untuk earbud, coba lihat Neon Pulse atau Noir Pulse. Ada yang tertarik?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Price-related keywords
        if (message.includes('harga') || message.includes('price') || message.includes('berapa') || message.includes('cost')) {
            const responses = [
                "Harga produk kami bervariasi dari $159-$289. Ada produk tertentu yang mau ditanyakan harganya?",
                "Tergantung modelnya! Earbud mulai $159, headphone mulai $189. Mau tau harga produk spesifik?",
                "Budget Anda berapa? Saya bisa bantu rekomendasikan produk yang sesuai. Kami ada di semua range harga!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Quality/Sound keywords
        if (message.includes('kualitas') || message.includes('sound') || message.includes('bass') || message.includes('audio')) {
            const responses = [
                "Sound quality produk kami top banget! Semua produk punya driver premium dan tuning khusus. Suka bass yang powerful atau vokal yang jernih?",
                "Audio adalah passion kami! Produk kami punya signature sound yang berbeda-beda. Ada yang bass-heavy, ada yang balanced. Preferensi Anda?",
                "Kualitas audio kami jempolan! Dengan driver dynamic dan chamber akustik khusus. Mau tahu tentang teknologi ANC atau sound signature?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Battery-related keywords
        if (message.includes('baterai') || message.includes('battery') || message.includes('daya')) {
            const responses = [
                "Battery life produk kami sangat baik! Earbud bisa 8 jam per charge, case bisa 40+ jam. Cukup untuk seharian penuh!",
                "Daya tahan baterai kami unggul! Headphone bisa 60+ jam, earbud 8 jam dengan case 40 jam. Ada yang butuh battery life ekstra?",
                "Semua produk punya fast charging dan battery life yang luar biasa. Mau tahu tentang wireless charging juga?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Greeting keywords
        if (message.includes('halo') || message.includes('hi') || message.includes('hello') || message.includes('hai')) {
            const responses = [
                "Halo! Selamat datang di Taqdir Tech Audio. Ada yang bisa saya bantu hari ini?",
                "Hi there! Looking for the perfect audio gear? Saya siap bantu!",
                "Halo! Teman audio yang baik! Ada produk tertentu yang lagi Anda cari?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Thanks keywords
        if (message.includes('terima kasih') || message.includes('thanks') || message.includes('thank')) {
            const responses = [
                "Sama-sama! Senang bisa bantu. Ada lagi yang mau ditanyakan?",
                "You're welcome! Kalau ada pertanyaan lain, jangan ragu ya!",
                "Sama-sama! Happy shopping audio gear ya!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Recommendation keywords
        if (message.includes('rekomendasi') || message.includes('recommend') || message.includes('saran')) {
            const responses = [
                "Saya bisa kasih rekomendasi! Untuk daily use, saya sarankan Feather Air. Untuk gaming, coba Neon Pulse. Budget dan preferensi Anda seperti apa?",
                "Bisa banget! Berdasarkan kebutuhan Anda, apa yang paling penting? Battery life, sound quality, atau ANC?",
                "Tentu! Beri tahu saya budget dan kebutuhan Anda, saya akan rekomendasikan yang paling cocok!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Purchase/Order keywords
        if (message.includes('beli') || message.includes('buy') || message.includes('order') || message.includes('pesan')) {
            const responses = [
                "Untuk pembelian, Anda bisa langsung klik produk yang diinginkan atau hubungi tim kami. Ada produk yang mau dipesan?",
                "Ready stock! Anda bisa langsung checkout atau saya bantu prosesnya. Mau beli yang mana?",
                "Bisa banget! Klik produk yang Anda suka atau saya bantu carikan yang best untuk Anda. Ada yang mau dipesan sekarang?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Help/Support keywords
        if (message.includes('bantu') || message.includes('help') || message.includes('support')) {
            const responses = [
                "Tentu saya bantu! Ada masalah dengan produk atau butuh rekomendasi?",
                "I'm here to help! Ada pertanyaan tentang produk atau teknologi audio?",
                "Siap bantu! Butuh info spesifikasi, komparasi, atau rekomendasi?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Default responses
        const defaultResponses = [
            "Hmm, interesting! Bisa jelaskan lebih detail tentang yang Anda cari?",
            "Saya paham. Mau tahu tentang produk spesifik atau butuh rekomendasi umum?",
            "Baik! Ada produk tertentu dari Taqdir Tech Audio yang ingin Anda tahu lebih lanjut?",
            "Saya bantu ya! Coba sebutkan kata kunci: headphone, earbud, harga, atau rekomendasi.",
            "Nice! Apa Anda lagi cari audio gear untuk gaming, daily use, atau profesional?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Function to add message to chat
    function addMessage(text, sender) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (chatPopup && chatPopup.classList.contains('show')) {
            if (!chatPopup.contains(e.target) && !chatButton.contains(e.target)) {
                chatPopup.classList.remove('show');
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to open chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (chatButton) {
                chatButton.click();
            }
        }
        
        // Escape to close chat
        if (e.key === 'Escape' && chatPopup && chatPopup.classList.contains('show')) {
            chatPopup.classList.remove('show');
        }
    });
});