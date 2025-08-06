import React from 'react'

const GenerateTestCode = () => {
    const [repoUrl,  setRepoUrl] = useState('');
    const [generatedTestCode, setGeneratedTestCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
     
    const generateTestCode = async(summary) => {
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
        
    }
  return (
    <div>GenerateCode</div>
  )
}

export default GenerateTestCode;