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
import { MatDialog } from '@angular/material/dialog';
import { ProcurementsService } from '@app/myEnergy/procurements/procurements.service';
import { MyenergyInvaiteSupplier } from '@app/shared/dialog/myenergy-invaite-supplier/myenergy-invaite-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnChanges {
  @Output() Suppliers = new EventEmitter<any>();

  @Input() supplierList;
  supplierForm: FormGroup;
  selectedSuppliers = [];
  controls;
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

  ngOnChanges(): void {
    if (this.supplierList) {
      this.createSupplierForm();
    }
  }

  productSupplierSave() {
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.supplierForm.value.supplier)
    )) {
      if (value === true) {
        this.selectedSuppliers.push({
          uuid: key,
          email: '',
          supplier_name: '',
          first_name: '',
          last_name: '',
        });
      } else if (value === false) {
        this.selectedSuppliers.splice(Number(index), 1);
      }
    }
    console.log(this.selectedSuppliers);
    this.Suppliers.emit(this.selectedSuppliers);
  }

  invaiteSupplierModal() {
    const dialogRef = this.dialog.open(MyenergyInvaiteSupplier, {
      width: '80%',
      maxWidth: '680px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.supplierList.unshift(result);
        this.selectedSuppliers.push(result);
      } catch (error) {}
    });
  }

  createSupplierForm() {
    this.controls = {};
    this.supplierList.forEach((sup) => {
      this.controls[sup.uuid] = new FormControl(false);
    });
    this.supplierForm = this.formBuilder.group({
      supplier: this.formBuilder.group(this.controls),
    });
  }
}
