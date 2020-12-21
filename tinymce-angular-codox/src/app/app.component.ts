import { Component } from '@angular/core';

declare const Codox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  docs = [
    { "id": "03eaad5a-63d7-4c3c-9a26-9535b7f6d103", "name": "doc1", "content": "Hello World" },
    { "id": "68d712b6-fa95-4578-ac11-b508d1908e04", "name": "doc2", "content": "One two three" },
  ];
  apiKey = "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0";
  username = "Chris";
  currentDoc: any;
  codox: any;


  constructor() {
    this.currentDoc = this.docs[0]
    this.codox = new Codox()
  }

  onDocClick({ id, content }) {
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
