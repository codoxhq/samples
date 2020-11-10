import { Component } from '@angular/core';

declare const Codox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  docId: any;
  docs = [
    { "id": "doc1", "content": "Hello World" },
    { "id": "doc2", "content": "One two three" },
  ];
  apiKey = "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0";
  username = "Chris";
  currentDoc: any;
  codox: any;


  constructor() {
    this.docId = this.guid();
    this.currentDoc = {
      id: null,
      content: null,
    };
  }

  guid() {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return (
      s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
    );
  }

  onDocClick({id, content}) {
    if (id !== this.currentDoc.id) {
      if (this.codox) {
        this.codox.stop();
      }
      this.codox = new Codox();
      this.currentDoc = {
        id,
        content,
      };
    }
  }
}
