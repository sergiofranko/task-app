import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
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
      console.log("Recibiendo: ", task);
      this.task = task.data;
      console.log(formatDate(new Date(this.task.executionDate), 'yyyy-MM-dd', 'en'));
      
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
    this.formTasks.setValue({
      title: this.task.title,
      description: this.task.description,
      executionDate: formatDate(new Date(this.task.executionDate), 'yyyy-MM-dd', 'en'),
      status: this.task.status,
      idEmployee: this.task.idEmployee
    })
  }

  update(){
    console.log("formmulario: ", this.formTasks.value);
    this.task = {
      id: this.task.id,
      title: this.formTasks.value.title,
      description: this.formTasks.value.description,
      executionDate: this.formTasks.value.executionDate,
      status: this.formTasks.value.status,
      idEmployee: this.formTasks.value.idEmployee,
    };
    console.log("tarea: ", this.task);
    this.taskService.update(this.task)
      .subscribe(response=> {
        if (response && response.success) {
        console.log("Response: ", response.data);
        console.log("Message: ", response.message);
        this.createForm();
        this.taskService.hiddenEdit.emit({hidden: false});
      }
    }, error => {
      console.error(error);
    })
  }

}
