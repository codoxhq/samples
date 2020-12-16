import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import Angular plugin.
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RealtimeFroalaComponent } from "./realtime-froala/realtime-froala.component";

@NgModule({
  declarations: [
    AppComponent,
    RealtimeFroalaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
