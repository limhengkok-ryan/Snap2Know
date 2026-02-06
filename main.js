const startButton = document.getElementById('start-button');
const captureButton = document.getElementById('capture-button');
const cancelButton = document.getElementById('cancel-button');
const proceedButton = document.getElementById('proceed-button');
const retakeButton = document.getElementById('retake-button');
const cameraStream = document.getElementById('camera-stream');
const photoCanvas = document.getElementById('photo-canvas');
const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const menuOverlay = document.getElementById('menu-overlay');
const menuPanel = document.getElementById('menu-panel');
const themeToggle = document.getElementById('theme-toggle');
const lightIcon = document.getElementById('theme-toggle-light-icon');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const mainHeader = document.getElementById('main-header');
const mainContent = document.getElementById('main-content');

let stream;

// Dynamic Header
const checkHeader = () => {
    const scrollPosition = window.scrollY;
    const cameraActive = cameraStream.style.display === 'block';

    if (scrollPosition > 0 || cameraActive) {
        mainHeader.classList.add('shrunk');
        mainContent.classList.add('shrunk');
    } else {
        mainHeader.classList.remove('shrunk');
        mainContent.classList.remove('shrunk');
    }
};

window.addEventListener('scroll', checkHeader);

// Theme functionality
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    lightIcon.classList.toggle('hidden');
    darkIcon.classList.toggle('hidden');

    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});


// Menu functionality
const toggleMenu = () => {
    menuPanel.classList.toggle('translate-x-full');
    menuOverlay.classList.toggle('hidden');
};

menuButton.addEventListener('click', toggleMenu);
closeMenuButton.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuPanel.classList.contains('translate-x-full')) {
        toggleMenu();
    }
});

class InfoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card {
                    background-color: var(--card-background-color);
                    border-radius: 0.75rem; /* 12px */
                    padding: 1.5rem; /* 24px */
                    box-shadow: 0 10px 15px -3px var(--card-shadow-color), 0 4px 6px -2px var(--card-shadow-color);
                    color: var(--text-color);
                    transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }
                .title {
                    font-size: 1.25rem; /* 20px */
                    font-weight: bold;
                }
                .content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                    margin-top: 0;
                }
                .content.expanded {
                    margin-top: 1rem; /* 16px */
                    max-height: 500px; /* Adjust as needed */
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 0.5rem; /* 8px */
                }
                a {
                    color: #4299e1; /* Same as purchase button for consistency */
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .icon {
                    transition: transform 0.3s ease-out;
                    stroke: var(--icon-stroke-color);
                }
                .icon.expanded {
                    transform: rotate(90deg);
                }
                /* Carousel Styles */
                .carousel-wrapper {
                    position: relative;
                }
                .carousel-container {
                    display: flex;
                    overflow-x: scroll;
                    scroll-behavior: smooth;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                    gap: 1rem;
                    padding-bottom: 1rem;
                }
                .carousel-container::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, and Opera */
                }
                .product-card {
                    flex: 0 0 150px;
                    background-color: var(--card-product-background-color);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    text-align: center;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    transition: background-color 0.3s;
                }
                .product-image {
                    width: 100%;
                    height: 100px;
                    object-fit: contain;
                    margin-bottom: 0.75rem;
                }
                .product-name {
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 0.75rem;
                    height: 40px;
                    color: var(--text-color);
                }
                .purchase-button {
                    display: inline-block;
                    background-color: #4299E1; /* blue-500 */
                    color: white;
                    font-weight: bold;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem; /* 6px */
                    text-decoration: none;
                    transition: background-color 0.3s;
                }
                .purchase-button:hover {
                    background-color: #2B6CB0; /* blue-700 */
                }
                .carousel-nav-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(100, 116, 139, 0.5);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    z-index: 10;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s;
                }
                .carousel-nav-button:hover {
                    background-color: rgba(100, 116, 139, 0.8);
                }
                .prev-btn {
                    left: -20px;
                }
                .next-btn {
                    right: -20px;
                }
                /* Form styles */
                textarea {
                    width: 100%;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    border: 1px solid #ccc;
                    background-color: var(--background-color);
                    color: var(--text-color);
                }
                button[type="submit"] {
                    background-color: #4299E1;
                    color: white;
                    font-weight: bold;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    border: none;
                    cursor: pointer;
                    margin-top: 0.5rem;
                }
            </style>
            <div class="card">
                <div class="header">
                    <h3 class="title">${title}</h3>
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
                <div class="content">
                    <div id="content-area"></div>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.header').addEventListener('click', () => {
            this.shadowRoot.querySelector('.content').classList.toggle('expanded');
            this.shadowRoot.querySelector('.icon').classList.toggle('expanded');
        });
    }

    setData(data, type = 'list') {
        const contentArea = this.shadowRoot.getElementById('content-area');
        contentArea.innerHTML = '';

        if (type === 'product-carousel') {
            const wrapper = document.createElement('div');
            wrapper.className = 'carousel-wrapper';

            const container = document.createElement('div');
            container.className = 'carousel-container';

            data.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                    <p class="product-name">${product.name}</p>
                    <a href="${product.url}" target="_blank" class="purchase-button">Purchase</a>
                `;
                container.appendChild(card);
            });

            wrapper.appendChild(container);

            if (data.length > 2) {
                const prevBtn = document.createElement('button');
                prevBtn.innerHTML = '&#10094;';
                prevBtn.className = 'carousel-nav-button prev-btn';
                prevBtn.onclick = () => {
                    container.scrollBy({ left: -200, behavior: 'smooth' });
                };

                const nextBtn = document.createElement('button');
                nextBtn.innerHTML = '&#10095;';
                nextBtn.className = 'carousel-nav-button next-btn';
                nextBtn.onclick = () => {
                    container.scrollBy({ left: 200, behavior: 'smooth' });
                };
                
                wrapper.appendChild(prevBtn);
                wrapper.appendChild(nextBtn);
            }
            
            contentArea.appendChild(wrapper);

        } else if (type === 'html') {
            contentArea.innerHTML = data;
        } else {
            const list = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });
            contentArea.appendChild(list);
        }
    }
}
customElements.define('info-card', InfoCard);

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    cameraStream.srcObject = stream;
    cameraStream.style.display = 'block';
    photoCanvas.style.display = 'none';
    startButton.style.display = 'none';
    captureButton.style.display = 'block';
    cancelButton.style.display = 'block';
    proceedButton.style.display = 'none';
    retakeButton.style.display = 'none';
    document.getElementById("device-information-section").style.display = "none";
    document.getElementById('recognized-object').textContent = '';
    checkHeader();
  } catch (err) {
    console.error("Error accessing the camera: ", err);
  }
}

function snapPhoto() {
  const context = photoCanvas.getContext('2d');
  photoCanvas.width = cameraStream.videoWidth;
  photoCanvas.height = cameraStream.videoHeight;
  context.drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
  
  stream.getTracks().forEach(track => track.stop());
  
  cameraStream.style.display = 'none';
  captureButton.style.display = 'none';
  cancelButton.style.display = 'none';
  photoCanvas.style.display = 'block';
  proceedButton.style.display = 'block';
  retakeButton.style.display = 'block';
}

function cancelCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    cameraStream.style.display = 'none';
    photoCanvas.style.display = 'none';
    captureButton.style.display = 'none';
    cancelButton.style.display = 'none';
    proceedButton.style.display = 'none';
    retakeButton.style.display = 'none';
    startButton.style.display = 'block';
    document.getElementById("device-information-section").style.display = "none";
    checkHeader();
}

function retakePhoto() {
    photoCanvas.style.display = 'none';
    proceedButton.style.display = 'none';
    retakeButton.style.display = 'none';
    document.getElementById("device-information-section").style.display = "none";
    startCamera();
}

async function proceed() {
    /*
    try {
        const imageData = photoCanvas.toDataURL('image/jpeg').split(',')[1];
        const response = await fetch('http://localhost:3000/clarifai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageData })
        });
        
        const data = await response.json();
        if (data.outputs && data.outputs[0].data.concepts.length > 0) {
            const conceptName = data.outputs[0].data.concepts[0].name;
            document.getElementById('recognized-object').textContent = `(${conceptName})`;
        } else {
            document.getElementById('recognized-object').textContent = '(Object not recognized)';
        }
    } catch (error) {
        console.error('Proxy API Error:', error);
        document.getElementById('recognized-object').textContent = '(API request failed)';
    }
    */

    // Data for the cards
    const readinessItems = [
        "Ensure the mouse is clean and free of debris.",
        "Check the battery level or ensure it is properly connected.",
        "Verify the mouse drivers are up to date."
    ];

    const readinessData = readinessItems.map((item, index) => `
        <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
            <input type="checkbox" id="readiness-${index}" style="accent-color: #4299E1; width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; cursor: pointer;">
            <label for="readiness-${index}" style="cursor: pointer;">${item}</label>
        </div>
    `).join('');

    const quickStartData = [
        "<a href='#'>Connecting your wireless mouse</a>",
        "<a href='#'>Customizing mouse buttons</a>",
        "<a href='#'>Adjusting DPI settings</a>"
    ];
    
    const videoData = [
        '<div class="video-container"><iframe src="https://www.youtube.com/embed/Aiq92X0HxwM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
    ];
    
    const safetyData = [
        "Avoid exposing the mouse to extreme temperatures.",
        "Do not attempt to disassemble the mouse.",
        "Keep away from liquids."
    ];
    
    const serviceProviderData = [
        "<a href='https://www.bestbuy.com/site/services/geek-squad/pcmcat138600050000.c?id=pcmcat138600050000'>Geek Squad</a>",
        "<a href='https://www.ubreakifix.com/'>uBreakiFix</a>",
        "<a href='https://www.staples.com/services/tech-services/'>Staples Tech Services</a>"
    ];
    
    const commonIssuesData = [
        "Cursor is jumpy or lagging.",
        "Mouse is not being detected by the computer.",
        "Buttons are not responding correctly."
    ];
    
    const feedbackData = `
        <form id="feedback-form">
            <textarea id="feedback-text" placeholder="Enter your feedback here..." rows="4"></textarea>
            <button type="submit">Submit</button>
        </form>
    `;

    const similarProductsData = [
      {
          name: 'Logitech MX Master 3S',
          url: 'https://www.amazon.com/Logitech-MX-Master-3S-Graphite/dp/B09HM94V27',
          imageUrl: '/images/logitech-mx-master-3s.jpg'
      },
      {
          name: 'Razer DeathAdder V2',
          url: 'https://www.amazon.com/Razer-DeathAdder-V2-Gaming-Mouse/dp/B082G51NCT',
          imageUrl: '/images/razer-deathadder-v2.jpg'
      },
      {
          name: 'SteelSeries Rival 600',
          url: 'https://www.amazon.com/SteelSeries-Rival-Gaming-Mouse-Programmable/dp/B073W99429',
          imageUrl: '/images/steelseries-rival-600.jpg'
      }
    ];

    // Populate the cards
    document.querySelector('info-card[card-id="readiness-checklist"]').setData(readinessData, 'html');
    document.querySelector('info-card[card-id="quick-start-guides"]').setData(quickStartData);
    document.querySelector('info-card[card-id="videos"]').setData(videoData, 'html');
    document.querySelector('info-card[card-id="safety-instructions"]').setData(safetyData);
    document.querySelector('info-card[card-id="service-provider"]').setData(serviceProviderData);
    document.querySelector('info-card[card-id="common-issues"]').setData(commonIssuesData);
    document.querySelector('info-card[card-id="submit-feedback"]').setData(feedbackData, 'html');
    document.querySelector('info-card[card-id="similar-products"]').setData(similarProductsData, 'product-carousel');

    // Add event listener for the feedback form
    const feedbackCard = document.querySelector('info-card[card-id="submit-feedback"]');
    const feedbackForm = feedbackCard.shadowRoot.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackText = feedbackCard.shadowRoot.getElementById('feedback-text').value;
            console.log("Feedback submitted:", feedbackText);
            alert("Thank you for your feedback!");
            feedbackCard.shadowRoot.getElementById('feedback-text').value = '';
        });
    }

    // Show the information section
    document.getElementById('device-information-section').style.display = 'block';
}

startButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', snapPhoto);
cancelButton.addEventListener('click', cancelCamera);
proceedButton.addEventListener('click', proceed);
retakeButton.addEventListener('click', retakePhoto);
