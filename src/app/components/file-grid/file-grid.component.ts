import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerService } from '../../services/file-explorer.service';
import { FileItem } from '../../models/file-explorer.model';

@Component({
  selector: 'app-file-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-grid.component.html',
  styleUrls: ['./file-grid.component.scss'],
})
export class FileGridComponent {
  files: FileItem[] = [];
  selectedPath = 'Root';
  selectedFiles = new Set<string>();

  constructor(private fileExplorerService: FileExplorerService) {}

  ngOnInit() {
    this.fileExplorerService.getFiles().subscribe((files) => {
      this.files = files;
    });

    this.fileExplorerService.getSelectedPath().subscribe((path) => {
      this.selectedPath = path;
    });
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
      this.selectedFiles.clear();
    } else {
      this.selectedFiles.clear();
      this.files.forEach((file) => this.selectedFiles.add(file.path));
    }
  }

  isSelected(file: FileItem): boolean {
    return this.selectedFiles.has(file.path);
  }
}
