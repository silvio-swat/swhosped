// libs/shared/ui/src/lib/shared-standalone.module.ts
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './../../core/notifications/notification.service';

@NgModule({
  imports: [ToastModule],
  exports: [ToastModule],
  providers: [MessageService, NotificationService]
})
export class SharedStandaloneModule {}