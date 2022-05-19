import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Task } from 'src/app/model/Task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  @Output() trigger: EventEmitter<any> = new EventEmitter();
  @Output() hiddenEdit: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/tasks`).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  save(task: Task): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/tasks`, task).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  } 

  update(task: Task): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.baseUrl}/tasks`, task).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${environment.baseUrl}/tasks/${id}`).pipe(
      map(response => {
        return response as ApiResponse;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler = (error: HttpErrorResponse) => {
    return throwError(error.message || "Server Error");
  }

  
}

