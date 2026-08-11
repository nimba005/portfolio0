# Eric John Nimba Portfolio

Personal portfolio website for Eric John Nimba, focused on full-stack software engineering, AI workflows, automation, climate technology, dashboards, and data-driven systems.

## What Changed

The portfolio has been moved from a single static HTML page into a React + Vite application.

The new structure is:

- `index.html` - Vite entry HTML and SEO metadata
- `src/App.jsx` - main React portfolio content
- `src/main.jsx` - React app entry point
- `src/styles.css` - clean responsive UI styling
- `assets/` - existing images, favicon files, and CV assets

## New UI Direction

The new portfolio uses:

- the original left-sidebar desktop identity
- a hamburger menu on tablet and mobile screens
- a stronger hero background with warm gold and deep emerald contrast
- clean light section backgrounds
- stronger hero copy
- clearer section hierarchy
- project cards with practical impact statements
- project category filtering
- cleaner skills grouping
- stronger contact call to action
- responsive layouts for desktop and mobile

## Run Locally

From Windows PowerShell:

```powershell
cd "C:\Users\Erick\portfolio0"
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Build For Deployment

```powershell
cd "C:\Users\Erick\portfolio0"
npm run build
```

The production files will be generated in:

```text
dist/
```

## Preview Production Build

```powershell
npm run preview
```

## Content Updates

Most visible portfolio content is now controlled in:

```text
src/App.jsx
```

Update these arrays to change the content:

- `projects`
- `work`
- `skills`
- `experience`
- `education`

Update the visual design in:

```text
src/styles.css
```

## Profile Image

The current profile image is:

```text
assets/img/passport-new.jpg
```

To change it, replace that file with your new photo and keep the same file name:

```text
passport-new.jpg
```

Recommended image style:

- clear professional headshot
- square image if possible
- at least 600 x 600 pixels
- JPG format

## Existing Assets

Only the images used by the React portfolio are kept in:

```text
assets/
```

The current CV link points to:

```text
assets/resume/Nimba_CV.pdf
```
