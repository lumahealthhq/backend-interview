import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { environment } from '../environments/environment';
import { User } from './model/user';
import { USERS } from './mock-users';

@Injectable()
export class UserService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private usersUrl = environment.apiUrl + 'patients'; // url to web api

  constructor(private http: Http) { }

  getUsers(): Promise<User[]> {
    // return Promise.resolve(USERS); // get USERS from './mock-users'
    return this.http.get(this.usersUrl).toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  handleError(error: any): any {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
