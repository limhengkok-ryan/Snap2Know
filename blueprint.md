# Snap2Know Application Blueprint

## Overview

Snap2Know is a web-based utility that allows users to take a picture of a device and instantly get relevant information and support resources. It uses the browser's camera and provides a simple, card-based interface to display information.

## Project Outline (Features & Design)

### Core Functionality
*   **Camera Interaction**: Uses `navigator.mediaDevices.getUserMedia` to access the device's camera.
*   **Photo Capture**: Captures a still frame from the video stream onto a `<canvas>`.
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
*   **Device Name**: Displays the name of the identified device (e.g., "Delux M700 Mouse").
*   **Information Categories (Cards)**:
    1.  **Readiness Checklist**: Pre-use checks for the device.
    2.  **Quick Start Guides**: Links to articles for getting started.
    3.  **Videos**: Embedded YouTube video for visual guidance.
    4.  **Safety Instructions**: Important safety warnings.
    5.  **Service Provider**: Links to third-party tech support services.
    6.  **Common Issues**: A list of frequently encountered problems.
    7.  **Submit Feedback**: A form for users to submit feedback.

## Current Plan: Add Feedback Card

**Overview:** Add a new card to the interface that allows users to submit feedback about their experience.

**Actionable Steps:**
1.  **Update `index.html`**: Add a new `<info-card>` element to the main grid for the feedback form.
2.  **Refactor `main.js`**:
    *   Modify the `info-card` web component to support rendering arbitrary HTML content in addition to a list.
    *   Update the `InfoCard`'s click handler to only trigger collapse/expand when the header is clicked, allowing interaction with form elements in the content.
    *   Add specific styles for the feedback form elements (textarea, button) inside the component's Shadow DOM.
3.  **Implement Feedback Form**:
    *   In the `proceed()` function, create the HTML for a feedback form.
    *   Use the `setData()` method with a new `type` parameter (`'html'`) to inject the form into the feedback card.
    *   Attach a `submit` event listener to the form that prevents default submission, logs the feedback to the console, and shows an alert to the user.
