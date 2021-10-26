import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    authToken: 'string',
    userId: 'string',
    email: 'string',
    name: 'string',
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      authToken: 'string',
      userId: 'string',
      email: 'string',
      name: 'string',
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }
}
