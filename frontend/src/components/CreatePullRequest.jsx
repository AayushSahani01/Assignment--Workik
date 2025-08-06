import React from 'react'

const CreatePullRequest = () => {
    const [repoUrl, setRepoUrl] = useState('');
      const [token, setToken] = useState('');
      const [files, setFiles] = useState([]);
      const [selectedFiles, setSelectedFiles] = useState([]);
      const [testCaseSummaries, setTestCaseSummaries] = useState([]);
      const [generatedTestCode, setGeneratedTestCode] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
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
    <>
    
    </>
  )
}

export default CreatePullRequest