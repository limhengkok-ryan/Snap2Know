
const startButton = document.getElementById('start-button');
const captureButton = document.getElementById('capture-button');
const cancelButton = document.getElementById('cancel-button');
const proceedButton = document.getElementById('proceed-button');
const retakeButton = document.getElementById('retake-button');
const cameraStream = document.getElementById('camera-stream');
const photoCanvas = document.getElementById('photo-canvas');

let stream;

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
}

function retakePhoto() {
    photoCanvas.style.display = 'none';
    proceedButton.style.display = 'none';
    retakeButton.style.display = 'none';
    startCamera();
}

function proceed() {
    console.log("Proceeding with the photo...");
    // Further functionality will be implemented here
}

startButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', snapPhoto);
cancelButton.addEventListener('click', cancelCamera);
proceedButton.addEventListener('click', proceed);
retakeButton.addEventListener('click', retakePhoto);
