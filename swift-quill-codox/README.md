## Swift + QuillJS + Codox Integration

#### Tested Environment:

MacOS version: Sonoma <br/>
Xcode version: 15.2

## Description:

Project contains sample code with basic Codox integration with QuillJS in Swift application.

## Key points:

QuillJS+Codox integration is implemented with swift WKWebView:

- quilljs is loaded into local html file
- local html file is utilized by swift WKWebView
- codox lib is injected into local html after it is loaded
- Codox integration code is added together with quill editor inside local html file
- Codox lib should exist in app - should be installed locally and moved to specific folder before installation
- swift-js 2 side communication is implemented to pass data to/from js/swift and back.
- Codox implementation includes subscribing swift to codox hooks and error events - hooks invocations will trigger swift callbacks and pass data

## How it works:

1. Swift loads local html, which contains prepared javascript code with quill editor and codox init
2. Swift injects codox lib script into local html page, when it is loaded
3. Swift app invokes js function to setup initial editor state - in this demo, it is mocked. in real app must be fetched from backend
4. Swift app adds listeners (callbacks) for codox hooks and error events. this is done via browser window.webkit.messageHandlers
5. Swift app triggers js function which starts codox with config. **Codox Config is implemented inside QuillJSEditor/quill.html**. Config params like apiKey, docId and username can be passed from swift, now it is already in html file.
6. When codox hook is triggered in javascript, the swift corresponding callback is invoked and data is passed to swift.

## Installation:

1. Install Nodejs and npm on local machine. Follow [official quide](https://nodejs.org/en/download/package-manager). Ensure NodeJS is installed by:
   ```bash
      # should output version of nodeJS
      node --version
   ```
2. Clone this repository
3. Navigate to **codoxLib/** and exec following command to install codox provider lib:
   ```bash
       npm install
   ```
4. Copy the installed codox lib into QuillJSEditor/ dir. codox lib file must be renamed to **codox.js**:

   ```bash
       cp codoxLib/node_modules/@codoxhq/quill-provider/dist/index.js QuillJSEditor/codox.js
   ```

   > IMPORTANT: app code expects codox lib in **QuillJSEditor/codox.js**

5. In XCode, pick up simulator device and run build

Check debug console, should output all logs, including js logs

## Configuration note:

To enable Codox sync, the local html, loaded by swift, must have custom baseURL, which is equivalent to Codox "domain" in subscription.<br/>
In this demo, for demostration purposes, the demo subscription is used, with configured domain, which is setup here in code (see ViewController.swift file)<br/>
In real app, must configure own domain in codox subscription and put same baseURL in the app.

## App Source:

Original swift app project borrowed from https://github.com/suyeshkandpal28/swiftRichTextEditor
