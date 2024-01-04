import axios from 'axios'

import { SettingsType, ClientType, } from '../constants/clients'
import api from '../constants/api'

class GitClient {
  client: any = null
  settings: SettingsType
  token: string

  constructor(client: ClientType, token: string) {
    const options = {
      auth: {
        token,
      },
    }

    this.token = token
    this.settings = client.settings
    this.client = new client.Instance(options)
  }

  async getMainBranch() {
    const { data } = await this.client.branching_model.get({
      repo_slug: this.settings.repoSlug,
      workspace: this.settings.wSpace,
    })

    return data?.development?.branch?.name
  }

  async getFile(branch: string) {
    const { data } = await this.client.repositories.readSrc({
      commit: branch,
      repo_slug: this.settings.repoSlug,
      workspace: this.settings.wSpace,
      path: this.settings.filePath,
    })

    return data
  }

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
        'Authorization': `Bearer ${this.token}`
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

export default GitClient