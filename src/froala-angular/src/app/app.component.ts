import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  docId: any;

  constructor() {
    this.docId = this.guid();
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
    );
  }
}
