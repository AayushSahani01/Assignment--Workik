
const generateTestSummaries = async (fileContents) => {
  
  return fileContents.map(file => ({
    id: Math.random().toString(36).substr(2, 9),
    file: file.name,
    summary: `Test case for ${file.name}: Verifies component rendering, props handling, and user interactions.`
  }));
};

const generateTestCode = async (file, summary) => {
  
  return `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${file.name.replace('.jsx', '')} from './${file.name}';

describe('${file.name}', () => {
  it('renders without crashing', () => {
    render(<${file.name.replace('.jsx', '')} />);
    expect(screen.getByTestId('${file.name.replace('.jsx', '').toLowerCase()}-container')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    const props = { exampleProp: 'test' };
    render(<${file.name.replace('.jsx', '')} {...props} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
  `;
};

module.exports = { generateTestSummaries, generateTestCode };
