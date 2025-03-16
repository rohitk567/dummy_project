import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { FileGridComponent } from '../file-grid/file-grid.component';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, FolderTreeComponent, FileGridComponent],
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent {
  constructor() {}
}
