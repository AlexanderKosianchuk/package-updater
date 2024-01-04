import RepoClient from './components/RepoClient'
import FileParser from './components/FileParser'
import Interviewer from './components/Interviewer'
import clients from './constants/clients'

(async () => {
  try {
    // ask user lib name and version to update 
    const { lib, ver } = await Interviewer.getDescription()

    // create client to work with remote repo
    const client = new RepoClient(clients.bitbucket)

    // get main branch to checkout from it and to make pull request in it
    const sourceBranch = await client.getMainBranch()

    // get file to update
    const file = await client.getFile(sourceBranch)

    // update libs verions in file
    const fileProccessed = FileParser.proccess(file, lib, ver)

    // create commit with processed file
    const { branch: targetBranch } = await client.createBranchWithCommit(fileProccessed, ver)

    // create pull request to sourceBranch
    await client.createPullRequest(targetBranch, sourceBranch)

    console.log(`Version in ${lib} updated to ${ver}. Pull request created`)
  } catch (e: any) {
    console.error('Runtime error: ', e?.message)
  }
})()