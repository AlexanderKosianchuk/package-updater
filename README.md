# Package Updater

This project checks you repo package.json file
and updates version of selected lib.

To run:
```
npm run start
```

in `/constants/clients.ts` there are clients (eg bitbucket) with configs.
Example config for bitbucket, please change it for other repos

```
repoSlug: 'supper-project',
wSpace: 'akos-workspace',
filePath: 'package.json',
author: 'alexanderkosianchuk <email@gmail.com>',
user: 'AlexanderKosianchuk'
```

Auth token could be provided by env var, but example token is set in `/constants/index.ts`
