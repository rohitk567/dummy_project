export interface FileItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
}

export interface TreeNode {
  name: string;
  path: string;
  isExpanded?: boolean;
  isFolder: boolean;
  children?: TreeNode[];
  level: number;
}
