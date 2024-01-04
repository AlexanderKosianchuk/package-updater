const api = {
  repoSrc: (opts: any) => `https://api.bitbucket.org/2.0/repositories/${opts?.wSpace}/${opts?.repoSlug}/src`
}

export default api