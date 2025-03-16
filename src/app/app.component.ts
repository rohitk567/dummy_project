import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileExplorerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'file-explorer-app';
}
