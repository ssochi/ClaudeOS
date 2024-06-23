class FileSystemNode {
    constructor(name, isDirectory = false, type = null) {
        this.name = name;
        this.isDirectory = isDirectory;
        this.children = isDirectory ? new Map() : null;
        this.content = isDirectory ? null : "";
        this.parent = null;
        this.type = type;
        this.metadata = {
            createdAt: new Date(),
            modifiedAt: new Date(),
            size: 0
        };
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

    updateContent(content) {
        if (this.isDirectory) throw new Error("Cannot update content of a directory");
        this.content = content;
        this.metadata.modifiedAt = new Date();
        this.metadata.size = content.length;
    }

    toJSON() {
        const children = this.isDirectory ? Array.from(this.children.values()).map(child => child.toJSON()) : null;
        return {
            name: this.name,
            isDirectory: this.isDirectory,
            type: this.type,
            content: this.content,
            children: children,
            metadata: this.metadata
        };
    }

    static fromJSON(json) {
        const node = new FileSystemNode(json.name, json.isDirectory, json.type);
        node.content = json.content;
        node.metadata = json.metadata;
        if (json.children) {
            node.children = new Map(json.children.map(childJSON => [childJSON.name, FileSystemNode.fromJSON(childJSON)]));
        }
        return node;
    }
}

class FileSystem {
    constructor() {
        const savedState = localStorage.getItem('fileSystem');
        if (savedState) {
            this.root = FileSystemNode.fromJSON(JSON.parse(savedState));
        } else {
            this.root = new FileSystemNode("/", true);
        }
        this.currentDirectory = this.root;
    }

    save() {
        localStorage.setItem('fileSystem', JSON.stringify(this.root.toJSON()));
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
        this.save();
        return `Directory created: ${path}`;
    }

    touch(path, type = "text") {
        const parts = path.split("/");
        const fileName = parts.pop();
        const dirPath = parts.join("/") || "/";
        const dir = this.parsePath(dirPath);
        if (dir.children.has(fileName)) {
            return `File already exists: ${path}`;
        }
        const newFile = new FileSystemNode(fileName, false, type);
        dir.addChild(newFile);
        this.save();
        return `File created: ${path}`;
    }

    ls(path = ".") {
        const dir = this.parsePath(path);
        if (!dir.isDirectory) throw new Error(`Not a directory: ${path}`);
        return Array.from(dir.children.values()).map(node => ({
            name: node.name,
            type: node.isDirectory ? "directory" : node.type,
            size: node.metadata.size,
            modifiedAt: node.metadata.modifiedAt
        }));
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
        this.save();
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
        this.save();
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
        this.save();
        return `Moved ${sourcePath} to ${destPath}`;
    }

    updateFile(path, content) {
        const file = this.parsePath(path);
        if (file.isDirectory) throw new Error(`Cannot update a directory: ${path}`);
        file.updateContent(content);
        this.save();
        return `Updated file: ${path}`;
    }

    getFileInfo(path) {
        const node = this.parsePath(path);
        return {
            name: node.name,
            type: node.isDirectory ? "directory" : node.type,
            size: node.metadata.size,
            createdAt: node.metadata.createdAt,
            modifiedAt: node.metadata.modifiedAt
        };
    }
}

export default FileSystem;
