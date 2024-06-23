// fileSystemSingleton.js
import FileSystem from './fileSystem';

let instance = null;

class SingletonFileSystem {
  constructor() {
    if (!instance) {
      instance = new FileSystem();
    }
    return instance;
  }
}

const fileSystemInstance = new SingletonFileSystem();
Object.freeze(fileSystemInstance);

export default fileSystemInstance;
