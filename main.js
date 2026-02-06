const startButton = document.getElementById('start-button');
const captureButton = document.getElementById('capture-button');
const cancelButton = document.getElementById('cancel-button');
const proceedButton = document.getElementById('proceed-button');
const retakeButton = document.getElementById('retake-button');
const cameraStream = document.getElementById('camera-stream');
const photoCanvas = document.getElementById('photo-canvas');

let stream;

// --- Clarifai Configuration ---
const USER_ID = 'YOUR_USER_ID';
const PAT = 'YOUR_PAT'; // Your Personal Access Token
const APP_ID = 'YOUR_APP_ID';
const MODEL_ID = 'general-image-recognition';
// ------------------------------

class InfoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background-color: #2D3748; /* gray-800 */
                    border-radius: 0.75rem; /* 12px */
                    padding: 1.5rem; /* 24px */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
                    color: #63B3ED; /* blue-400 */
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .icon {
                    transition: transform 0.3s ease-out;
                }
                .icon.expanded {
                    transform: rotate(90deg);
                }
                .video-container {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    overflow: hidden;
                    max-width: 100%;
                    border-radius: 0.5rem;
                }
                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                textarea {
                    width: 100%;
                    background-color: #4A5568; /* gray-700 */
                    border: 1px solid #718096; /* gray-600 */
                    border-radius: 0.375rem; /* 6px */
                    padding: 0.5rem;
                    color: white;
                    margin-bottom: 1rem;
                }
                button {
                    background-color: #4299E1; /* blue-500 */
                    color: white;
                    font-weight: bold;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem; /* 6px */
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #2B6CB0; /* blue-700 */
                }
            </style>
            <div class="card">
                <div class="header">
                    <h3 class="title">${title}</h3>
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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

        if (type === 'list') {
            const list = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });
            contentArea.appendChild(list);
        } else if (type === 'html') {
            contentArea.innerHTML = data;
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
}

function retakePhoto() {
    photoCanvas.style.display = 'none';
    proceedButton.style.display = 'none';
    retakeButton.style.display = 'none';
    document.getElementById("device-information-section").style.display = "none";
    startCamera();
}

async function proceed() {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": photoCanvas.toDataURL('image/jpeg').split(',')[1]
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    try {
        const response = await fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions);
        const data = await response.json();

        if (data.outputs && data.outputs[0].data.concepts.length > 0) {
            const conceptName = data.outputs[0].data.concepts[0].name;
            document.getElementById('recognized-object').textContent = `(${conceptName})`;
        } else {
            document.getElementById('recognized-object').textContent = '(Object not recognized)';
        }
    } catch (error) {
        console.error('Clarifai API Error:', error);
        document.getElementById('recognized-object').textContent = '(API request failed)';
    }

    // Data for the cards
    const readinessData = [
        "Ensure the mouse is clean and free of debris.",
        "Check the battery level or ensure it is properly connected.",
        "Verify the mouse drivers are up to date."
    ];
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

    // Populate the cards
    document.querySelector('info-card[card-id="readiness-checklist"]').setData(readinessData);
    document.querySelector('info-card[card-id="quick-start-guides"]').setData(quickStartData);
    document.querySelector('info-card[card-id="videos"]').setData(videoData, 'html');
    document.querySelector('info-card[card-id="safety-instructions"]').setData(safetyData);
    document.querySelector('info-card[card-id="service-provider"]').setData(serviceProviderData);
    document.querySelector('info-card[card-id="common-issues"]').setData(commonIssuesData);
    document.querySelector('info-card[card-id="submit-feedback"]').setData(feedbackData, 'html');

    // Add event listener for the feedback form
    const feedbackCard = document.querySelector('info-card[card-id="submit-feedback"]');
    const feedbackForm = feedbackCard.shadowRoot.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedbackText = feedbackCard.shadowRoot.getElementById('feedback-text').value;
        console.log("Feedback submitted:", feedbackText);
        alert("Thank you for your feedback!");
        feedbackCard.shadowRoot.getElementById('feedback-text').value = '';
    });

    // Show the information section
    document.getElementById('device-information-section').style.display = 'block';
}

startButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', snapPhoto);
cancelButton.addEventListener('click', cancelCamera);
proceedButton.addEventListener('click', proceed);
retakeButton.addEventListener('click', retakePhoto);
