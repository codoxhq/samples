import { Component } from '@angular/core';

declare const Codox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  docs = [
    { "id": "d9c6d75e-8ce7-4cd2-9c78-a732a6b7256e", "name": "doc1", "content": "Hello World" },
    { "id": "8cc0a067-f045-4998-a7b1-782652e01fa7", "name": "doc2", "content": "One two three" },
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
