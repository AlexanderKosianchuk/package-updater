import axios from 'axios'

import { SettingsType, ClientType, } from '../constants/clients'
import CONST from '../constants'
import api from '../constants/api'
import isJson from '../utils/isJson'

class RepoClient {
  client: any = null
  settings: SettingsType

  constructor(client: ClientType) {
    const options = {
      auth: {
        token: CONST.TOKEN,
      },
    }

    this.settings = client.settings
    this.client = new client.Instance(options)
  }

  /**
   * Gets repo master (main) branch
   * that could be checkout for changes
   * 
   * @throws {Error} throws if no main branch
   */
  async getMainBranch() {
    const { data } = await this.client.branching_model.get({
      repo_slug: this.settings.repoSlug,
      workspace: this.settings.wSpace,
    })

    const branch = data?.development?.branch?.name

    if (!branch) {
      throw Error(`No main branch`)
    }

    return branch
  }

  /**
   * Gets file content from repo from chosen branch
   * 
   * @throws {Error} throws if no data or data is not JSON
   */
  async getFile(branch: string) {
    const { data } = await this.client.repositories.readSrc({
      commit: branch,
      repo_slug: this.settings.repoSlug,
      workspace: this.settings.wSpace,
      path: this.settings.filePath,
    })

    if (!data || !isJson(data)) {
      throw Error(`No expected file in branch or invalid format`)
    }

    return data
  }

  /**
   * Makes commit with given file
   *
   * @throws {Error} throws if creation branch with commit failed
   * 
   * TODO this should be done via user provided client
   * temparary solution because not well documented repositories.createSrcFileCommit
   * in https://bitbucketjs.netlify.app
   */
  async createBranchWithCommit(content: string, newVersion: string) {
    const { author, user } = this.settings
    const branch = `${user}/update-lib-version-${Date.now()}`

    const formData = new FormData()
    formData.append('package.json', content)
    formData.append('author', author)
    formData.append('branch', branch)
    formData.append('message', `New version ${newVersion}`)

    const axiosOptions = {
      headers: {
        'Authorization': `Bearer ${CONST.TOKEN}`
      }
    }

    const response = await axios.post(
      api.repoSrc(this.settings),
      formData,
      axiosOptions
    )

    if (response.status >= 400) {
      throw Error(`Create branch with commit failed. Response ${response.data}`)
    }

    return {
      branch,
      request: formData,
      response,
    }
  }

  /**
   * Creates pull request from source branch to target
   * 
   * TODO add author to pull request
   */
  async createPullRequest(source: string, target: string) {
    const body = {
      title: `Pull request from ${source} with lib versions update`,
      source: {
        branch: {
          name: source
        }
      },
      destination: {
        branch: {
          name: target
        }
      },
    }

    const { data } = await this.client.repositories.createPullRequest({
      _body: body,
      repo_slug: this.settings.repoSlug,
      workspace: this.settings.wSpace,
    })

    return {
      response: data
    }
  }
}

export default RepoClient