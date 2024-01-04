const FileParser = {
  /**
   * Replaces in file lib version with new one
   * 
   * TODO check is new version is lower than current
   * and make alert and user confirmation for replacing
   */
  proccess(file: string, lib: string, replacement: string) {
    const regex = new RegExp(`"${lib}": "([^"]+)"`, 'g')

    const replaced = file.replace(regex, `"${lib}": "${replacement}"`)

    if (file === replaced) {
      throw Error(`No changes in file (lib not found or version not changed)`)
    }

    return replaced
  }
}

export default FileParser