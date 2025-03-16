import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileItem } from '../models/file-explorer.model';

@Injectable({
  providedIn: 'root',
})
export class FileExplorerService {
  private filesSubject = new BehaviorSubject<FileItem[]>([]);
  private selectedPathSubject = new BehaviorSubject<string>('Root');

  constructor() {
    // Load initial data
    this.setDefaultFiles();
  }

  getFiles(): Observable<FileItem[]> {
    return this.filesSubject.asObservable();
  }

  getSelectedPath(): Observable<string> {
    return this.selectedPathSubject.asObservable();
  }

  setSelectedPath(path: string): void {
    this.selectedPathSubject.next(path);
    this.updateFiles(path);
  }

  private setDefaultFiles(): void {
    // Initialize with root content
    this.updateFiles('Root');
  }

  private updateFiles(path: string): void {
    let files: FileItem[] = [];

    if (path === 'Root') {
      files = [
        { name: 'Folder1', type: 'folder', path: 'Root/Folder1' },
        { name: 'File1', type: 'file', path: 'Root/File1' },
        { name: 'File2', type: 'file', path: 'Root/File2' },
        { name: 'Folder2', type: 'folder', path: 'Root/Folder2' },
      ];
    } else if (path === 'Root/Folder1') {
      files = [
        { name: 'File1', type: 'file', path: 'Root/Folder1/File1' },
        { name: 'File2', type: 'file', path: 'Root/Folder1/File2' },
      ];
    } else if (path === 'Root/Folder2') {
      files = [];
    }

    this.filesSubject.next(files);
  }
}
