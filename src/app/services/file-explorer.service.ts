import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileItem, TreeNode } from '../models/file-explorer.model';

@Injectable({
  providedIn: 'root',
})
export class FileExplorerService {
  private filesSubject = new BehaviorSubject<FileItem[]>([]);
  private selectedPathSubject = new BehaviorSubject<string>('Root');
  private treeNodesSubject = new BehaviorSubject<TreeNode[]>([]);
  private selectedNodeSubject = new BehaviorSubject<TreeNode | null>(null);

  // Define proper type for file system data
  private fileSystemData: Record<string, any> = {
    Root: {
      Folder002: {
        folder1_1: ['document1.pdf', 'document2.pdf', 'spreadsheet.xlsx'],
        folder1_2: ['presentation.pptx'],
      },
      Folder003: {
        folder3_1: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      },
      Folder004: ['script1.js', 'script2.js', 'styles.css', 'index.html'],
      Applications: ['app1.exe', 'app2.exe', 'app3.dmg', 'installer.msi'],
      Documents: [
        'resume.docx',
        'report.pdf',
        'notes.txt',
        'budget.xlsx',
        'letter.docx',
      ],
      Pictures: [
        'vacation.jpg',
        'family.jpg',
        'party.jpg',
        'screenshot.png',
        'profile.jpg',
      ],
      'README.txt': null,
      'config.json': null,
    },
  };

  constructor() {
    // Initialize data
    this.initializeData();
  }

  private initializeData(): void {
    // Build tree structure
    const treeNodes = this.buildTreeNodes();
    this.treeNodesSubject.next(treeNodes);

    // Set initial files
    this.updateFileList('Root');

    // Set initial selected node
    if (treeNodes.length > 0) {
      this.selectedNodeSubject.next(treeNodes[0]);
    }
  }

  private buildTreeNodes(): TreeNode[] {
    const result: TreeNode[] = [];

    // Root node
    const rootNode: TreeNode = {
      name: 'Root',
      path: 'Root',
      isFolder: true,
      isExpanded: true,
      level: 0,
      children: [],
    };

    // Process children of root - fixed using bracket notation
    this.processTreeLevel(this.fileSystemData['Root'], rootNode, 'Root');

    result.push(rootNode);
    return result;
  }

  private processTreeLevel(
    data: Record<string, any>,
    parentNode: TreeNode,
    parentPath: string
  ): void {
    for (const key in data) {
      const currentPath = `${parentPath}/${key}`;
      const value = data[key];

      if (value === null) {
        // This is a file
        const fileNode: TreeNode = {
          name: key,
          path: currentPath,
          isFolder: false,
          level: parentNode.level + 1,
        };
        parentNode.children = parentNode.children || [];
        parentNode.children.push(fileNode);
      } else if (Array.isArray(value)) {
        // This is a folder with files
        const folderNode: TreeNode = {
          name: key,
          path: currentPath,
          isFolder: true,
          isExpanded: false,
          level: parentNode.level + 1,
          children: [],
        };

        // Add files as children
        value.forEach((fileName) => {
          folderNode.children?.push({
            name: fileName,
            path: `${currentPath}/${fileName}`,
            isFolder: false,
            level: folderNode.level + 1,
          });
        });

        parentNode.children = parentNode.children || [];
        parentNode.children.push(folderNode);
      } else {
        // This is a folder with subfolders
        const folderNode: TreeNode = {
          name: key,
          path: currentPath,
          isFolder: true,
          isExpanded: false,
          level: parentNode.level + 1,
          children: [],
        };

        parentNode.children = parentNode.children || [];
        parentNode.children.push(folderNode);

        // Process subfolders
        this.processTreeLevel(value, folderNode, currentPath);
      }
    }
  }

  getTreeNodes(): Observable<TreeNode[]> {
    return this.treeNodesSubject.asObservable();
  }

  getSelectedNode(): Observable<TreeNode | null> {
    return this.selectedNodeSubject.asObservable();
  }

  getFiles(): Observable<FileItem[]> {
    return this.filesSubject.asObservable();
  }

  getSelectedPath(): Observable<string> {
    return this.selectedPathSubject.asObservable();
  }

  setSelectedPath(path: string, node?: TreeNode): void {
    this.selectedPathSubject.next(path);

    if (node) {
      this.selectedNodeSubject.next(node);
    }

    // If this is a folder, update file list
    if (!node || node.isFolder) {
      this.updateFileList(path);
    } else {
      // If this is a file, update file list for parent folder
      const lastSlashIndex = path.lastIndexOf('/');
      if (lastSlashIndex !== -1) {
        const parentPath = path.substring(0, lastSlashIndex);
        this.updateFileList(parentPath);
      }
    }
  }

  toggleNodeExpanded(node: TreeNode): void {
    node.isExpanded = !node.isExpanded;
    this.treeNodesSubject.next([...this.treeNodesSubject.value]);
  }

  getParentPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      return path.substring(0, lastSlashIndex);
    }
    return path;
  }

  private updateFileList(path: string): void {
    // Split path into segments
    const pathSegments = path
      .split('/')
      .filter((segment) => segment.length > 0);

    // Start at root level
    let currentData: Record<string, any> = this.fileSystemData;

    // Navigate to the current folder
    for (const segment of pathSegments) {
      if (
        currentData &&
        typeof currentData === 'object' &&
        segment in currentData
      ) {
        currentData = currentData[segment];
      } else {
        this.filesSubject.next([]);
        return;
      }
    }

    const files: FileItem[] = [];

    // Process current folder contents
    if (
      currentData &&
      typeof currentData === 'object' &&
      !Array.isArray(currentData)
    ) {
      // It's an object with potential subfolders/files
      for (const key in currentData) {
        const value = currentData[key];

        if (value === null) {
          // This is a file
          files.push({
            name: key,
            type: 'file',
            path: `${path}/${key}`,
          });
        } else if (Array.isArray(value)) {
          // This is a folder with only files
          files.push({
            name: key,
            type: 'folder',
            path: `${path}/${key}`,
          });
        } else {
          // This is a folder with possible subfolders
          files.push({
            name: key,
            type: 'folder',
            path: `${path}/${key}`,
          });
        }
      }
    } else if (Array.isArray(currentData)) {
      // It's an array of filenames
      currentData.forEach((fileName) => {
        files.push({
          name: fileName,
          type: 'file',
          path: `${path}/${fileName}`,
        });
      });
    }

    this.filesSubject.next(files);
  }

  // Helper method to find a node by path
  findNodeByPath(path: string): TreeNode | null {
    // Recursive helper function
    const findNode = (
      nodes: TreeNode[] | undefined,
      searchPath: string
    ): TreeNode | null => {
      if (!nodes) return null;

      for (const node of nodes) {
        if (node.path === searchPath) {
          return node;
        }

        if (node.children) {
          const foundInChildren = findNode(node.children, searchPath);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }

      return null;
    };

    return findNode(this.treeNodesSubject.value, path);
  }
}
