import UIKit
import WebKit
import Foundation

// these are data types for demo only - for mocking state
struct Op: Codable {
    let insert: String
}
struct Doc: Codable {
    let ops: [Op]
}

struct Fetched: Codable {
    let content: Doc
    let timestamp: Int
}

// helper for mocking initial state
func createInitQuillEditorState() -> Any {
    do {
        let op = Op(insert: "demo document content\n")
        let document = Doc(ops: [op])
        let jsonData = try JSONEncoder().encode(document)
        if let jsonString = String(data: jsonData, encoding: .utf8) {
            return jsonString;
        }
    } catch {
        print("Failed to create init editor state: \(error)")
    }
    return ""
}


// main class
class ViewController: UIViewController {
    
    @IBOutlet weak var webView: WKWebView!
    
    /*
     in real app, should fetch init content from backend
     */
    var initEditorState:Any = createInitQuillEditorState()
   

    
    override func viewDidLoad() {
        super.viewDidLoad()
        // create web view
        setupWebView()
        // load html with editor
        loadQuillEditor()
        
    
        
    }
   
    
    // this fn will be invoked as soon as webview is fully loaded and ready
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        /*
            When page is fully loaded to the following is strict sequence:
             1. inject codox lib into page
             2. set init editor state
             3. start codox sync
        */

        // inject codox lib first
        injectCodoxLibToHTML()
    
        // set initial editor state
        setInitQuillEditorState()
        
        // start codox
        startCodox()
    }
    
    func injectCodoxLibToHTML() {
        /*
         Inject codox lib script directly into page, when html is loaded.
         Reason: when loading local html with custom baseURL via .loadHTMLString(), the local js scripts are
                 not attached. Custom baseURL is needed for codox subscription auth.
        */
        if let codoxJSPath = Bundle.main.path(forResource: "QuillJSEditor/codox", ofType: "js"),
            let jsContent = try? String(contentsOfFile: codoxJSPath, encoding: .utf8) {
                webView.evaluateJavaScript(jsContent)
            }
    }
    
    func setupPipeJSLogs() {
        /*
            This is a workaround to pipe js logs directly to swift terminal without using Safari debugging tools.
            Reason to have this here: with custom baseURL, unable to use Safari tools for debugging
        */
        webView.configuration.userContentController.add(self, name: "jsLogsPipeHandler")
        let jsCode = """
        (function() {
            // decorate native js logs
            var nativeConsoleLog = console.log;
            console.log = function(...args) {
                window.webkit.messageHandlers.jsLogsPipeHandler.postMessage(JSON.stringify(args))
                nativeConsoleLog.apply(console, arguments)
            }
            // decorate native js error logs
            var nativeConsoleError = console.error
            console.error = function(msg) {
                window.webkit.messageHandlers.jsLogsPipeHander.postMessage(JSON.stringify(args))
                nativeConsoleError.apply(console, arguments)
            }
        })()
        """
        let jsScript = WKUserScript(source: jsCode, injectionTime: .atDocumentStart,
                                    forMainFrameOnly: false)
        webView.configuration.userContentController.addUserScript(jsScript)   
    }

    
    func setupWebView() {
        let viewportScriptString = "var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width'); meta.setAttribute('initial-scale', '1.0'); meta.setAttribute('maximum-scale', '1.0'); meta.setAttribute('minimum-scale', '1.0'); meta.setAttribute('user-scalable', 'no'); document.getElementsByTagName('head')[0].appendChild(meta);"

        let disableSelectionScriptString = "document.documentElement.style.webkitUserSelect='none';"

        let disableCalloutScriptString = "document.documentElement.style.webkitTouchCallout='none';"
        let viewportScript = WKUserScript(source: viewportScriptString, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        let disableSelectionScript = WKUserScript(source: disableSelectionScriptString, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        let disableCalloutScript = WKUserScript(source: disableCalloutScriptString, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        
        webView.navigationDelegate = self
        webView.isInspectable = true
        webView.configuration.userContentController.addUserScript(viewportScript)
        webView.configuration.userContentController.addUserScript(disableSelectionScript)
        webView.configuration.userContentController.addUserScript(disableCalloutScript)
        
        // define handler for codox hooks and error events
        webView.configuration.userContentController.add(self, name: "contentChanged")
        webView.configuration.userContentController.add(self, name: "usersUpdate")
        webView.configuration.userContentController.add(self, name: "fetchDocOnNetworkReconnect")
        webView.configuration.userContentController.add(self, name: "onCodoxError")
        setupPipeJSLogs()
    }

    // load local html file
    func loadQuillEditor() {
        if let htmlFilePath = Bundle.main.path(forResource: "quill", ofType: "html", inDirectory: "QuillJSEditor") {
            do {
                
                let htmlContent = try String(contentsOfFile: htmlFilePath)
              
                /**
                * IMPORTANT:
                *  Setting baseUrl is critical now for codox sync to work:
                *  base url is considered by codox as "domain" which is allowed by codox subscription.
                *  Example: codox subscription has whitelisted domain "swift_demo.app", configured in codox dashboard,
                *           then here need to specify baseUrl with http prefix, like "http://swift_demo.app"
                * 
                *  Note: this specific "swift_demo.app" value is a part of demo subscription, in real app should use own name
                *  This specific baseURL works only with this demo app. The codox config
                *  with apiKey, etc is in QuillJSEditor/quill.html - look for "codoxConfig" var.
                */
                let baseUrl = URL(string: "http://swift_demo.app/")
                webView.loadHTMLString(htmlContent, baseURL: baseUrl)
            } catch {
                print("Error loading HTML: \(error)")
            }    
        }  
    }
    
    func setInitQuillEditorState() {
        let jsCode = "setQuillInitState(\(initEditorState));"
        webView.evaluateJavaScript(jsCode) { (result, error) in
            if let error = error {
                print("js invoking setQuillInitState error: \(error)")
            }
        }
    }
    
    func startCodox() {
        let jsCode = "startCodox();"
        webView.evaluateJavaScript(jsCode) { (result, error) in
            if let error = error {
                print("js startCodox invoke error: \(error)")
            }
        }
    }
    
    func stopCodox() {
        let jsCode = "stopCodox();"
        webView.evaluateJavaScript(jsCode) { (result, error) in
            if let error = error {
                print("js stopCodox invoke error: \(error)")
            }
        }   
    }
  
}
//webview deleagate
extension ViewController : WKNavigationDelegate, WKScriptMessageHandler {
    
    /**
        Handle content messages from JavaScript
    **/
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
       
        
        if message.name == "contentChanged", let content = message.body as? String {
            // Handle the contentUpdated hook from codox - content is json here
            print("[Codox contentChanged hook] content json: \(content)")
            // grab full latest state adn do any custom ops here, e.g. write to db
            let jsCode = "getQuillEditorState();"
            webView.evaluateJavaScript(jsCode){ (state, error) in
            if let error = error {
                print("js stopCodox invoke error: \(error)")
            } else if let state = state {
                print("[Codox contentChanged hook] full state json: \(state)")
            }
        }   
            
        }
        
        if message.name == "usersUpdate", let users = message.body as? String {
            // handle usersUpdate hook from codox - users is json here
            print("[Codox usersUpdate hook] users update: \(users)")
        }
        
        if message.name == "fetchDocOnNetworkReconnect" {
            print("[Codox fetchDocOnNetworkReconnect hook] invoked")
            /**
                NOTE: by design of communication between js and swift, 
                js does not wait for response from swift here, that's why
                here, when swift needs to pass back response to js, it invokes another
                method which is processed by js. In js code it is coded as if js is waiting for response (using lang specific features)
            **/
            // should return quill state from backend here
            /* Fetched content must match pattern {content: {ops: [...]}, timestamp}
             * Should pass it back to js as JSON
               Here for demo, mocking fetched state:
             */
            do {
                let op = Op(insert: "demo document content\n")
                let document = Doc(ops: [op])
                let content = Fetched(content: document, timestamp: -1)
                let jsonData = try JSONEncoder().encode(content)
                if let json = String(data: jsonData, encoding: .utf8) {
                    let jsCode = "window.fetchDocOnReconnectHookResponse(\(json));"
                    webView.evaluateJavaScript(jsCode)
                }
            } catch {
                print("FetchedDocOnReconnect error: \(error)")
            }
        }
        
        if message.name == "onCodoxError", let errorData = message.body as? String {
            // handle codox errors - any custom logic here - errorData is json here
            print("[Codox Error Event]: \(errorData)")
        }
        
        // listen to js logs - simply print with prefix
        if message.name == "jsLogsPipeHandler" {
            if let logMessage = message.body as? String {
                print("[JS LOGS]: \(logMessage)")
            }
        }
    }
}



