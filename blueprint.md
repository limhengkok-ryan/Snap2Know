# Snap2Know Blueprint

## Overview

Snap2Know is a web application that allows users to take a photo and get information about it.

## Current State (v5)

*   **HTML (`index.html`):**
    *   Styled with Tailwind CSS.
    *   "Start", "Capture", "Cancel", "Proceed", and "Retake" buttons for camera control.
*   **CSS (`style.css`):**
    *   (Currently empty or with default styles)
*   **JavaScript (`main.js`):**
    *   JavaScript logic for starting, capturing, canceling, and retaking photos.
    *   Includes a placeholder `proceed()` function.

## Current Request: Use Back Camera

### Plan

1.  **Update `main.js`:**
    *   In the `startCamera()` function, modify the `getUserMedia` call to specify the back camera using `facingMode: 'environment'`.
