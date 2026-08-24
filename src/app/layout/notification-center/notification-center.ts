import { Component, ElementRef, HostListener, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AppNotification } from '../../core/models/notification.model';
import { NotificationsService } from '../../core/services/notifications';

@Component({
  selector: 'app-notification-center',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss',
})
export class NotificationCenter {
  private readonly router = inject(Router);

  private readonly elementRef = inject(ElementRef);

  readonly notificationsService = inject(NotificationsService);

  readonly closed = output<void>();

  openNotification(notification: AppNotification): void {
    this.notificationsService.markAsRead(notification.id);

    this.closed.emit();

    this.router.navigateByUrl(notification.route);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closed.emit();
    }
  }
}
