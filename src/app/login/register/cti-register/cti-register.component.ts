import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cti-register',
  templateUrl: './cti-register.component.html',
  styleUrls: ['./cti-register.component.scss'],
})
export class CtiRegisterComponent implements OnInit {
  preregisterForm: FormGroup;
  isLoading = false;
  error: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm();
  }

  ngOnInit() {}

  registerCti() {
    this.router.navigate(['/type-form']);
  }

  private registerForm() {
    this.preregisterForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
}
