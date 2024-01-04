// FileParser.test.js
import FileParser from '../components/FileParser';

describe('FileParser', () => {
  test('replaces library version in the file', () => {
    const fileContent = '{"react": "16.8.0", "lodash": "4.17.15"}';
    const lib = 'react';
    const newVersion = '17.0.0';

    const result = FileParser.proccess(fileContent, lib, newVersion);

    // Check if the result contains the updated version
    expect(result).toContain(`"${lib}": "${newVersion}"`);
  });

  test('throws error when no changes are made in the file', () => {
    const fileContent = '{"react": "16.8.0", "lodash": "4.17.15"}';
    const lib = 'nonexistentlib';
    const newVersion = '17.0.0';

    // The replacement library is not present in the file, so no changes will be made
    expect(() => FileParser.proccess(fileContent, lib, newVersion)).toThrowError(/No changes in file/);
  });
});