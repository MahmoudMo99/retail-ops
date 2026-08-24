export type NotificationType = 'warning' | 'danger';

export interface AppNotification {
  id: string;
  type: NotificationType;
  titleKey: string;
  messageKey: string;
  params: Record<string, string | number>;
  icon: string;
  route: string;
  isRead: boolean;
}
