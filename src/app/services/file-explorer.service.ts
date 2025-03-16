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
        { name: 'Folder 002', type: 'folder', path: 'Root/Folder002' },
        { name: 'Folder 003', type: 'folder', path: 'Root/Folder003' },
        { name: 'Folder 004', type: 'folder', path: 'Root/Folder004' },
        { name: 'Applications', type: 'folder', path: 'Root/Applications' },
        { name: 'Documents', type: 'folder', path: 'Root/Documents' },
        { name: 'Pictures', type: 'folder', path: 'Root/Pictures' },
        { name: 'README.txt', type: 'file', path: 'Root/README.txt' },
        { name: 'config.json', type: 'file', path: 'Root/config.json' },
      ];
    } else if (path === 'Root/Folder002') {
      files = [
        {
          name: 'document1.pdf',
          type: 'file',
          path: 'Root/Folder002/document1.pdf',
        },
        {
          name: 'document2.pdf',
          type: 'file',
          path: 'Root/Folder002/document2.pdf',
        },
        {
          name: 'spreadsheet.xlsx',
          type: 'file',
          path: 'Root/Folder002/spreadsheet.xlsx',
        },
        {
          name: 'presentation.pptx',
          type: 'file',
          path: 'Root/Folder002/presentation.pptx',
        },
      ];
    } else if (path === 'Root/Folder003') {
      files = [
        { name: 'image1.jpg', type: 'file', path: 'Root/Folder003/image1.jpg' },
        { name: 'image2.jpg', type: 'file', path: 'Root/Folder003/image2.jpg' },
        { name: 'image3.jpg', type: 'file', path: 'Root/Folder003/image3.jpg' },
      ];
    } else if (path === 'Root/Folder004') {
      files = [
        { name: 'script1.js', type: 'file', path: 'Root/Folder004/script1.js' },
        { name: 'script2.js', type: 'file', path: 'Root/Folder004/script2.js' },
        { name: 'styles.css', type: 'file', path: 'Root/Folder004/styles.css' },
        { name: 'index.html', type: 'file', path: 'Root/Folder004/index.html' },
      ];
    } else if (path === 'Root/Applications') {
      files = [
        { name: 'app1.exe', type: 'file', path: 'Root/Applications/app1.exe' },
        { name: 'app2.exe', type: 'file', path: 'Root/Applications/app2.exe' },
        { name: 'app3.dmg', type: 'file', path: 'Root/Applications/app3.dmg' },
        {
          name: 'installer.msi',
          type: 'file',
          path: 'Root/Applications/installer.msi',
        },
      ];
    } else if (path === 'Root/Documents') {
      files = [
        {
          name: 'resume.docx',
          type: 'file',
          path: 'Root/Documents/resume.docx',
        },
        { name: 'report.pdf', type: 'file', path: 'Root/Documents/report.pdf' },
        { name: 'notes.txt', type: 'file', path: 'Root/Documents/notes.txt' },
        {
          name: 'budget.xlsx',
          type: 'file',
          path: 'Root/Documents/budget.xlsx',
        },
        {
          name: 'letter.docx',
          type: 'file',
          path: 'Root/Documents/letter.docx',
        },
      ];
    } else if (path === 'Root/Pictures') {
      files = [
        {
          name: 'vacation.jpg',
          type: 'file',
          path: 'Root/Pictures/vacation.jpg',
        },
        { name: 'family.jpg', type: 'file', path: 'Root/Pictures/family.jpg' },
        { name: 'party.jpg', type: 'file', path: 'Root/Pictures/party.jpg' },
        {
          name: 'screenshot.png',
          type: 'file',
          path: 'Root/Pictures/screenshot.png',
        },
        {
          name: 'profile.jpg',
          type: 'file',
          path: 'Root/Pictures/profile.jpg',
        },
      ];
    }

    this.filesSubject.next(files);
  }
}
