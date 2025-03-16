import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerService } from '../../services/file-explorer.service';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
})
export class FolderTreeComponent {
  selectedPath = 'Root/Folder1';

  constructor(private fileExplorerService: FileExplorerService) {}

  ngOnInit() {
    this.fileExplorerService.getSelectedPath().subscribe((path) => {
      this.selectedPath = path;
    });
  }

  selectFolder(path: string) {
    this.fileExplorerService.setSelectedPath(path);
  }
}
