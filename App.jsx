 import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testCaseSummaries, setTestCaseSummaries] = useState([]);
  const [generatedTestCode, setGeneratedTestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFiles = async () => {
    if (!repoUrl || !token) {
      setError('Repository URL and token are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/github/files', { repoUrl, token });
      setFiles(response.data);
    } catch (err) {
      setError('Failed to fetch files. Check your repository URL and token.', err);
    }
    setLoading(false);
  };

  const generateTestSummaries = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/github/test-summaries', {
        repoUrl,
        token,
        selectedFiles

      });
      setTestCaseSummaries(response.data);
    } catch (err) {
      setError('Failed to generate test summaries.',err);
    }
    setLoading(false);
  };

  const generateTestCode = async (summary) => {
    setLoading(true);
    setError('');
    try {
      const file = files.find(f => f.name === summary.file);
      const response = await axios.post('http://localhost:5000/api/github/test-code', {
        repoUrl,
        token,
        file,
        summary
      });
      setGeneratedTestCode(response.data.testCode);
    } catch (err) {
      setError('Failed to generate test code.',err);
    }
    setLoading(false);
  };

  const createPullRequest = async () => {
    if (!generatedTestCode) {
      setError('No test code to create PR.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const testFileName = `${testCaseSummaries[0].file.replace('.jsx', '.test.js')}`;
      const response = await axios.post('http://localhost:5000/api/github/create-pr', {
        repoUrl,
        token,
        testCode: generatedTestCode,
        testFileName
      });
      alert(`Pull request created: ${response.data.prUrl}`);
    } catch (err) {
      setError('Failed to create pull request.', err);
    }
    setLoading(false);
  };

  return (
    <div className="container ">
      <h1 className='text-lg text-center font-bold font-serif gap-0.5 underline '>Test Case Generator</h1>
      
      {/* Repository Input */}
      <div className="section">
        <input
          type="text"
          placeholder="GitHub Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="GitHub Personal Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="input"
        />
        <div className='flex justify-center items-center'>
        <button onClick={fetchFiles} disabled={loading} className="button">
          {loading ? 'Loading...' : `Fetch Files`}
        </button>
      </div>
      </div>

      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* File Selection */}
      <div className="section">
        <h2>Select Files</h2>
        <div className="file-grid">
          {files.map(file => (
            <div key={file.path} className="file-item">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file)}
                onChange={() => {
                  setSelectedFiles(prev =>
                    prev.includes(file)
                      ? prev.filter(f => f !== file)
                      : [...prev, file]
                  );
                }}
              />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={generateTestSummaries}
          disabled={loading || selectedFiles.length === 0}
          className="button"
        >
          {loading ? 'Generating...' : 'Generate Test Summaries'}
        </button>
      </div>

      {/* Test Case Summaries */}
      {testCaseSummaries.length > 0 && (
        <div className="section">
          <h2>Test Case Summaries</h2>
          <ul className="summary-list">
            {testCaseSummaries.map(summary => (
              <li key={summary.id}>
                <span>{summary.summary}</span>
                <button
                  onClick={() => generateTestCode(summary)}
                  disabled={loading}
                  className="button small"
                >
                  Generate Code
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generated Test Code */}
      {generatedTestCode && (
        <div className="section">
          <h2>Generated Test Code</h2>
          <pre className="code-block">{generatedTestCode}</pre>
          <button
            onClick={createPullRequest}
            disabled={loading}
            className="button"
          >
            {loading ? 'Creating PR...' : 'Create Pull Request'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App ;