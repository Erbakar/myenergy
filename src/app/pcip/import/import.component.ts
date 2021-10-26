import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  @ViewChild('myPond') myPond: any;
  btnDisable = true;
  matTooltipText;
  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here',
    acceptedFileTypes:
      'application/vnd.ms-excel,text/comma-separated-values, text/csv, application/csv , .csv',
    server: {
      url: environment.serverUrl,
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const request = new XMLHttpRequest();
        request.open(
          'POST',
          environment.serverUrl + environment.services.assetsUpload()
        );
        request.upload.onprogress = (e) => {
          progress(e.lengthComputable, e.loaded, e.total);
          this.btnDisable = false;
        };
        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            load(request.responseText);
            sessionStorage.setItem('uploadFile', request.response);
          } else {
            error('oh no');
          }
        };
        request.send(formData);
        return {
          abort: () => {
            request.abort();
            abort();
          },
        };
      },
      revert: (uniqueFileId, load, error) => {
        error(error);
        load();
      },
      load: (uniqueFileId, load, error) => {
        fetch(uniqueFileId)
          .then((res) => res.blob())
          .then((res) => {
            load(new File([res], '', { type: 'image' }));
          })
          .catch(error);
      },
    },
  };

  constructor(public http: ApiRequestService, private snackBar: MatSnackBar) {
    if (localStorage.getItem('language') === 'Türkçe') {
      (this.pondOptions.labelIdle = 'Dosyaları buraya sürükleyebilirsiniz.'),
        (this.matTooltipText =
          'Burada ürünlerinizi bir csv dosyasından içe aktarabilirsiniz. Lütfen formatın örneğimizi karşıladığından emin olun. Bunun yalnızca ürünler ve ürün ayrıntıları verileri için olduğunu unutmayın. Ürün reçetesi gibi diğer ürünle ilgili veriler farklı bir içe aktarmayı gerektirir.');
    } else {
      this.matTooltipText =
        'Here you can import your products from a csv file. Please make sure the format meets our example. Note that this is for products and product details data only. Other product related data like BOM require a different import.';
    }
  }
  importFile() {
    const data = JSON.parse(sessionStorage.getItem('uploadFile'));
    this.http
      .callService(new Method(environment.services.uploadCSV(), data, 'post'))
      .subscribe((res) => {
        if (res === 100) {
          this.snackBar.open('file upload successful', '', {
            duration: 5000,
            panelClass: ['success-snackBar'],
          });
        } else {
          this.snackBar.open('file upload failed', '', {
            duration: 5000,
            panelClass: ['error-snackBar'],
          });
        }
      });
  }
  ngOnInit() {}
}
