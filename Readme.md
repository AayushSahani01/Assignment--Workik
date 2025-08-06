# Test Case Generator

A web application that automatically generates test cases for React components and creates pull requests with the generated tests.

## Technologies Used

### Frontend
- React 19.1.0 with Vite
- Tailwind CSS 4.1.11
- Axios for API calls
- ESLint for code linting

### Backend
- Node.js with Express 5.1.0
- Octokit for GitHub API integration
- CORS for cross-origin requests

## Features

### Current Features
- GitHub repository integration
- File fetching from repositories
- Automatic test case generation
- Test code generation for React components
- Automated pull request creation
- React component testing templates

### Upcoming Features
- Support for TypeScript components
- Multiple test framework options
- Custom test template configuration
- Batch test generation
- Test coverage reporting

## Getting Started

### 1. Clone the repository

```
git clone <repository-url>
```
### 2. Install dependencies
``` 
npm install 
```
## Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
```
npm install
```
### 3. Start the development servers
```
npm run dev
```

# Start frontend server
cd frontend
```
npm run dev
```

### 4. Configure environment variables
- Add your GitHub Personal Access Token
- Configure backend API endpoints

## Project Structure

```
├── backend/                # Backend server files
│   ├── github.js          # GitHub API integration
│   ├── server.js          # Test generation logic
│   └── index.js           # Express server setup
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main application
│   │   └── main.jsx      # Entry point
│   └── vite.config.js     # Vite configuration
```

## Usage

1. Enter your GitHub repository URL
2. Provide your GitHub Personal Access Token
3. Select the files for test generation
4. Review generated test summaries
5. Generate test code
6. Create pull request with generated tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

 