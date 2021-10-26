import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/take';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

export class Request {
  resource: String;
  data?: Object;
  type: String;
  constructor(_resource: string, _data: Object, _type: String) {
    this.resource = _resource;
    this.data = _data;
    this.type = _type;
  }
}
export class Method extends Request {}
@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  token;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public callService(request: Request) {
    return fromPromise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await this.callServiceRequest(request);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  public getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (JSON.parse(sessionStorage.getItem('credentials'))) {
      this.token = JSON.parse(sessionStorage.getItem('credentials')).authToken;
    }
    if (this.token) {
      headers = headers.append('x-auth-token', this.token);
    }
    return headers;
  }

  private callServiceRequest(request: Request): Promise<any> {
    let requestobj: any;
    switch (request.type) {
      case 'post':
        requestobj = this.http.post(
          this.getUrl(request.resource),
          request.data,
          this.getRequestOptions()
        );
        break;
      case 'put':
        requestobj = this.http.put(
          this.getUrl(request.resource),
          request.data,
          this.getRequestOptions()
        );
        break;
      case 'delete':
        requestobj = this.http.delete(
          this.getUrl(request.resource),
          this.getRequestOptions()
        );
        break;
      default:
        requestobj = this.http.get(
          this.getUrl(request.resource),
          this.getRequestOptions()
        );
        break;
    }
    return new Promise((resolve, reject) => {
      requestobj.subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          if (err.status === 401) {
            this.authenticationService
              .logout()
              .subscribe(() =>
                this.router.navigate(['/login'], { replaceUrl: true })
              );
          }
          this.error(err);
          return false;
        }
      );
    });
  }
  private getRequestOptions() {
    return { headers: this.getHeaders() };
  }
  private error(err: any) {
    if (err.status === 403) {
      this.snackBar.open('You do not have rights to access this resource', '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    } else {
      this.snackBar.open(err.error.message, '', {
        duration: 5000,
        panelClass: ['error-snackBar'],
      });
    }
  }
  private getUrl(resource: String) {
    return environment.serverUrl + resource;
  }
}
