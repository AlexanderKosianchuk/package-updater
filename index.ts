import GitClient from './components/GitClient';
import clients from './constants/clients'
import isJson from './utils/isJson'

const TOKEN = 'ATCTT3xFfGN0IoSM8zETAGrblVUMUebmAs82cTng0or0AT-cGhswdiXY6-QmpGKUUOh3_JMx_JiiYwkfavA5DHUtsFzs9RsRBrJPaOHyys17aXW504s-lRUfcatcQWQN9vCnwJRGdiLSpj92Bp6vs8NxVUo7GKaYHdivzzVXJ_IXDwJOn8NA4yo=C2CA8952';
const lib = 'typescript'
const ver = '1.17';

(async () => {
  try {
    const client = new GitClient(clients.bitbucket, TOKEN)
    const sourceBranch = await client.getMainBranch()

    if (!sourceBranch) {
      throw Error(`No main branch`)
    }

    const file = await client.getFile(sourceBranch)

    if (!file || !isJson(file)) {
      throw Error(`No expected file in branch or invalid format`)
    }
    
    const regex = new RegExp(`"${lib}": "([^"]+)"`, 'g');
    const modifiedText = file.replace(regex, `"${lib}": "${ver}"`);

    const commitRes = await client.createBranchWithCommit(modifiedText, ver)
    
    if (!commitRes?.branch) {
      throw Error(`Invalid new branch name`)
    }

    const targetBranch = commitRes.branch
    await client.createPullRequest(targetBranch, sourceBranch)

    console.log(`Version in ${lib} updated to ${ver}. Pull request created`)
  } catch (e) {
    console.error('Execution error', e)
  }
})()