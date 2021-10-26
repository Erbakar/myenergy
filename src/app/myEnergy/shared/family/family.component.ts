import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonService } from '@app/core/common.service';
import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  familyData;
  familyForm: FormGroup;
  @Output() setBrickUuid = new EventEmitter<string>();
  constructor(
    public procurementsService: ProcurementsService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.createFamilyForm();
  }

  ngOnInit(): void {
    if (!this.commonService.familyData) {
      this.procurementsService.getFamily().then((res) => {
        this.familyData = res;
        this.commonService.familyData = res;
      });
    } else {
      this.familyData = this.commonService.familyData;
    }
  }
  selectedBrick(req: boolean) {
    this.familyForm.value.req = req;
    this.setBrickUuid.emit(this.familyForm.value);
    console.log(this.familyForm.value);
  }
  private createFamilyForm() {
    this.familyForm = this.formBuilder.group({
      description: ['', Validators.required],
      brick_uuid: ['Select', Validators.required],
    });
  }
}
