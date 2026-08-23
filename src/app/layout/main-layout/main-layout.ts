import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  readonly mobileSidebarOpen = signal(false);

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((isOpen) => !isOpen);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }
}
