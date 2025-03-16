import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerService } from '../../services/file-explorer.service';
import { FileItem, TreeNode } from '../../models/file-explorer.model';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
  files: FileItem[] = [];
  selectedPath = 'Root';
  selectedFiles = new Set<string>();
  treeNodes: TreeNode[] = [];
  flattenedTreeNodes: TreeNode[] = [];

  constructor(private fileExplorerService: FileExplorerService) {}

  ngOnInit() {
    // Get tree nodes
    this.fileExplorerService.getTreeNodes().subscribe((nodes) => {
      this.treeNodes = nodes;
      this.updateFlattenedNodes();
    });

    // Get files
    this.fileExplorerService.getFiles().subscribe((files) => {
      this.files = files;
    });

    // Get selected path
    this.fileExplorerService.getSelectedPath().subscribe((path) => {
      this.selectedPath = path;
    });
  }

  updateFlattenedNodes() {
    this.flattenedTreeNodes = [];
    this.treeNodes.forEach((node) => {
      this.flattenTreeNode(node);
    });
  }

  flattenTreeNode(node: TreeNode) {
    this.flattenedTreeNodes.push(node);

    if (node.isFolder && node.isExpanded && node.children) {
      node.children.forEach((child) => {
        this.flattenTreeNode(child);
      });
    }
  }

  selectNode(node: TreeNode) {
    this.fileExplorerService.setSelectedPath(node.path);
  }

  toggleNode(event: Event, node: TreeNode) {
    event.stopPropagation();

    // Toggle node expanded state
    this.fileExplorerService.toggleNodeExpanded(node);

    // Update flattened nodes list
    this.updateFlattenedNodes();
  }

  onFileClick(file: FileItem) {
    if (file.type === 'folder') {
      this.fileExplorerService.setSelectedPath(file.path);
    }
  }

  toggleSelect(event: Event, file: FileItem) {
    event.stopPropagation();

    if (this.selectedFiles.has(file.path)) {
      this.selectedFiles.delete(file.path);
    } else {
      this.selectedFiles.add(file.path);
    }
  }

  selectAll() {
    if (this.selectedFiles.size === this.files.length) {
      // Deselect all
      this.selectedFiles.clear();
    } else {
      // Select all
      this.selectedFiles.clear();
      this.files.forEach((file) => this.selectedFiles.add(file.path));
    }
  }

  isSelected(file: FileItem): boolean {
    return this.selectedFiles.has(file.path);
  }
}
