import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
import { AlertService } from 'src/app/service/alert.service';
import { TasksService } from 'src/app/service/task/tasks.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  public formTasks!: FormGroup;
  public employeesToCreate: User[] = [{
    id: 1,
    name: "Sergio Franco"
  },
  {
    id: 2,
    name: "Esteban Agudelo"
  }];
  public employees: User[] = [];
  public states: string[] = ["Nueva", "Activa", "Cerrada"];

  constructor(private formBuilder: FormBuilder,
    private taskService: TasksService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {

    this.createEmployees();
    this.loadEmployees();

    this.formTasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(250)
      ]],
      executionDate: ['', Validators.required],
      idEmployee: ['', Validators.required]
    });
  }

  createEmployees() {
    this.employeesToCreate.forEach(employee => {
      this.userService.save(employee).subscribe(
        response => {
          if (response && response.success) {
            this.employees.push(response.data as User)
          }
        }, error => {
          this.alertService.alert('error', 'Error', error.message)
        }
      )
    })
    
  }

  loadEmployees() {
    this.userService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.employees = response.data as User[];
        }
      }, error => {
        this.alertService.alert('error', 'Error!', error.message);
      }
    )
  }

  save(): any {
    const form = this.formTasks.value;
    let date: Date = new Date(form.executionDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    let dateString = formatDate(date, 'yyyy-MM-dd', 'en');
    
    const task: Task = {
      id: 0,
      title: form.title,
      description: form.description,
      executionDate: dateString,
      idEmployee: form.idEmployee,
      status: this.states[0]
    };

    console.log(form);
    

    this.taskService.save(task)
      .subscribe(response => {
        if (response && response.success) {
          this.alertService.alert('success', '¡Éxito!', response.message);
          this.router.navigateByUrl("/");
        }
      }, error => {
        console.error(error);
      }
      )
    
  }

}
