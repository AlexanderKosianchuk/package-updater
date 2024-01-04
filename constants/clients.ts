import { Bitbucket } from 'bitbucket'

export type SettingsType = {
  repoSlug: string,
  wSpace: string,
  filePath: string,
  author: string,
  user: string,
}

export type ClientType = {
  Instance: any,
  settings: SettingsType,
}

const clients = {
  bitbucket: {
    Instance: Bitbucket,
    settings: {
      repoSlug: 'supper-project',
      wSpace: 'akos-workspace',
      filePath: 'package.json',
      author: 'alexanderkosianchuk <email@gmail.com>',
      user: 'AlexanderKosianchuk'
    }
  }
}

export default clients