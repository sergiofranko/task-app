import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
import { AlertService } from 'src/app/service/alert.service';
import { TasksService } from 'src/app/service/task/tasks.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  public task!: Task;
  public employee: User = {
    id: 0,
    name: ''
  };
  public employees: User[] = [];
  public todayDate = Date.now();
  public states: string[] = ["Nueva", "Activa", "Cerrada"];
  public formTasks: FormGroup = this.formBuilder.group({});

  constructor(private taskService: TasksService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {

    this.createForm();
    this.userService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.employees = response.data as User[];
        }
      }, error => {
        console.error(error);
      }
    )

    this.taskService.trigger.subscribe(task => {
      this.task = task.data;
      this.userService.getById(this.task.idEmployee).subscribe(
        response => {
          if (response && response.success) {
            this.employee = response.data as User;
          }
        }, error => {
          console.error(error);
        }
      )
      this.loadForm();
    })
    
  }

  createForm() {
    this.formTasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(250)
      ]],
      executionDate: ['', Validators.required],
      status: ['', Validators.required],
      idEmployee: ['', Validators.required]
    });

  }

  loadForm() {
    let date: Date = new Date(this.task.executionDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    this.formTasks.setValue({
      title: this.task.title,
      description: this.task.description,
      executionDate: formatDate(date, 'yyyy-MM-dd', 'en'),
      status: this.task.status,
      idEmployee: this.task.idEmployee
    })
  }

  update(){
    this.task = {
      id: this.task.id,
      title: this.formTasks.value.title,
      description: this.formTasks.value.description,
      executionDate: this.formTasks.value.executionDate,
      status: this.formTasks.value.status,
      idEmployee: this.formTasks.value.idEmployee,
    };
    this.taskService.update(this.task)
      .subscribe(response=> {
        if (response && response.success) {
          this.createForm();
          this.alertService.alert('success', '¡Éxito!', response.message);
          setTimeout(() => {
            this.taskService.hiddenEdit.emit({hidden: false}),
            10000
          })
          this.router.navigateByUrl("/")
        }
    }, error => {
      this.alertService.alert('error', '¡Error!', error.message);
    })
  }

}
