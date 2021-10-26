import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from '@env/environment';
import { Method, ApiRequestService } from '@app/core/http/api-request.service';
import { CommonService } from '@app/core/common.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @Output() selectedUserItem = new EventEmitter();
  userResults;
  selectedUser = {
    id: '',
    email: '',
  };
  displayedColumns: string[] = ['fullname', 'role'];
  dataSource;
  user;
  users;
  constructor(
    public http: ApiRequestService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    this.commonService.selectedCircularUser.subscribe((res) => {
      if (!res['id']) {
        this.closeUser();
      }
    });
  }

  pageEvent(pageInfo: any) {
    this.getUsers(pageInfo.pageIndex + 1);
  }

  ngAfterViewInit() {
    this.getUsers(1);
  }

  selectedUserEvent(user: any) {
    this.selectedUser = user;
    this.selectedUserItem.emit(user);
    this.commonService.selectedCircularUser.next(user);
  }
  closeUser() {
    this.selectedUser = {
      id: '',
      email: '',
    };
    this.selectedUserItem.emit(this.selectedUser);
  }

  getUsers(page: any) {
    this.http
      .callService(new Method(environment.services.users(page), '', 'get'))
      .subscribe((res) => {
        this.user = res;
        this.users = res['results'];
        this.userResults = this.user.results;
        this.dataSource = this.userResults;
      });
  }
}
