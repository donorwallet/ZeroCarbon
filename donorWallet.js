// Image Constants
const IMG_INTRO_1 = './Intro_1.jpg';
const IMG_INTRO_2 = './Intro_2.jpg';
const IMG_INTRO_3 = './Intro_3.jpg';
const IMG_INTRO_4 = './Intro_4.jpg';
const IMG_NEEDS_1 = './Needs_1.jpg';
const IMG_NEEDS_2 = './Needs_2.jpg';
const IMG_NEEDS_3 = './Needs_3.jpg';
const IMG_NEEDS_4 = './Needs_4.jpg';
const IMG_LIVES_1 = './Lives_1.jpg';
const IMG_LIVES_2 = './Lives_2.jpg';
const IMG_LIVES_3 = './Lives_3.jpg';
const IMG_LIVES_4 = './Lives_4.jpg';
const IMG_TECH_1 = './Tech_1.jpg';
const IMG_TECH_2 = './Tech_2.jpg';
const IMG_TECH_3 = './Tech_3.jpg';
const IMG_TECH_4 = './Tech_4.jpg';

// URL Constants
const CONTRACT_URL = 'https://quantumbesu.web.app/quantumbesu.html?contract=0x229aCcf70c4B4403670a5d0643e5A67Fd38c014d';
const GUEST_ACCOUNT_URL = 'https://quantumbesu.web.app/quantumbesu.html?account=0x965c5086e097301652E41fC7305282e250aD0c04';
const MEMBER_ACCOUNT_URL = 'https://quantumbesu.web.app/quantumbesu.html?account=0x9b8d908db07E97D812319ADD4e32D82Cff6FDe04';

// Global State Management
let currentLanguage = 'zh'; // Default to Chinese
let currentUser = 'guest'; // 'guest' or 'alice'
let isProcessingPayment = false; // Flag to prevent navigation during payment completion
let latestPaymentAmount = 0; // Track the latest payment amount for guest users
let selectedItems = {
    NEEDS: [],
    LIVES: []
};

// Mock Data
const mockData = {
    guest: {
        totalDonations: 5389730,
        usedDonations: 3897304
    },
    alice: {
        totalDonations: 5389,
        usedDonations: 1333,
        name: 'Alice',
        address: '0x742d...8B3f',
        level: 'Gold',
        expiry: '2029-12-31'
    }
};

const careItemDetails = {
    FOOD: {
        en: { name: 'Collect Food Waste to Reduce Landfill', price: 100, unit: '/100kgCO₂e', description: 'Through recycling food waste, reduce the amount of garbage sent to landfills and alleviate environmental burden' },
        zh: { name: '收集廚餘減少堆填', price: 100, unit: '100kgCO₂e', description: '透過回收廚餘，減少送往堆填區嘅垃圾量，減輕環境負擔' }
    },
    INSURANCE: {
        en: { name: 'Food Waste to Protein Powder', price: 200, unit: '/200kgCO₂e', description: 'Transform food waste into high-value protein powder for animal feed or other purposes' },
        zh: { name: '廚餘轉化蛋白質粉', price: 200, unit: '/00kgCO₂e', description: '全將廚餘轉化成高價值嘅蛋白質粉，用於動物飼料或其他用途' }
    },
    COLLAR: {
        en: { name: 'Zero Carbon Bio-transformation', price: 500, unit: '/500kgCO₂e', description: 'Transform food waste into high-value protein powder for animal feed or other purposes' },
        zh: { name: '零碳排放生物轉化', price: 300, unit: '300kgCO₂e', description: '將廚餘轉化成高價值嘅蛋白質粉，用於動物飼料或其他用途' }
    },
    ADOPTION: {
        en: { name: 'High Protein Dog Food to Reduce Meat', price: 1000, unit: '/1000kgCO₂e', description: 'Use high-protein feed to replace traditional meat, meet pet nutritional needs while reducing dependence on meat resources' },
        zh: { name: '高蛋白狗量減肉食', price: 500, unit: '/500kgCO₂e', description: '用高蛋白飼料代替傳統肉食，滿足寵物營養需求，同時減少對肉類資源嘅依賴' }
    }
};

const animalDetails = {
    ALLSTRAY: {
        en: { name: 'Zero Carbon Food Waste Transformation', description: 'Support the use of advanced biotechnology to transform food waste into useful resources, achieving zero carbon emissions, promoting sustainable development, and reducing environmental pollution' },
        zh: { name: '零碳排放廚餘轉化', description: '支持利用先進生物技術將廚餘轉化為有用資源，實現零碳排放，推動可持續發展，減少環境污染' }
    },
    SQUIRREL: {
        en: { name: 'Healthy Vegetarian Dog Food', description: 'Support the development of high-nutrition vegetarian dog food, using plant-based protein to meet pet health needs, reduce meat consumption, and lower ecological footprint' },
        zh: { name: '健康素食狗糧', description: '資助研發高營養素食狗糧，以植物基蛋白質滿足寵物健康需求，減少肉類消耗，降低生態足跡' }
    },
    PUG: {
        en: { name: 'Green Research', description: 'Support innovative green technology research, develop environmental solutions, improve resource utilization efficiency, and promote a low-carbon future' },
        zh: { name: '綠色科研', description: '捐助創新綠色科技研究，開發環保解決方案，提升資源利用效率，促進低碳未來' }
    },
    TERRIER: {
        en: { name: 'Promoting ESG', description: 'Support Environmental, Social, and Governance (ESG) projects, promote corporate adoption of sustainable practices, enhance social responsibility and environmental protection awareness' },
        zh: { name: '促進ESG', description: '支持環境、社會及管治（ESG）項目，推動企業採用可持續實踐，提升社會責任及環境保護意識' }
    }
};

// Language Management
function selectLanguage(lang) {
    currentLanguage = lang;
    updateLanguage();
    // Navigate to page 2 (matching-page) after language selection
    showPage('matching-page');
    document.getElementById('top-nav').classList.remove('hidden');
}

// Navigation Flow Functions
function goToMatchingPage() {
    showPage('matching-page');
}

function goToDonationPage() {
    showPage('donation-page');
}

function goToAboutPage() {
    showPage('about-page');
}

function goToIntroPage() {
    showPage('intro-page');
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-zh');
        element.textContent = text;
    });
    
    // Update member greeting
    updateMemberGreeting();
}

function updateMemberGreeting() {
    const greeting = document.getElementById('member-greeting');
    if (currentUser === 'guest') {
        greeting.textContent = currentLanguage === 'en' ? 'I am a guest' : '我是訪客';
        greeting.setAttribute('data-en', 'I am a guest');
        greeting.setAttribute('data-zh', '我是訪客');
    } else {
        greeting.textContent = currentLanguage === 'en' ? 'Hello Alice' : '您好 Alice';
        greeting.setAttribute('data-en', 'Hello Alice');
        greeting.setAttribute('data-zh', '您好 Alice');
    }
}

// Page Navigation
function showPage(pageId) {
    // Prevent navigation while processing payment completion
    /*if (isProcessingPayment && pageId !== 'donation-page') {
        console.log('Navigation blocked during payment completion');
        return;
    }*/
    console.log(`Navigating to page: ${pageId}`);
    
    // Add fade out effect to current page
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        console.log(`Fading out current page: ${currentPage.id}`);
        currentPage.style.opacity = '0';
        
        // Wait for fade out, then switch pages
        setTimeout(() => {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
                page.style.opacity = '1';
            });
            
            // Show target page
            const targetPage = document.getElementById(pageId);
            targetPage.classList.add('active');
            targetPage.style.opacity = '0';
            
            // Fade in new page
            setTimeout(() => {
                targetPage.style.opacity = '1';
            }, 50);
            
        }, 200);
    } else {
        console.log(`First page load: ${currentPage.id}`);
        // First page load - no transition
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }
    
    // Handle special page logic
    if (pageId === 'donation-page') {
        updateDonationSummary();
        // Always show thank-you box when navigating to donation page
        // Only hide completion box if we're not coming from a completed payment
        const thankYouBox = document.querySelector('.thank-you-box');
        const completeBox = document.getElementById('donation-complete');
        if (thankYouBox) {
            thankYouBox.style.display = 'block';
            console.log(`Navigating to donation page: thankyou box block`);
        }
        // Only hide completion box if payment isn't being processed
        if (completeBox && !isProcessingPayment) {
            completeBox.style.display = 'none';
            console.log(`Navigating to donation page: complete box none`);
        }
    } else if (pageId === 'about-page') {
        updateAboutPageStats();
    }
    
    // Show/hide nav based on page
    const topNav = document.getElementById('top-nav');
    if (pageId === 'intro-page') {
        topNav.classList.add('hidden');
    } else {
        topNav.classList.remove('hidden');
    }
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Selection Modal
let currentModalCard = null;

function openSelectModal(cardElement) {
    currentModalCard = cardElement;
    const type = cardElement.getAttribute('data-type');
    const modal = document.getElementById('select-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const toggleBtn = document.getElementById('select-toggle-btn');
    
    // Set modal image
    modalImage.src = cardElement.querySelector('img').src;
    
    // Set modal content based on type
    const isNeed = cardElement.closest('.needs-carousel') !== null;
    let details;
    
    if (isNeed) {
        details = careItemDetails[type][currentLanguage];
        modalTitle.textContent = details.name;
        modalDetails.innerHTML = `
            <p>
                <strong>${details.name}</strong><br>
                ${currentLanguage === 'en' ? 'Price' : '價格'}: $${details.price}/${details.unit}<br>
                ${currentLanguage === 'en' ? 'Description' : '描述'}: ${details.description}
            </p>
        `;
    } else {
        details = animalDetails[type][currentLanguage];
        modalTitle.textContent = details.name;
        modalDetails.innerHTML = `
            <p>
                <strong>${details.name}</strong><br>
                ${currentLanguage === 'en' ? 'Description' : '描述'}: ${details.description}
            </p>
        `;
    }
    
    // Update toggle button
    const category = isNeed ? 'NEEDS' : 'LIVES';
    const isSelected = selectedItems[category].includes(type);
    toggleBtn.textContent = isSelected ? 
        (currentLanguage === 'en' ? 'Unselect' : '取消選擇') : 
        (currentLanguage === 'en' ? 'Select' : '選擇');
    toggleBtn.className = isSelected ? 'cancel-btn' : 'gradient-btn';
    
    openModal('select-modal');
}

function toggleSelection() {
    if (!currentModalCard) return;
    
    const type = currentModalCard.getAttribute('data-type');
    const isNeed = currentModalCard.closest('.needs-carousel') !== null;
    const category = isNeed ? 'NEEDS' : 'LIVES';
    
    const index = selectedItems[category].indexOf(type);
    if (index > -1) {
        // Unselect
        selectedItems[category].splice(index, 1);
        currentModalCard.classList.remove('selected');
    } else {
        // Select
        selectedItems[category].push(type);
        currentModalCard.classList.add('selected');
    }
    
    closeModal('select-modal');
    updateSelectionVisuals();
}

function updateSelectionVisuals() {
    // Update all card visual states
    document.querySelectorAll('.card').forEach(card => {
        const type = card.getAttribute('data-type');
        const isNeed = card.closest('.needs-carousel') !== null;
        const category = isNeed ? 'NEEDS' : 'LIVES';
        
        if (selectedItems[category].includes(type)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Check if we have selections from both NEEDS and LIVES sections
    const hasNeedsSelection = selectedItems.NEEDS.length > 0;
    const hasLivesSelection = selectedItems.LIVES.length > 0;
    
    if (hasNeedsSelection && hasLivesSelection) {
        // Auto-scroll to bottom of matching page
        setTimeout(() => {
            const matchingPage = document.getElementById('matching-page');
            if (matchingPage && matchingPage.classList.contains('page') && matchingPage.style.display !== 'none') {
                matchingPage.scrollTo({
                    top: matchingPage.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 500); // Small delay to allow modal closing animation to complete
    }
}

// Settings Modal
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const loginForm = document.getElementById('login-form');
    const memberInfo = document.getElementById('member-info');
    
    if (currentUser === 'guest') {
        loginForm.classList.remove('hidden');
        memberInfo.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        memberInfo.classList.remove('hidden');
    }
    
    openModal('settings-modal');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'alice' && password === '2345') {
        currentUser = 'alice';
        updateMemberGreeting();
        updateUserStats();
        
        // Switch to member view
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('member-info').classList.remove('hidden');
    } else {
        alert(currentLanguage === 'en' ? 'Invalid credentials' : '登入資訊錯誤');
    }
}

function logout() {
    currentUser = 'guest';
    updateMemberGreeting();
    updateUserStats();
    closeModal('settings-modal');
}

function updateUserStats() {
    const userData = currentUser === 'guest' ? mockData.guest : mockData.alice;
    document.getElementById('total-donations').textContent = `$${userData.totalDonations.toLocaleString()}`;
    document.getElementById('used-donations').textContent = `$${userData.usedDonations.toLocaleString()}`;
}

// Donations Modals
function openTotalDonationsModal() {
    openModal('total-donations-modal');
}

function openUsedDonationsModal() {
    openModal('used-donations-modal');
}

// Scan Modal
function openScanModal() {
    openModal('scan-modal');
}

// Carbon Credit Modal
function openCarbonModal() {
    openModal('carbon-modal');
}

function simulateScan() {
    // Simulate QR code scan result
    const mockQRData = {
        NEEDS: ['FOOD'],
        LIVES: ['SQUIRREL']
    };
    
    // Update selection
    selectedItems = mockQRData;
    updateSelectionVisuals();
    
    closeModal('scan-modal');
    showPage('donation-page');
    
    alert(currentLanguage === 'en' ? 
        'QR Code scanned! Items added to donation.' : 
        '二維碼已掃描！項目已添加到捐款中。');
}

// Donation Page Logic
function updateDonationSummary() {
    const selectedItemsDiv = document.getElementById('selected-items');
    const totalDiv = document.getElementById('donation-total');
    
    let itemsList = [];
    let total = 0;
    
    // Process NEEDS
    selectedItems.NEEDS.forEach(type => {
        const item = careItemDetails[type][currentLanguage];
        itemsList.push(`${item.name} - $${item.price}`);
        total += item.price;
    });
    
    // Process LIVES (multiply by count)
    const livesCount = selectedItems.LIVES.length;
    if (livesCount > 0) {
        total *= livesCount;
        selectedItems.LIVES.forEach(type => {
            const animal = animalDetails[type][currentLanguage];
            itemsList.push(animal.name);
        });
    }
    
    if (itemsList.length === 0) {
        selectedItemsDiv.innerHTML = `<p>${currentLanguage === 'en' ? 'Please select items from the matching page' : '請從配對頁面選擇項目'}</p>`;
        total = 0;
    } else {
        selectedItemsDiv.innerHTML = `
            <div class="scrolling-text">
                ${itemsList.join(' • ')}
            </div>
        `;
    }
    
    totalDiv.textContent = total.toLocaleString();
    document.getElementById('payment-amount').textContent = total.toLocaleString();
}

// Payment Modal
function openPaymentModal(event) {
    if (event) event.preventDefault(); // Prevent form submission    
    const total = parseInt(document.getElementById('donation-total').textContent.replace(/,/g, ''));
    if (total === 0) {
        alert(currentLanguage === 'en' ? 
            'Please select items first' : 
            '請先選擇項目');
        return;
    }
    
    // Show connecting status
    showStatusModal(
        currentLanguage === 'en' ? 'Connecting to STRIPE...' : '正在連接 STRIPE...'
    );
    
    // Simulate connection delay
    setTimeout(() => {
        closeModal('status-modal');
        document.getElementById('payment-amount').textContent = total.toLocaleString();
        openModal('payment-modal');
    }, 2000);
}

function showStatusModal(message) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.setAttribute('data-en', message);
    statusMessage.setAttribute('data-zh', message);
    openModal('status-modal');
}

function processPayment() {
    console.log('processPayment() started');
    
    // Show payment processing status
    closeModal('payment-modal');
    showStatusModal(
        currentLanguage === 'en' ? 'Payment in process...' : '付款處理中...'
    );
    
    // Simulate payment processing delay
    setTimeout(() => {
        closeModal('status-modal');
        completePayment();
    }, 2000);
}

function completePayment() {
    console.log('completePayment() started');
    
    // Set processing flag to prevent navigation
    isProcessingPayment = true;
    console.log('isProcessingPayment set to true');

    // Get payment amount
    const total = parseInt(document.getElementById('payment-amount').textContent.replace(/,/g, ''));
    console.log(`Total payment amount: ${total}`);

    // Track latest payment amount for guest users
    latestPaymentAmount = total;

    // Update user stats
    const userData = currentUser === 'guest' ? mockData.guest : mockData.alice;
    userData.totalDonations += total;
    userData.usedDonations += total;
    console.log(`Updated user stats: totalDonations=${userData.totalDonations}, usedDonations=${userData.usedDonations}`);
    updateUserStats();

    // Keep thank-you box visible and show completion section
    const thankYouBox = document.querySelector('.thank-you-box');
    const completeBox = document.getElementById('donation-complete');

    if (thankYouBox) {
        thankYouBox.style.display = 'block';
        console.log('Thank-you box kept visible');
    }

    if (completeBox) {
        completeBox.style.display = 'block';
        console.log('Completion box displayed');
    }

    // Generate mock blockchain data
    const now = new Date();
    document.getElementById('tx-timestamp').textContent = now.toISOString();
    document.getElementById('tx-amount').textContent = total.toLocaleString();
    document.getElementById('tx-block').textContent = Math.floor(Math.random() * 1000000);
    document.getElementById('tx-hash').textContent = '0x' + Math.random().toString(16).substr(2, 8) + '...';
    console.log('Mock blockchain data generated');

    // Clear selections for next donation (but don't update visuals to avoid side effects)
    selectedItems = { NEEDS: [], LIVES: [] };
    console.log('Selected items cleared');

    // Update card visuals without triggering auto-scroll
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected');
    });
    console.log('Card visuals updated');

    // Scroll to bottom of donation page to show the completion message
    setTimeout(() => {
        const donationPage = document.getElementById('donation-page');
        if (donationPage) {
            donationPage.scrollTo({
                top: donationPage.scrollHeight,
                behavior: 'smooth'
            });
            console.log('Scrolled to bottom of donation page');
        }
    }, 300);

    // Allow navigation again after completion
    isProcessingPayment = false;
    console.log('isProcessingPayment set to false, navigation enabled');
}

// Function to complete the donation flow and allow navigation
function completeDonationFlow() {
    console.log('completeDonationFlow() started');
    isProcessingPayment = false;
    
    // Hide the completion section and reset the thank-you section for next use
    const thankYouBox = document.querySelector('.thank-you-box');
    const completeBox = document.getElementById('donation-complete');
    
    if (thankYouBox) {
        thankYouBox.style.display = 'block';
        console.log('Thank-you box reset for next use');
    }
    
    if (completeBox) {
        completeBox.style.display = 'none';
        console.log('Completion box hidden');
    }
    
    // Navigate to Page 4 (about page) to show donation summary
    showPage('about-page');
    console.log('Navigated to about page');
}

// Technology Modal Management
function openTechModal(techType) {
    const techData = {
        iot: {
            modalId: 'iot-modal',
            imageId: 'iot-image',
            imageConst: IMG_TECH_1
        },
        stablecoin: {
            modalId: 'stablecoin-modal',
            imageId: 'stablecoin-image',
            imageConst: IMG_TECH_2
        },
        insurance: {
            modalId: 'insurance-modal',
            imageId: 'insurance-image',
            imageConst: IMG_TECH_3
        },
        greenfood: {
            modalId: 'greenfood-modal',
            imageId: 'greenfood-image',
            imageConst: IMG_TECH_4
        }
    };
    
    const tech = techData[techType];
    if (tech) {
        // Set the image source
        const imageElement = document.getElementById(tech.imageId);
        imageElement.src = tech.imageConst;
        
        // Open the modal
        openModal(tech.modalId);
    }
}

// About Page Logic
function updateAboutPageStats() {
    const guestData = mockData.guest;
    const aliceData = mockData.alice;
    
    const totalDonations = guestData.totalDonations + aliceData.totalDonations;
    const totalUsed = guestData.usedDonations + aliceData.usedDonations;
    
    // For guest users, show only the latest payment amount
    // For logged-in users (Alice), show their total donations
    const currentUserDonations = currentUser === 'guest' ? latestPaymentAmount : aliceData.totalDonations;
    
    // Update circular visualization
    document.querySelector('.total-box .amount').textContent = `$${totalDonations.toLocaleString()}`;
    document.querySelector('.used-box .amount').textContent = `$${totalUsed.toLocaleString()}`;
    document.getElementById('member-donations').textContent = `$${currentUserDonations.toLocaleString()}`;
}

// Initialize card images using constants
function initializeCardImages() {
    // Create a mapping of constant names to their values
    const imageConstants = {
        IMG_NEEDS_1,
        IMG_NEEDS_2,
        IMG_NEEDS_3,
        IMG_NEEDS_4,
        IMG_LIVES_1,
        IMG_LIVES_2,
        IMG_LIVES_3,
        IMG_LIVES_4,
        IMG_TECH_1,
        IMG_TECH_2,
        IMG_TECH_3,
        IMG_TECH_4
    };
    
    // Set image sources for all cards with data-img-const attribute
    document.querySelectorAll('img[data-img-const]').forEach(img => {
        const constName = img.getAttribute('data-img-const');
        if (imageConstants[constName]) {
            img.src = imageConstants[constName];
        }
    });
}

// Initialize carousel images
function initializeCarouselImages() {
    const carouselImages = document.querySelectorAll('.carousel-image');
    const imageUrls = [IMG_INTRO_1, IMG_INTRO_2, IMG_INTRO_3, IMG_INTRO_4];
    
    carouselImages.forEach((img, index) => {
        if (index < imageUrls.length) {
            img.src = imageUrls[index];
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel with local images
    initializeCarouselImages();
    
    // Initialize card images using constants
    initializeCardImages();
    
    // Set initial language
    updateLanguage();
    updateUserStats();
    
    // Add click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Close any open modal
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });
    
    // Add smooth scrolling for carousels
    document.querySelectorAll('.cards-carousel').forEach(carousel => {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
    
    // Add touch support for mobile
    document.querySelectorAll('.cards-carousel').forEach(carousel => {
        let startX;
        let scrollLeft;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
    
    // Add glowing effect to selected cards
    setInterval(() => {
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.toggle('glow-effect');
        });
    }, 2000);
    
    console.log('Donor Wallet App initialized successfully!');
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Global Error: ${message} at ${source}:${lineno}:${colno}`, error);
};