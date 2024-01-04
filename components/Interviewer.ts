import rl from 'node:readline'

type DescriptionType = {
  lib: string
  ver: string
}

const DEFAULT_LIB = 'eslint'
const DEFAULT_VER = '0.0.1';

const Interviewer = {
  /**
   * Asks user to input lib and version to update
   * 
   * TODO check user input data
   * eg lib has no forbidden chars
   * and verion is correct version for lib
   */
  async getDescription(): Promise<DescriptionType> {
    const readline = rl.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const userLib: string = await new Promise((resolve) => readline.question(`Enter lib name to update version (default 'eslint'): `, (input: string) => resolve(input)))
    const lib = userLib || DEFAULT_LIB

    // TODO show user current version
    const userVer: string = await new Promise((resolve) => readline.question(`Enter new lib version: `, (input: string) => resolve(input)))
    const ver = userVer || DEFAULT_VER

    return {
      lib,
      ver,
    }; 
  }
}

export default Interviewer