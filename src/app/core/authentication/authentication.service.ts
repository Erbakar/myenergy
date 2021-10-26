import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TextAttribute } from '@angular/compiler/src/render3/r3_ast';

export interface Role {
  roleId: string;
  name: string;
}

export interface Filter {
  name: string;
  displayName: string;
}

export interface Organisation {
  options: string[];
  features: any[];
  filters: Filter[];
  licenseType: string;
  name: string;
  id: string;
}

export interface Credentials {
  authToken: string;
  userId: string;
  email: string;
  name: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  result: any;
  data: any;
  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }
  private _credentials: Credentials | null;
  constructor(private http: HttpClient) {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) ||
      localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */

  login(context: LoginContext): Observable<Credentials> {
    return this.http
      .post<any>(environment.serverUrl + environment.services.login(), context)
      .pipe(
        map((user) => {
          if (user) {
            this.data = {
              authToken: user.authToken,
              userId: user.userId,
              email: user.email,
              name: user.name,
            };
            this.setCredentials(user, context.remember);
            if (user.email !== localStorage.getItem('user-email')) {
              localStorage.removeItem('credentials');
              localStorage.removeItem('selectedUnit');
              localStorage.removeItem('unitId');
              localStorage.removeItem('isShowstep6Intro');
              localStorage.removeItem('selectedQuestion');
              localStorage.removeItem('isShowstep5Intro');
              localStorage.removeItem('questionId');
              localStorage.removeItem('supplierInfoDontShow');
              localStorage.removeItem('selectedBusiness');
            }

            localStorage.setItem('user-email', user.email);
          }
          return user;
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials({
      authToken: null,
      userId: null,
      email: null,
      name: null,
    });

    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;
    if (credentials.name !== null) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
