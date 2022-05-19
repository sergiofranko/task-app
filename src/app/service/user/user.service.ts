import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${environment.baseUrl}/users`).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    )
  }

  getById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/users/${id}`).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler = (error: HttpErrorResponse) => {
    return throwError(error.message || "Server Error");
  }
}
