import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/model/Task';
import { User } from 'src/app/model/User';
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
              private userService: UserService) { }

  ngOnInit(): void {
    this.taskService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.tasks = response.data as Task[];
          this.tasks.forEach(task => {
            this.exDates.push(formatDate(task.executionDate, 'dd-MM-yyyy', 'en'));
            let execDate = new Date(task.executionDate);
            let nowDate = new Date(Date.now());
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
        console.log(response.message);
        this.ngOnInit();
      }
    })
  }

}
