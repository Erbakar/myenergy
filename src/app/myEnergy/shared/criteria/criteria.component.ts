import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
})
export class CriteriaComponent implements OnChanges {
  controls;
  allCriteria;
  criteriaData;
  labelsSplitData;
  criteriaArray = [];
  critariaButtonActive = false;
  labelsData;
  criteriaForm: FormGroup;
  @Output() selectedCriterias = new EventEmitter<any>();
  @Input() brick = '';
  constructor(
    private formBuilder: FormBuilder,
    public procurementsService: ProcurementsService,
    private commonService: CommonService
  ) {}

  async setCriterias(familyData: any) {
    if (familyData?.req) {
      await this.allCriteria.forEach((item) => {
        item.criteria.forEach((cr) => {
          cr.match = false;
        });
      });
      await this.procurementsService
        .subCategoryCriteria(familyData.brick_uuid)
        .then((res) => {
          this.allCriteria.forEach((item) => {
            item.criteria.forEach((cr) => {
              res.forEach((ri) => {
                if (ri.uuid === cr.uuid) {
                  cr.match = true;
                }
              });
            });
          });
          this.criteriaData = res;
          this.labelsSplitData = '';
          this.createCriteriaForm();
        });
    }
  }
  async ngOnChanges() {
    if (!this.commonService.allCriteria) {
      this.procurementsService.allCriteria().then((res) => {
        this.allCriteria = res;
        this.commonService.allCriteria = res;
      });
    } else {
      this.allCriteria = this.commonService.allCriteria;
    }
    await this.setCriterias(this.brick);
  }

  criteriaSubmit() {
    this.criteriaArray = [];
    for (const [key, value] of Object.entries(
      this.criteriaForm.value.criteria
    )) {
      if (value === true) {
        this.criteriaArray.push(key);
      }
      this.critariaButtonActive = this.criteriaArray.length > 0 ? true : false;
    }
    this.selectedCriterias.emit(this.criteriaArray);
  }

  private createCriteriaForm() {
    this.controls = {};
    this.allCriteria.forEach((cr) => {
      cr.criteria.forEach((item) => {
        this.controls[item.uuid] = new FormControl(false);
      });
    });
    this.criteriaForm = this.formBuilder.group({
      criteria: this.formBuilder.group(this.controls),
    });
  }
}
