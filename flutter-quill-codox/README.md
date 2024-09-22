## Flutter + QuillJS + Codox integration

Project contains sample code with basic Codox integration with QuillJS in Flutter application.

## Key points:

QuillJS+Codox integration is implemented with flutter InAppWebView plugin:

- quilljs is loaded into local html file
- local html file is utilized by flutter InAppWebView plugin
- Codox integration is added together with quill editor inside local html file
- Codox lib should exist in app - should be installed locally and moved to specific folder before installation
- flutter-js 2 side communication is implemented to pass data to/from js/flutter and back
- Codox implementation includes subscribing flutter to codox hooks and error events - hooks invocations will trigger flutter callbacks and pass data

## How it works:

1. Flutter loads local html, which contains prepared javascript code with quill editor and codox init
2. flutter app invokes js function to setup initial editor state - in this demo, it is mocked. in real app must be fetched from backend
3. flutter app adds listeners (callbacks) for codox hooks and error events. this is done via callbacks mechanism.
4. flutter app triggers js function which starts codox with config. **Codox Config is implemented inside assets/quill.html**. Config params like apiKey, docId and username can be passed from flutter
5. When codox hook is triggered in javascript, the flutter corresponding callback is invoked and data is passed to flutter.

## Installation:

1. Install Dart and Flutter on local machine. Follow [official guide](https://docs.flutter.dev/get-started/install)
2. Install Nodejs and npm on local machine. Follow [official quide](https://nodejs.org/en/download/package-manager). Ensure NodeJS is installed by:
   ```bash
      # should output version of nodeJS
      node --version
   ```
3. Clone this repository
4. Navigate to **codoxLib/** and exec following command to install codox provider lib:
   ```bash
       npm install
   ```
5. Copy the installed codox lib into assets/ dir. codox lib file must be renamed to **codox.js**:

   ```bash
       cp codoxLib/node_modules/@codoxhq/quill-provider/dist/index.js assets/codox.js
   ```

   > IMPORTANT: app code expects codox lib in **assets/codox.js**

6. Run debugging mode. Check [vscode guide](https://docs.flutter.dev/tools/vs-code)
   In vscode:
   - ctrl+shift+P -> flutter:SelectDevice -> choose emulator
   - in top menu -> Run -> Run Debugging

Check debug console, should output all logs, including js logs

## Configuration note:

To enable Codox sync, the local html, loaded by swift, must have custom baseURL, which is equivalent to Codox "domain" in subscription.<br/>
In this demo, for demostration purposes, the demo subscription is used, with configured domain, which is setup here in code (see lib/main.dart file)<br/>
In real app, must configure own domain in codox subscription and put same baseURL in the app.
