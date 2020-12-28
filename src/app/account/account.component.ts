import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ctacu-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  submitted = false;
  loading = false;
  readonly user$ = this.authService.currentUser$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,

    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {}

  setLoading(value: boolean): void {
    this.loading = value;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/user']);
  }
}
