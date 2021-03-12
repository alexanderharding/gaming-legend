import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  message: string;
  closeMessage = 'ok';
  dismissMessage = 'cancel';

  constructor(private readonly confirmModal: NgbActiveModal) {}

  dismiss(reason: string): void {
    this.confirmModal.dismiss(reason);
  }

  close(reason: string): void {
    this.confirmModal.close(reason);
  }
}
