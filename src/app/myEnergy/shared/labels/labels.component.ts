import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnChanges {
  @Output() selectedLabels = new EventEmitter<any>();
  @Input() criterias = '';
  controls;
  labelUuids;
  labelsData;
  labelsSplitData;
  showLabelsForm = false;
  labelsButtonActive = false;
  allSelectedClass1 = false;
  allSelectedClass2 = false;
  labelsForm: FormGroup;
  constructor(
    private procurementsService: ProcurementsService,
    private formBuilder: FormBuilder
  ) {}
  ngOnChanges() {
    if (this.criterias.length > 0) {
      this.getLabels();
    }
  }

  selectLabelList(match?: any, index?: any) {
    this.labelUuids = [];
    for (const [key, value] of Object.entries(this.labelsForm.value.labels)) {
      if (value === true) {
        this.labelUuids.push(key);
      }
      this.labelsData.forEach((lab) => {
        if (key === lab.uuid) {
          lab.selected = value;
        }
      });
      this.labelsButtonActive = this.labelUuids.length > 0 ? true : false;
    }
    if (match) {
      const isAllSelected = this.labelsData.some(
        (lab) => lab.match === match && lab.selected === false
      );
      if (index === 0) {
        this.allSelectedClass1 = !isAllSelected;
      }
      if (index === 1) {
        this.allSelectedClass2 = !isAllSelected;
      }
    }
  }

  async allLabelSelected(match: any, index: any) {
    this.labelUuids = [];
    if (index === 0) {
      this.allSelectedClass1 = !this.allSelectedClass1;
      await this.labelsData.forEach((lab) => {
        if (lab.match === match) {
          lab.selected = this.allSelectedClass1;
        }
      });
    }
    if (index === 1) {
      this.allSelectedClass2 = !this.allSelectedClass2;
      await this.labelsData.forEach((lab) => {
        if (lab.match === match) {
          lab.selected = this.allSelectedClass2;
        }
      });
    }
    this.labelsData.forEach((lab) => {
      if (lab.selected) {
        this.labelUuids.push(lab.uuid);
      }
    });
    await this.createLabelsForm();
  }
  labelsSubmit() {
    this.selectedLabels.emit(this.labelUuids);
  }
  getLabels() {
    this.procurementsService
      .getCriteriaLabels(this.criterias.toString().replace(/\,/gi, '&id='))
      .then((res) => {
        this.labelsData = res;
        this.createLabelsForm();
        const labelsSplitData = this.labelsData.reduce((label, curr) => {
          if (label[curr.match]) {
            label[curr.match].push(curr);
          } else {
            Object.assign(label, { [curr.match]: [curr] });
          }
          return label;
        }, {});
        const temp = [];
        for (const [key, value] of Object.entries(labelsSplitData)) {
          temp.push(value);
        }
        this.labelsSplitData = temp.reverse();
      });
  }

  private createLabelsForm() {
    this.controls = {};
    this.labelsData.forEach((label) => {
      if (label.selected) {
        this.controls[label.uuid] = true;
      } else {
        this.controls[label.uuid] = false;
      }
    });
    this.labelsForm = this.formBuilder.group({
      labels: this.formBuilder.group(this.controls),
    });
    this.showLabelsForm = true;
  }
}
