# TypeFlow

TypeFlow is a minimalistic, Monkeytype-inspired web application for testing and improving your typing speed and accuracy. Built with React and Tailwind CSS, it offers a distraction-free, highly responsive experience across both desktop and mobile devices.

## Features

- **Multiple Test Modes:** 
  - **Time Mode:** Test your typing speed in a set amount of time (e.g., 15s, 30s, 60s, 120s).
  - **Word Mode:** Test how fast you can type a specific number of words.
- **Difficulty Levels:** Adjustable difficulty ranging from easy to insane.
- **Punctuation & Numbers:** Toggle the inclusion of punctuation and numbers to challenge yourself further.
- **Real-time Statistics:** Live tracking of WPM (Words Per Minute) and Accuracy as you type.
- **Responsive Design:** Optimized for both desktop and mobile devices with seamless virtual keyboard support.
- **Dark/Light Theme:** A beautiful, sleek UI with smooth transitions built with Tailwind CSS.

## Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** TypeScript
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or download the source code.
2. Open your terminal and navigate to the project directory.
3. Install the dependencies using npm:

```bash
npm install
```

### Running the App Locally

To start the development server, run:

```bash
npm run dev
```

Then, open your browser and go to the local URL provided in the terminal (usually `http://localhost:5173`) to see the app in action.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized static files that are ready to be deployed.

## Project Structure
- `src/components/`: Contains all reusable React components like `TypingArea`, `Header`, `LiveStats`, `Results`, etc.
- `src/hooks/`: Contains custom hooks like `useTypingTest` which manages the core typing engine and state logic.
- `src/utils/`: Contains utility functions and types (e.g., word generation logic).

---
