import {
  Component,
  ViewChild,
  AfterViewChecked,
  Input,
  OnInit,
} from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { ChangeDetectorRef } from '@angular/core';
import { ActualRecoveryRatetDialog } from '@app/shared/dialog/actual-recovery-rate-dialog/actual-recovery-rate-dialog.component';

@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.scss'],
})
export class ProofComponent implements AfterViewChecked, OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('master') q: any;
  @ViewChild('myPond') myPond: any;
  questions = [];
  pondOptions;
  unit;
  status = 'VERIFICATION';
  constructor(
    private http: ApiRequestService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.unit = JSON.parse(localStorage.getItem('selectedUnit'));
    this.pondOptions = {
      class: 'my-filepond',
      multiple: false,
      labelIdle: 'Upload a file',
      server: {
        url: environment.serverUrl,
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const snack = this.snackBar;
          const formData = new FormData();
          formData.append('file', file, file.name);
          this.fileuploader(this.q);
          const request = new XMLHttpRequest();
          request.open(
            'POST',
            environment.serverUrl + environment.services.uploadEveidance()
          );
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };
          request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
              setTimeout(() => {
                load(request.responseText);
                const token = JSON.parse(sessionStorage.getItem('credentials'))
                  .authToken;
                const sq = JSON.parse(localStorage.getItem('selectedQuestion'));
                const fileData = JSON.parse(request.responseText)[0];
                let value = sq.value;
                if (!Array.isArray(sq.value)) {
                  value = [sq.value];
                }
                const testData = {
                  s3FileUuids: [fileData.id],
                  questionCode: sq.code,
                  answers: value,
                };
                const dataArray = [];
                dataArray.push(testData);
                fetch(
                  environment.serverUrl +
                    environment.services.questionnaireWithEvidence(
                      localStorage.getItem('questionId')
                    ),
                  {
                    headers: {
                      'x-auth-token': token,
                      'Content-Type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(dataArray),
                  }
                ).then((res) => {
                  if (res['message']) {
                    alert(res['message']);
                  }
                });
                sessionStorage.setItem('uploadFile', request.response);
              }, 200);
            } else {
              var msg;
              if (request.response) {
                msg = JSON.parse(request.response)['message'];
              }
              if (!msg) {
                msg = 'unable to upload file';
              }
              snack.open(msg, '', {
                duration: 5000,
                panelClass: ['error-snackBar'],
              });
              error();
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
          load((res) => {});
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
  }

  setLocalhostQuestionInfo(q: any) {
    localStorage.setItem('selectedQuestion', JSON.stringify(q));
  }
  ngOnInit() {
    console.log(this.q);
  }
  fileuploader(file: any) {
    if (this.q['code'] === file['code']) {
      this.q['documentation'] = 'uploded';
    }
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  saveDocumentation(q: any) {
    let value = q.value;
    if (!Array.isArray(q.value)) {
      value = [q.value];
    }
    const data = {
      s3FileUuids: [q.documentation],
      questionCode: q.code,
      answers: value,
      description: q.verification,
    };
    const dataArray = [];
    dataArray.push(data);
    this.http.callService(
      new Method(
        environment.services.questionnaireWithEvidence(
          localStorage.getItem('questionId')
        ),
        dataArray,
        'put'
      )
    );
  }
}
