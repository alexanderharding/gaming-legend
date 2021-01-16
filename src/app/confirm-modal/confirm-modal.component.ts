import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  title = 'confirm';
  message: string;
  warningMessage: string;
  infoMessage: string;
  type = 'bg-secondary';
  closeMessage = 'ok';
  dismissMessage = 'cancel';

  constructor(private readonly confirmModal: NgbActiveModal) {}

  dissmiss(reason: string): void {
    this.confirmModal.dismiss(reason);
  }

  close(reason: string): void {
    this.confirmModal.close(reason);
  }
}
