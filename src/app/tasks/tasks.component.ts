import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/Task';
import { User } from '../model/User';
import { TasksService } from '../service/task/tasks.service';
import { UserService } from '../service/user/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  public formTasks!: FormGroup;
  public employees: User[] = [];

  constructor(private formBuilder: FormBuilder,
    private taskService: TasksService,
    private userService: UserService) { }

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
      status: "New"
    };
    this.taskService.save(task)
      .subscribe(response => {
        if (response && response.success) {
          console.log("Response: ", response.data);
          console.log("Message: ", response.message);
        }
      }, error => {
        console.error(error);
      }
      )
    
  }

}
