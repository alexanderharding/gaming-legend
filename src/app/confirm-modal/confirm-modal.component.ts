import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  readonly title = 'confirm';
  readonly message: string;
  readonly warningMessage: string;
  readonly infoMessage: string;
  readonly type = 'bg-secondary';
  readonly closeMessage = 'ok';
  readonly dismissMessage = 'cancel';

  constructor(public readonly confirmModal: NgbActiveModal) {}
}
