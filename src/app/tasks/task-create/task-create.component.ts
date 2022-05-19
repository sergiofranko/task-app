import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
import { TasksService } from 'src/app/service/task/tasks.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  public formTasks!: FormGroup;
  public employees: User[] = [];
  public states: string[] = ["Nueva", "Activa", "Cerrada"];

  constructor(private formBuilder: FormBuilder,
    private taskService: TasksService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {

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

  loadEmployees() {
    this.userService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.employees = response.data as User[];
          console.log("Empleados: ", this.employees);
          
        }
      }, error => {
        console.error(error);
      }
    )
  }

  save(): any {
    const form = this.formTasks.value;
    const task: Task = {
      id: 0,
      title: form.title,
      description: form.description,
      executionDate: form.executionDate,
      idEmployee: form.idEmployee,
      status: this.states[0]
    };
    this.taskService.save(task)
      .subscribe(response => {
        if (response && response.success) {
          console.log("Response: ", response.data);
          console.log("Message: ", response.message);
          this.router.navigateByUrl("/");
        }
      }, error => {
        console.error(error);
      }
      )
    
  }

}
