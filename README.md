# Large Data Visualization Task

A Next.js-based data visualization project utilizing Plotly.js for interactive data representation.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Project

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

### Key Dependencies
- **Plotly.js**: For interactive charts and graphs
- **Papa Parse**: For CSV data parsing
- **Next.js**: React framework
- **TypeScript**: For type-safe code

### Key Files
- `@Controls.tsx`: Component for animation controls (S, N, T, P variables)
- `@FileUpload.tsx`: Component for CSV file upload and data chunking
- `@WindowStats.tsx`: Component for displaying window statistics (min, max, average, variance)
- `@index.tsx`: Main page component handling data visualization and animation
- `@downsampling.ts`: Utility for downsampling data points for efficient rendering

### Scripts
- `npm run dev`: Starts development server with Turbopack

## Author
Maciej Wójcik
