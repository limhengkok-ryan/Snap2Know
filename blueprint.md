# Snap2Know Application Blueprint

## Overview

Snap2Know is a web-based utility that allows users to take a picture of a device and instantly get relevant information and support resources. It uses the browser's camera, Clarifai for image recognition, and provides a simple, card-based interface to display information.

## Project Outline (Features & Design)

### Core Functionality
*   **Camera Interaction**: Uses `navigator.mediaDevices.getUserMedia` to access the device's camera.
*   **Photo Capture**: Captures a still frame from the video stream onto a `<canvas>`.
*   **Image Recognition**: On "Proceed", sends the captured photo to the Clarifai API to identify the object.
*   **Workflow Buttons**: "Start", "Capture", "Cancel", "Proceed", "Retake" buttons guide the user through the process.

### Visual Design & UI
*   **Theme**: Dark theme (`bg-gray-900`, `text-white`).
*   **Layout**: Centered, flexbox-based layout for primary content.
*   **Typography**: Bold, large headline for the app title ("Snap2Know").
*   **Styling**: Uses TailwindCSS for utility-first styling.
*   **Responsiveness**: The layout is responsive and works on different screen sizes.

### Information Display (Web Components)
*   **`info-card` Custom Element**: A reusable Web Component to display categorized information.
    *   **Structure**: Uses Shadow DOM for encapsulation.
    *   **Content**: Displays a `title` and a list of items or custom HTML.
    *   **Interactivity**: Cards are collapsible; clicking the header expands or collapses the content.
*   **Device Name**: Displays a placeholder name ("Delux M700 Mouse") and the recognized object name from Clarifai in parentheses.
*   **Information Categories (Cards)**:
    1.  **Readiness Checklist**: Pre-use checks for the device.
    2.  **Quick Start Guides**: Links to articles for getting started.
    3.  **Videos**: Embedded YouTube video for visual guidance.
    4.  **Safety Instructions**: Important safety warnings.
    5.  **Service Provider**: Links to third-party tech support services.
    6.  **Common Issues**: A list of frequently encountered problems.
    7.  **Submit Feedback**: A form for users to submit feedback.

## Current Plan: Re-integrate Clarifai Image Recognition

**Overview:** Call the Clarifai API when the user clicks "Proceed" to identify the object in the photo. Display the result below the main device title.

**Actionable Steps:**
1.  **Update `index.html`**: Add a `<p>` element with an ID (`recognized-object`) to serve as a placeholder for the Clarifai result.
2.  **Update `main.js` (`proceed` function)**:
    *   Convert the `proceed` function to an `async` function to handle the API call.
    *   Get the base64-encoded image data from the `photo-canvas`.
    *   Construct and send a `fetch` request to the Clarifai `general-image-recognition` model endpoint.
    *   **Important**: Use placeholder constants for the Clarifai PAT (Personal Access Token) and other IDs, and prompt the user to provide them.
    *   Process the API response to extract the name of the top concept (the most likely object).
    *   Update the text content of the `recognized-object` element with the result, formatted in brackets.
    *   Add error handling for the API call.
