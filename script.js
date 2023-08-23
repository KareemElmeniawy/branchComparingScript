const fs = require('fs');

/**
 * Retrieves the list of files that have changed between two branches.
 *
 * @param {string} baseBranch - The base branch to compare against.
 * @param {string} compareBranch - The branch to compare against the base branch.
 * @return {Array} An array of file names that have changed between the two branches.
 */
function getChangedFiles(baseBranch, compareBranch) {
  const gitDiffCommand = `git diff --name-only ${baseBranch}..${compareBranch}`;

  try {
    const changedFiles = execSync(gitDiffCommand, { encoding: 'utf-8' });
    const fileNames = changedFiles.split('\n').filter(file => file.trim() !== '');

    return fileNames.filter(file => {
      const baseContent = fs.readFileSync(file, 'utf-8');
      const compareContent = execSync(`git show ${compareBranch}:${file}`, { encoding: 'utf-8' });

      return baseContent !== compareContent;
    });
  } catch (error) {
    console.error('Error executing git diff:', error.message);
    return [];
  }
}