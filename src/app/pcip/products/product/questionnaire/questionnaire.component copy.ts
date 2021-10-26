import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonService } from '@app/core/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  @ViewChild('myPond') myPond: any;
  Idies = [];
  firstId;
  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png',
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

  get contactFormGroup() {
    return this.form.get('addMultipleAllowed') as FormArray;
  }
  form: FormGroup;
  contactList: FormArray;
  unsubcribe: any;
  text: string;
  hiddenValue = 100;
  language;
  photos = [];
  pictures = [];
  selectedLangugeEnglish;
  questionnaireId;
  categories;
  formShow = false;
  productId;
  addItemCount = 1;
  arrayCount = null;
  totalArrayCount;
  controls;
  payLoad = '';
  displayName;
  formGenarateArray = [];
  data;
  subscription;
  productSummaryData;
  catArray = [];
  formValue = [];
  test = [];
  groupCode = {};
  groupData = [];
  constructor(
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    public http: ApiRequestService,
    private fb: FormBuilder
  ) {
    this.selectedLangugeEnglish = this.language === 'en-US' || !this.language;
    this.subscription = this.commonService.productId
      .pipe(distinctUntilChanged())
      .subscribe((id) => {
        this.getQuestion(id);
      });
  }

  getQuestion(id: string) {
    this.hiddenValue = 100;
    this.photos = [];
    this.pictures = [];
    this.addItemCount = 1;
    this.arrayCount = null;
    this.payLoad = '';
    this.formGenarateArray = [];
    this.catArray = [];
    this.formValue = [];
    this.test = [];
    this.groupCode = {};
    this.groupData = [];
    this.formShow = false;
    this.productId = id;
    this.http
      .callService(
        new Method(
          environment.services.productSummary(this.productId, false),
          '',
          'get'
        )
      )
      .subscribe((res) => {
        this.productSummaryData = res;
        sessionStorage.setItem(
          'selectedProduct',
          JSON.stringify(this.productSummaryData)
        );
        if (this.productSummaryData['pictures'].length > 0) {
          this.getAssetPhoto(
            this.productSummaryData['pictures'][0]['fileName']
          );
        }
        this.questionnaireId = this.productSummaryData['questionnaire'][
          'questionnaireId'
        ];
        this.categories = this.productSummaryData['questionnaire'][
          'categories'
        ];
        this.catArray = this.categories;
        this.arrayCount = this.catArray.length;
        this.catArray.forEach((element) => {
          this.questionnaireForm(this.questionnaireId, element);
        });
      });
  }

  saveTop(name: any) {
    this.pictures.push(JSON.parse(sessionStorage.getItem('uploadFile')));
    const data = {
      displayName: name,
      pictures: this.pictures,
    };
    this.http.callService(
      new Method(environment.services.cloneProduct(this.productId), data, 'put')
    );
  }

  onKeydown(items: any) {
    this.hiddenValue = 100;
    const first = items.filter((x) => x.Code === 'M221')[0];
    const second = items.filter((x) => x.Code === 'M222')[0];
    const third = items.filter((x) => x.Code === 'M223')[0];
    this.hiddenValue =
      this.hiddenValue - first.Value - second.Value - third.Value;
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async getAssetPhoto(filePath: String) {
    this.photos = [
      {
        source: environment.serverUrl + '/assets/download/' + filePath,
        options: {
          type: 'local',
        },
      },
    ];
  }

  onSubmit() {
    const data = {};
    for (const [key, value] of Object.entries(this.form.value.questionnaire)) {
      if (typeof value !== 'object') {
        data[key] = [value];
      } else {
        data[key] = value;
      }
    }
    this.form.value.addMultipleAllowed.forEach((element) => {
      const mapped = Object.keys(element).map((key) => ({
        code: key,
        value: element[key],
      }));
      const main = Object.keys(data).map((key) => ({
        code: key,
        value: element[key],
      }));
      mapped.forEach((g) => {
        main.forEach((d, i) => {
          if (g.code === d.code) {
            data[d.code].push(d.value);
            data[d.code].forEach((e, index) => {
              if (e === false || e === null) {
                data[d.code].splice(index, 1);
              }
            });
          }
          this.formGenarateArray.forEach((item) => {
            if (d.code === item.code) {
              data[d.code].splice(item.dubliceCount, 1);
            }
          });
        });
      });
    });
    this.http
      .callService(
        new Method(
          environment.services.putQuestionnaireForm(this.questionnaireId),
          data,
          'put'
        )
      )
      .subscribe((res) => {});
  }
  questionnaireForm(id: string, cat: string) {
    this.http
      .callService(
        new Method(environment.services.questionnaireForm(id, cat), '', 'get')
      )
      .subscribe((res) => {
        this.data = res['questions'];
        if (this.data) {
          this.data.forEach((element, index, totalArray) => {
            element.category = cat;
            element.dubliceCount = 1;
            this.formGenarateArray.push(element);
            if (index === totalArray.length - 1) {
              this.arrayCount--;
              if (this.arrayCount === 0) {
                this.formGenarate();
              }
            }
          });
        }
      });
  }

  formGenarate() {
    this.formValue = this.formGenarateArray;
    if (this.formValue.length) {
      this.controls = {};
      this.formValue.forEach((v) => {
        if (v.description) {
          v.description = this.selectedLangugeEnglish
            ? v.description.en
            : v.description.nl;
          v.stringLenght = v.description ? v.description.length : 0;
        }
        v.value.forEach((val) => {
          setTimeout(() => {
            this.addGroupItem(v, v.value.length);
          }, 1500);
        });
        if (v.type === 'radio') {
          v.value = String(v.value);
        }
        if (!this.formShow) {
          this.formShow = true;
        }
        this.controls[v.code] = new FormControl(false);
        if (v.child) {
          v.child.forEach((element) => {
            if (element.description) {
              element.description = this.selectedLangugeEnglish
                ? element.description.en
                : element.description.nl;
              element.stringLenght = element.description
                ? element.description.length
                : 0;
            }
            if (element.type === 'radio') {
              element.value = String(element.value);
            }
            this.controls[element.code] = new FormControl(false);
            element.child.forEach((groupItem) => {
              if (groupItem.description) {
                groupItem.description = this.selectedLangugeEnglish
                  ? groupItem.description.en
                  : groupItem.description.nl;
                groupItem.stringLenght = groupItem.description
                  ? groupItem.description.length
                  : 0;
              }
              if (groupItem.type === 'radio') {
                groupItem.value = String(groupItem.value);
              }
              this.controls[groupItem.code] = new FormControl(false);
              groupItem.value.forEach((value) => {
                setTimeout(() => {
                  this.addGroupItem(v, groupItem.value.length);
                }, 1500);
              });
            });
          });
        }
      });
      this.form = this.fb.group({
        questionnaire: this.fb.group(this.controls),
        addMultipleAllowed: this.fb.array([this.createGroup(null)]),
      });
    }
    this.contactList = this.form.get('addMultipleAllowed') as FormArray;
  }
  // contact formgroup
  createGroup(code: any): FormGroup {
    this.groupCode = {};
    this.groupData = [];
    this.formGenarateArray.forEach((element) => {
      if (element.multipleAllowed) {
        element.parent = element.code;
        this.groupData.push(element);
        this.groupCode[element.code] = null;
      }
      element.child.forEach((child) => {
        if (child.multipleAllowed) {
          child.child.forEach((groupItem) => {
            this.groupData.push(groupItem);
            this.groupCode[groupItem.code] = null;
          });
        }
      });
    });
    return this.fb.group(this.groupCode);
  }

  // add a contact form group
  addGroupItem(item: any, dubliceCount?: number) {
    if (dubliceCount) {
      item.dubliceCount = dubliceCount;
    } else {
      item.dubliceCount
        ? (item.dubliceCount = item.dubliceCount + 1)
        : (item.dubliceCount = 2);
    }
    this.contactList.push(this.createGroup(item));
  }

  // remove contact from group
  removeContact(index: any, item: any) {
    item.dubliceCount > 1
      ? (item.dubliceCount = item.dubliceCount - 1)
      : (item.dubliceCount = 0);
  }
}
