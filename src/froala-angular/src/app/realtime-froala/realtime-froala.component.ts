import { Component, OnInit, OnDestroy, Input } from "@angular/core";

declare const Codox: any;

@Component({
  selector: "app-realtime-froala",
  templateUrl: "./realtime-froala.component.html",
  styleUrls: ["./realtime-froala.component.scss"],
})
export class RealtimeFroalaComponent implements OnInit, OnDestroy {
  @Input() apiKey;
  @Input() docId;
  @Input() username;

  options: any;
  codox: any;

  constructor() {}

  ngOnInit() {
    const self = this;
    this.options = {
      events: {
        "initialized":  function() {
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

  froalaInitialized(editor) {
    //instantiate a Codox
    this.codox = new Codox();

    setTimeout(() =>  {
      //start or join the session
      this.codox.init({
        app      : "froala",
        username : this.username,
        docId    : this.docId,
        apiKey   : this.apiKey,
        editor   : editor
      });
    }, 100);
  }
}
