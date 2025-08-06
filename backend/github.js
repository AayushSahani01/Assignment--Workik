const express = require("express");
const { Octokit } = require("@octokit/core");
const { generateTestSummaries, generateTestCode } = require("./service.js");

const router = express.Router();

// Fetch repository files
router.post("/files", async (req, res) => {
  const { repoUrl, token } = req.body;
  if (!repoUrl || !token) {
    return res
      .status(400)
      .json({ error: "Repository URL and token are required" });
  }

  try {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents",
      {
        owner,
        repo,
        path: "",
      }
    );
    const jsFiles = response.data.filter(
      (file) => file.name.endsWith(".js") || file.name.endsWith(".jsx")
    );
    res.json(jsFiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Generate test case summaries
router.post("/test-summaries", async (req, res) => {
  const { repoUrl, token, selectedFiles } = req.body;
  if (!selectedFiles || selectedFiles.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one file must be selected" });
  }

  try {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

    const fileContents = await Promise.all(
      selectedFiles.map(async (file) => {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner,
            repo,
            path: file.path,
          }
        );
        const content = Buffer.from(response.data.content, "base64").toString(
          "utf-8"
        );
        return { name: file.name, content };
      })
    );

    const summaries = await generateTestSummaries(fileContents);
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate test summaries" });
  }
});

// Generate test case code
router.post("/test-code", async (req, res) => {
  const { repoUrl, token, file, summary } = req.body;

  try {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: file.path,
      }
    );
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );

    const testCode = await generateTestCode(
      { name: file.name, content },
      summary
    );
    res.json({ testCode });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate test code" });
  }
});

// Create pull request
router.post("/create-pr", async (req, res) => {
  const { repoUrl, token, testCode, testFileName } = req.body;

  try {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");
    const branchName = `test-case-${Date.now()}`;

    // Get reference to main branch
    const refResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/heads/main",
      { owner, repo }
    );
    const mainSha = refResponse.data.object.sha;

    // Create new branch
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    });

    // Create test file
    await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/src/__tests__/{path}",
      {
        owner,
        repo,
        path: `/__tests__/${testFileName}`,
        message: "Add generated test case",
        content: Buffer.from(testCode).toString("base64"),
        branch: branchName,
      }
    );

    // Create PR
    const prResponse = await octokit.request(
      "POST /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        title: "Add generated test cases",
        head: branchName,
        base: "main",
        body: "Automatically generated test cases for selected files.",
      }
    );

    res.json({ prUrl: prResponse.data.html_url });
  } catch (error) {
    res.status(500).json({ error: "Failed to create pull request" });
  }
});

module.exports = { router };
