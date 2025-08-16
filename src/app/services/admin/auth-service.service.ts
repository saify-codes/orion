import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  constructor(private router: Router, private http: HttpClient) { }

  signin(email:string, password:string, remember: boolean = false){
    
  }

  signout(){

  }

  signoutFromAll(){

  }
}
