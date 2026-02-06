# Snap2Know Application Blueprint

## Overview

Snap2Know is a web-based utility that allows users to take a picture of a device and instantly get relevant information and support resources. It uses the browser's camera and provides a simple, card-based interface to display information.

## Project Outline (Features & Design)

### Core Functionality
*   **Camera Interaction**: Uses `navigator.mediaDevices.getUserMedia` to access the device's camera.
*   **Photo Capture**: Captures a still frame from the video stream onto a `<canvas>`.
*   **Information Display**: Presents information in an organized, collapsible card format.
*   **Workflow Buttons**: "Start", "Capture", "Cancel", "Proceed", "Retake" buttons guide the user through the process.

### Visual Design & UI
*   **Theme**: Includes both a light and a dark theme, with a toggle in the menu. The theme is managed via CSS variables for consistency.
*   **Layout**: Centered, flexbox-based layout for primary content.
*   **Dynamic Header**: 
    *   **Initial State**: The header begins in a tall, expanded state with a large, centered logo.
    *   **Shrunk State**: When the user scrolls down or activates the camera, the header smoothly transitions to a compact state with a smaller logo on the left and a visible menu button on the right.
    *   This provides a modern, content-focused user experience.
*   **Typography**: Clean, readable fonts with a clear hierarchy.
*   **Styling**: Uses TailwindCSS for utility-first styling, complemented by a custom stylesheet for theming and component styles.
*   **Responsiveness**: The layout is responsive and adapts to different screen sizes.

### Web Components
*   **`info-card` Custom Element**: A reusable Web Component for displaying categorized information.
    *   **Structure**: Uses Shadow DOM to encapsulate its styles and structure, preventing conflicts with global styles.
    *   **Content**: Can display a title and various content types, including lists, custom HTML, and a product carousel.
    *   **Interactivity**: Cards are collapsible.

### Information Categories (Cards)
1.  **Readiness Checklist**: Interactive pre-use checks.
2.  **Quick Start Guides**: Links to essential articles.
3.  **Videos**: Embedded YouTube video for visual guidance.
4.  **Common Issues**: A list of frequently encountered problems.
5.  **Safety Instructions**: Important safety warnings.
6.  **Similar Products**: A horizontal carousel of related products.
7.  **Service Provider**: Links to third-party tech support.
8.  **Submit Feedback**: A form for users to submit feedback.

## Current Plan: Dynamic Header Implementation

**Overview:** The dynamic header feature has been successfully implemented. The header now transitions from a large, centered logo to a compact, top-aligned navigation bar upon user interaction (scrolling or camera activation).

**Completed Actions:**
1.  **Updated `index.html`**: Added necessary IDs (`main-header`, `main-content`, etc.) and adjusted the initial structure for the two header states.
2.  **Updated `style.css`**: Created a `.shrunk` class and associated styles to define the compact header state and added `transition` properties for smooth animations.
3.  **Updated `main.js`**: Implemented the `checkHeader` function, which adds or removes the `.shrunk` class based on scroll position and camera activation. The function is triggered by the `scroll` event and also called within the `startCamera` and `cancelCamera` functions.
