import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  alert = (icon: any, title: string, text: string) => {
    Swal.fire({
      icon,
      title,
      text
    })
  }
}
