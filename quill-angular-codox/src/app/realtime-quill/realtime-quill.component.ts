import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from "@angular/core";

declare const Codox: any;

@Component({
  selector: "app-realtime-quill",
  templateUrl: "./realtime-quill.component.html",
  styleUrls: ["./realtime-quill.component.scss"],
})
export class RealtimeQuillComponent implements OnDestroy, OnChanges {
  @Input() apiKey;
  @Input() docId;
  @Input() username;
  @Input() codox;
  @Input() model;

  options: any;
  editor: any;

  constructor() { }


  ngOnDestroy() {
    if (this.codox) {
      this.codox.stop();
    }
  }

  onEditorCreated = (editor) => {
    this.editor = editor;
    this.startCollaboration();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { docId, model } = changes;
    if (docId.currentValue !== docId.previousValue) {
      if (this.editor) {
        const contents = this.editor.clipboard.convert(model.currentValue);
        this.editor.setContents(contents);
      }
      this.startCollaboration();
    }
  }

  startCollaboration() {
    this.editor && this.codox.init({
      app: "quilljs",
      username: this.username,
      docId: this.docId,
      apiKey: this.apiKey,
      editor: this.editor
    });
  }
}
