import 'dart:async';
import 'dart:io';
import 'dart:convert'; // For jsonEncode
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle; // Import rootBundle
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (Platform.isAndroid) {
    await AndroidInAppWebViewController.setWebContentsDebuggingEnabled(true);
  }

  runApp(
    MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: const MyWebViewPage(),
    ),
  );
}

class MyWebViewPage extends StatefulWidget {
  const MyWebViewPage({super.key});

  @override
  _MyWebViewPageState createState() => _MyWebViewPageState();
}

class _MyWebViewPageState extends State<MyWebViewPage> {
  late InAppWebViewController _webViewController;

  // Initial quill editor state - fetch it from backend
  // String initQuillState = "test"; //'{"ops": [{"insert": "demo text\n"}]}';
  Map<String, dynamic> initQuillStateRaw = {
    "ops": [
      {"insert": "initial doc content\n"}
    ]
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter+Quill+Codox'),
      ),
      body: FutureBuilder<String>(
        future: _loadLocalHtml(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasData) {
              return InAppWebView(
                initialData: InAppWebViewInitialData(
                  data: snapshot.data!,
                  /**
                   * IMPORTANT:
                   *  Setting baseUrl is critical now for codox sync to work:
                   *  base url is considered by codox as "domain" which is allowed by codox subscription.
                   *  Example: codox subscription has whitelisted domain "flutter_demo.app", configured in codox dashboard,
                   *           then here need to specify baseUrl with http prefix, like "http://flutter_demo.app"
                   * 
                   *  Note: this specific "flutter_demo.app" value is a part of demo subscription, in real app should use own name
                   * 
                   *    This specific baseURL works only with this demo app. The codox config
                   *    with apiKey, etc is in assets/quill.html - look for "codoxConfig" var.
                   */
                  baseUrl: Uri.parse("http://flutter_demo.app"),
                  mimeType: 'text/html',
                  encoding: 'utf-8',
                ),
                initialOptions: InAppWebViewGroupOptions(
                  crossPlatform: InAppWebViewOptions(
                    javaScriptEnabled:
                        true, // Important: this must be enabled for js to work in local html
                    useOnLoadResource: true,
                    allowUniversalAccessFromFileURLs: true,
                    allowFileAccessFromFileURLs: true,
                  ),
                ),
                onWebViewCreated: (controller) {
                  _webViewController = controller;

                  /**
                   * Add listeners to codox hooks:
                   * - contentUpdated hook
                   * - usersUpdate
                   * - fetchDocOnNetworkReconnectHook
                   * 
                   * + add listener to codox errors
                   */

                  _webViewController.addJavaScriptHandler(
                      handlerName: "usersUpdateHookHandler",
                      callback: (args) {
                        String users = args[0];
                        print("[usersUpdateHookHandler]: $users");
                      });

                  _webViewController.addJavaScriptHandler(
                      handlerName: "contentUpdatedHookHandler",
                      callback: (args) {
                        String data = args[0];
                        print("[contentUpdatedHookHandler]: $data");
                        // get full state json
                        dynamic fullState =
                            _webViewController.evaluateJavascript(
                                source: "getQuillEditorState()");
                        print("quill editor full state json: $fullState");
                      });

                  _webViewController.addJavaScriptHandler(
                      handlerName: "fetchDocOnNetworkReconnectHookHandler",
                      callback: (args) {
                        print(
                            "[fetchDocOnNetworkReconnectHookHandler] invoked");

                        // response must match schema:  {content, timestamp}
                        Map<String, dynamic> fetchedData = {
                          "content": {
                            "ops": [
                              {"insert": "initial doc\n"}
                            ]
                          },
                          "timestamp": -1
                        };
                        return fetchedData;
                      });

                  _webViewController.addJavaScriptHandler(
                      handlerName: "codoxErrorEventListener",
                      callback: (args) {
                        String data = args[0];
                        print("[codoxErrorEventListener]: $data");
                      });
                },
                onConsoleMessage: (controller, consoleMessage) {
                  /**
                   * Log all js logs into debug terminal 
                   */
                  print('[JavaScript Log]: ${consoleMessage.message}');
                },
                onLoadStop: (controller, url) async {
                  /**
                   * When page is fully loaded:
                   *  - set initial state to editor
                   *  - start codox
                   */

                  // set initial quill editor state
                  String initQuillStateJSON = jsonEncode(initQuillStateRaw);
                  await _webViewController.evaluateJavascript(
                      source: "setQuillInitState($initQuillStateJSON)");

                  /**
                       * Start codox. 
                       * Codox config is inside quill.html
                       */
                  await _webViewController.evaluateJavascript(
                      source: "startCodox()");
                },
              );
            } else {
              return const Center(child: Text('Failed to load HTML content.'));
            }
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }

  Future<String> _loadLocalHtml() async {
    try {
      // Load the local HTML file content
      final String htmlString =
          await rootBundle.loadString('assets/quill.html');
      if (htmlString.isEmpty) {
        throw Exception('HTML content is empty');
      }
      return htmlString;
    } catch (e) {
      print('Error loading HTML file: $e');
      return '';
    }
  }
}
