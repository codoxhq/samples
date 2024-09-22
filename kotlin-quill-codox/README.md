## Kotlin + QuillJS + Codox Integration

## Description:

Project contains sample code with basic Codox integration with QuillJS in Kotlin application.

## Key points:

QuillJS+Codox integration is implemented with kotlin WebView:

- quilljs is loaded into local html file
- local html file is utilized by kotlin WebView
- codox lib is injected into local html after it is loaded
- Codox integration code is added together with quill editor inside local html file
- Codox lib should exist in app - should be installed locally and moved to specific folder before installation
- kotlin-js 2 side communication is implemented to pass data to/from js/kotlin and back.
- Codox implementation includes subscribing kotlin to codox hooks and error events - hooks invocations will trigger kotlin callbacks and pass data

## How it works:

1. Kotlin loads local html, which contains prepared javascript code with quill editor and codox init
2. Kotlin injects codox lib script into local html page, when it is loaded
3. Kotlin app invokes js function to setup initial editor state - in this demo, it is mocked. in real app must be fetched from backend
4. Kotlin app adds listeners (callbacks) for codox hooks and error events. this is done via kotlin WebInterface
5. Kotlin app triggers js function which starts codox with config. **Codox Config is implemented inside app/main/assets/quill.html**. Config params like apiKey, docId and username can be passed from swift, now it is already in html file.
6. When codox hook is triggered in javascript, the kotlin corresponding callback is invoked and data is passed to kotlin app.

## Installation:

1. Install AndroidStudio on local machine. Follow [official guide](https://developer.android.com/studio/install)
2. Install Nodejs and npm on local machine. Follow [official quide](https://nodejs.org/en/download/package-manager). Ensure NodeJS is installed by:
   ```bash
      # should output version of nodeJS
      node --version
   ```
3. Clone this repository
4. Navigate to **codoxLib/** and exec following command to install codox provider lib:

```bash
    cd codoxLib/

    npm install
```

5. Copy the installed codox lib into app/src/main/assets/ dir. codox lib file must be renamed to **codox.js**:

   ```bash
       cp codoxLib/node_modules/@codoxhq/quill-provider/dist/index.js app/src/main/assets/codox.js
   ```

   > IMPORTANT: app code expects codox lib in **app/src/main/assets/codox.js**

6. Run AndroidStudio, open this project there and run debug

7. In AndroidStudio check **Logcat** terminal output, should output all logs, including js logs

## Configuration note:

To enable Codox sync, the local html, loaded by swift, must have custom baseURL, which is equivalent to Codox "domain" in subscription.<br/>
In this demo, for demostration purposes, the demo subscription is used, with configured domain, which is setup here in code (see MainActivity.kt)<br/>
In real app, must configure own domain in codox subscription and put same baseURL in the app.
