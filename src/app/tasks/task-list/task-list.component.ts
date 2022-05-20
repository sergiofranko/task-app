import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
import { AlertService } from 'src/app/service/alert.service';
import { TasksService } from 'src/app/service/task/tasks.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  showEdit: boolean = false;
  tasks: Task[] = [];
  employees: User[] = [];
  daysLate: number[] = [];
  exDates: string[] = [];

  constructor(private taskService: TasksService,
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.taskService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.tasks = response.data as Task[];
          this.tasks.forEach(task => {
            let execDate = new Date(task.executionDate);
            execDate.setMinutes(execDate.getMinutes() + execDate.getTimezoneOffset());
            this.exDates.push(formatDate(execDate, 'dd-MM-yyyy', 'en'));
            let nowDate = new Date(Date.now());
            nowDate.setMinutes(nowDate.getMinutes() + nowDate.getTimezoneOffset());
            this.userService.getById(task.idEmployee).subscribe(
              response => {
                let user: User = response.data as User;
                this.employees.push(user);
              }
            )
            if (task.status != "Cerrado" && (execDate < nowDate)) {
              this.daysLate.push(nowDate.getDate() - execDate.getDate());
            } else {
              this.daysLate.push(0);
            }
          });
        }
      }, error => {
        console.error(error);
      }
    )
  }

  edit(task: Task) {
    this.showEdit = true;

    console.log("edicion: ",  task);
    setTimeout(() => {
      this.trigger(task),
      1000
    })

    this.taskService.hiddenEdit.subscribe(
      hidden => {
        this.showEdit = hidden.hidden;
        this.ngOnInit();
      }
    )
    
  }

  trigger(task: Task) {
    this.taskService.trigger.emit({
      data: task
    })
  }

  delete(task: Task) {
    this.taskService.delete(task.id)
    .subscribe(response => {
      if (response && response.success) {
        this.alertService.alert('success', '¡Éxito!', response.message);
        console.log(response.message);
        setTimeout(() => {
          this.ngOnInit(),
          50000
        })
        
      }
    })
  }

}
