import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  initPatica,
  openPatica,
  hidePatica,
  goToModulePatica,
} from '../../../../assets/javascript/patica';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import { MaterialsComponent } from '@app/cti/materials/materials.component';
declare var $: any;
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @ViewChild('myPond') myPond: any;
  fName = '';
  active = false;
  errorMessage;
  unitId;
  contents: any[];
  name = '';
  fileName;
  pondOptions;
  constructor(
    private http: ApiRequestService,
    private materialsComponent: MaterialsComponent
  ) {
    this.unitId = localStorage.getItem('unitId');

    this.pondOptions = {
      class: 'my-filepond',
      multiple: false,
      labelIdle: 'IMPORT DATA',
      acceptedFileTypes:
        'application/vnd.ms-excel,text/comma-separated-values, text/csv, application/csv , .csv',
      server: {
        url: environment.serverUrl,
        process: async (
          fieldName,
          file,
          metadata,
          load,
          error,
          progress,
          abort
        ) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          const request = new XMLHttpRequest();
          request.open(
            'POST',
            environment.serverUrl + environment.services.upload()
          );
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };
          request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
              load(request.responseText);
              const name = JSON.parse(request.response).fileName;
              const data = { fileName: name };
              const token = JSON.parse(sessionStorage.getItem('credentials'))
                .authToken;
              const test = { fileName: name };
              fetch(
                environment.serverUrl +
                  environment.services.importUnitProduct(
                    localStorage.getItem('unitId')
                  ),
                {
                  headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  body: JSON.stringify(data),
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  $('#close').trigger('click');
                  if (res['message']) {
                    alert(res['message']);
                  }
                });
              sessionStorage.setItem('uploadFile', request.response);
            } else {
              alert('something went wrong');
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
    openPatica();
    goToModulePatica(6, '9b4bf0a3b46f46430bcf1d1450f5156d');
  }

  openPatica(isActive: boolean) {
    this.active = isActive;
    if (this.active) {
      openPatica();
      goToModulePatica(6, '9b4bf0a3b46f46430bcf1d1450f5156d');
    } else {
      hidePatica();
    }
  }

  close() {
    this.materialsComponent.hideModal();
  }
}
