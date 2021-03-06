import { Component } from '@angular/core';

declare const Codox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  docs = [
    { "id": "e1626875-8d25-4f98-abd8-abfdd7010d69", "name": "doc1", "content": "Hello World" },
    { "id": "adf60008-de4a-416e-b123-89cd8f44f2ce", "name": "doc2", "content": "One two three" },
  ];
  apiKey = "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0";
  username = "Chris";
  currentDoc: any;
  codox: any;
  boundCallback: Function;

  public ngOnInit() {
    this.boundCallback = this.updateContent.bind(this);
  }

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

  updateContent(docId, content) {
    this.docs = this.docs.map(d => {
      if (d.id === docId) {
        return { ...d, content }
      }
      return d
    })
  }
}
