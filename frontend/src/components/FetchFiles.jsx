import React, { useState } from 'react';
import axios from 'axios';

const FetchFiles = () => {
    const [repoUrl,  setRepoUrl] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [, setError] = useState('');
    const [, setFiles] = useState([]); 
    
    const fetchFiles = async() => {
       if (!repoUrl || !token) {
        setError ('Repository URL and token are required');
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
    }
    return (
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
        <button onClick={fetchFiles} disabled={loading} className="button">
          {loading ? 'Loading...' : 'Fetch Files'}
        </button>
      </div>
    );
};

export default FetchFiles;