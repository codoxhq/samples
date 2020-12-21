import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from "@angular/core";

declare const Codox: any;

@Component({
  selector: "app-realtime-tinymce",
  templateUrl: "./realtime-tinymce.component.html",
  styleUrls: ["./realtime-tinymce.component.scss"],
})
export class RealtimeTinymceComponent implements OnDestroy, OnChanges {
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

  onInit = ({ editor }) => {
    this.editor = editor;
    this.startCollaboration();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { docId } = changes;
    if (docId.currentValue !== docId.previousValue) {
      this.startCollaboration();
    }
  }

  startCollaboration() {
    this.editor && this.codox.init({
      app: "tinymce",
      username: this.username,
      docId: this.docId,
      apiKey: this.apiKey,
      editor: this.editor
    });
  }
}
