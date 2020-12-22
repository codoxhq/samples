import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from "@angular/core";

declare const Codox: any;

@Component({
  selector: "app-realtime-froala",
  templateUrl: "./realtime-froala.component.html",
  styleUrls: ["./realtime-froala.component.scss"],
})
export class RealtimeFroalaComponent implements OnInit, OnDestroy, OnChanges {
  @Input() apiKey;
  @Input() docId;
  @Input() username;
  @Input() codox;
  @Input() model;
  @Input() boundCallback;

  options: any;
  editor: any;

  constructor() { }

  ngOnInit() {
    const self = this;
    this.options = {
      events: {
        "initialized": function () {
          self.froalaInitialized(this);
        }
      }
    };
  }

  ngOnDestroy() {
    if (this.codox) {
      this.codox.stop();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const { docId } = changes;
    if (docId.currentValue !== docId.previousValue) {
      this.startCollaboration();
    }
  }

  startCollaboration() {
    setTimeout(() => {
      this.codox.init({
        app: "froala",
        username: this.username,
        docId: this.docId,
        apiKey: this.apiKey,
        editor: this.editor,
        hooks: {
          // invoked whenever the document has been updated
          contentChanged: () => {
            const content = this.editor.html.get();
            this.boundCallback(this.docId, content);
          },
        },
      });
    }, 100);
  }

  froalaInitialized(editor) {
    this.editor = editor;
    this.startCollaboration();
  }
}
