// fileSystem.js

class FileSystemNode {
    constructor(name, isDirectory = false) {
      this.name = name;
      this.isDirectory = isDirectory;
      this.children = isDirectory ? new Map() : null;
      this.content = isDirectory ? null : "";
      this.parent = null;
    }
  
    addChild(node) {
      if (!this.isDirectory) throw new Error("Cannot add child to a file");
      node.parent = this;
      this.children.set(node.name, node);
    }
  
    removeChild(name) {
      if (!this.isDirectory) throw new Error("Cannot remove child from a file");
      return this.children.delete(name);
    }
  }
  
  class FileSystem {
    constructor() {
      this.root = new FileSystemNode("/", true);
      this.currentDirectory = this.root;
    }
  
    parsePath(path) {
      const parts = path.split("/").filter(Boolean);
      let current = path.startsWith("/") ? this.root : this.currentDirectory;
      for (const part of parts) {
        if (part === "..") {
          current = current.parent || current;
        } else if (part !== ".") {
          if (!current.isDirectory || !current.children.has(part)) {
            throw new Error(`Path not found: ${path}`);
          }
          current = current.children.get(part);
        }
      }
      return current;
    }
  
    mkdir(path) {
      const parts = path.split("/").filter(Boolean);
      let current = path.startsWith("/") ? this.root : this.currentDirectory;
      for (const part of parts) {
        if (!current.children.has(part)) {
          const newDir = new FileSystemNode(part, true);
          current.addChild(newDir);
        }
        current = current.children.get(part);
        if (!current.isDirectory) throw new Error(`${part} is not a directory`);
      }
      return `Directory created: ${path}`;
    }
  
    touch(path) {
      const parts = path.split("/");
      const fileName = parts.pop();
      const dirPath = parts.join("/") || "/";
      const dir = this.parsePath(dirPath);
      if (dir.children.has(fileName)) {
        return `File already exists: ${path}`;
      }
      const newFile = new FileSystemNode(fileName);
      dir.addChild(newFile);
      return `File created: ${path}`;
    }
  
    ls(path = ".") {
      const dir = this.parsePath(path);
      if (!dir.isDirectory) throw new Error(`Not a directory: ${path}`);
      return Array.from(dir.children.keys());
    }
  
    cat(path) {
      const file = this.parsePath(path);
      if (file.isDirectory) throw new Error(`Is a directory: ${path}`);
      return file.content;
    }
  
    cd(path) {
      const newDir = this.parsePath(path);
      if (!newDir.isDirectory) throw new Error(`Not a directory: ${path}`);
      this.currentDirectory = newDir;
      return `Changed directory to: ${path}`;
    }
  
    pwd() {
      const path = [];
      let current = this.currentDirectory;
      while (current !== this.root) {
        path.unshift(current.name);
        current = current.parent;
      }
      return "/" + path.join("/");
    }
  
    rm(path) {
      const parts = path.split("/");
      const name = parts.pop();
      const dirPath = parts.join("/") || "/";
      const dir = this.parsePath(dirPath);
      if (!dir.children.has(name)) throw new Error(`No such file or directory: ${path}`);
      dir.removeChild(name);
      return `Removed: ${path}`;
    }
  
    mv(sourcePath, destPath) {
      const sourceParts = sourcePath.split("/");
      const sourceName = sourceParts.pop();
      const sourceDir = this.parsePath(sourceParts.join("/") || "/");
      const sourceNode = sourceDir.children.get(sourceName);
      if (!sourceNode) throw new Error(`No such file or directory: ${sourcePath}`);
  
      const destParts = destPath.split("/");
      const destName = destParts.pop();
      const destDir = this.parsePath(destParts.join("/") || "/");
      
      if (destDir.children.has(destName)) throw new Error(`Destination already exists: ${destPath}`);
  
      sourceDir.removeChild(sourceName);
      sourceNode.name = destName;
      destDir.addChild(sourceNode);
  
      return `Moved ${sourcePath} to ${destPath}`;
    }
  }
  
  export default FileSystem;