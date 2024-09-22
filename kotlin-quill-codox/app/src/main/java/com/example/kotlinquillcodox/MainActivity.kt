package com.example.kotlinquillcodox

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.kotlinquillcodox.databinding.ActivityMainBinding
import java.io.BufferedReader
import java.io.InputStreamReader
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

val LOG_TAG = "MainActivity"




class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflate the binding layout
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Access WebView using ViewBinding
        val webView: WebView = binding.webView

        // Enable JavaScript
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

       

        // Add a JavaScript interface to interact with JavaScript in HTML
        webView.addJavascriptInterface(WebAppInterface(), "AndroidApp")

        /**
            Load the local HTML file with a custom HTTP base URL. 
         */
         /**
         * IMPORTANT:
         *  Setting baseUrl is critical now for codox sync to work:
         *  base url is considered by codox as "domain" which is allowed by codox subscription.
         *  Example: codox subscription has whitelisted domain "kotlin_demo.app", configured in codox dashboard,
         *           then here need to specify baseUrl with http prefix, like "http://kotlin_demo.app"
         * 
         *  Note: this specific "kotlin_demo.app" value is a part of demo subscription, in real app should use own name
         * 
         *    This specific baseURL works only with this demo app. The codox config
         *    with apiKey, etc is in app/src/main/assets/quill.html - look for "codoxConfig" var.
         */
        val baseUrl = "http://kotlin_demo.app/"
        val htmlData = assets.open("quill.html").bufferedReader().use { it.readText() }
        webView.loadDataWithBaseURL(baseUrl, htmlData, "text/html", "UTF-8", null)

        // Set a custom WebViewClient to handle URLs within WebView

        webView.webViewClient = object : WebViewClient() {

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)

                Log.d(LOG_TAG, "Page load finished")

                /**
                   When page is loaded do the follwing:
                    1. inject codox lib script
                    2. set initial editor content
                    3. start codox sync
                 */
        
                // 1.Inject codox lib 
                 injectCodoxLib()
//                Thread.sleep(2000) // for safety, pause to ensure lib is fully injected
                // 2. set initial content
                // NOTE: in real app must fetch from backend
                val initContent = createMockedEditorState()
                setInitEditorState(initContent)
                // 3. start codox sync
                startCodox()

            }
        }
    }

       // Function to inject codox lib script into webview
    private fun injectCodoxLib() {
        val fileName = "codox.js"
        val inputStream = assets.open(fileName)
        val bufferedReader = BufferedReader(InputStreamReader(inputStream))
        val stringBuilder = StringBuilder()
        bufferedReader.forEachLine { line ->
            stringBuilder.append(line)
        }
        val jsContent = stringBuilder.toString()
        binding.webView.evaluateJavascript(jsContent, null)
        Log.d(LOG_TAG, "[injectCodoxLib] injected")
    }

    private fun createMockedEditorState(): String {
        val innerObject = JSONObject().apply {
            put("insert", "demo document\n")
        }
        val jsonObject = JSONObject().apply {
            put("ops", JSONArray().put(innerObject))
        }
        // Convert to JSON string
        return jsonObject.toString()
    }

    private fun setInitEditorState(initStateJson: String) {
        Log.d(LOG_TAG, "[setInitEditorState] INIT CONTENT: $initStateJson")

        // invoke js to set init content to quill editor
        binding.webView.evaluateJavascript("setQuillInitState($initStateJson);", null)
    }
    
    private fun startCodox() {
        // invoke codox start in javascript
        binding.webView.evaluateJavascript("startCodox();", null)
    }

    private fun stopCodox() {
        // invoke codox stop in javascript
        binding.webView.evaluateJavascript("stopCodox();", null)
    }

    /**
        JavaScript interface class to communicate with javacript code:
         js code can invoke the api to pass data back here to kotlin
     */
    inner class WebAppInterface() {
        // @JavascriptInterface
        // fun showToast(message: String) {
        //     // Kotlin code to be invoked by JavaScript
        //     runOnUiThread {
        //         Toast.makeText(applicationContext, message, Toast.LENGTH_SHORT).show()
        //         // Send a response back to JavaScript
        //         binding.webView.evaluateJavascript("receiveMessage('Response from Kotlin')", null)
        //     }
        // }

        @JavascriptInterface
        fun contentChanged(json: String) {
            Log.d(LOG_TAG, "[contentChanged] invoked with $json")
            // take full editor state and do any custom actions, like write to db
            runOnUiThread {
                binding.webView.evaluateJavascript("getQuillEditorState();") { state ->
                // Handle the JavaScript result here
                Log.d(LOG_TAG, "Lates editor state: $state")
            }
            }
        }

        @JavascriptInterface
        fun usersUpdate(usersJson: String) {
            Log.d(LOG_TAG, "[usersUpdate] latest users: $usersJson")
        }

        @JavascriptInterface
        fun onCodoxError(dataJson: String) {
            Log.d(LOG_TAG, "[onCodoxError] codox error event: $dataJson")
        }

        @JavascriptInterface
        fun fetchDocOnNetworkReconnect() {
            /**
                NOTE: by design of communication between js and kotlin, 
                js does not wait for response from kotlin here, that's why
                here, when kotlin needs to pass back response to js, it invokes another
                method which is processed by js. In js code it is coded as if js is waiting for response (using lang specific features)
            **/

            /**
             * In real app, fetch data from backend
             * In this demo mocked state is used
             * 
             * IMPORTANT:
             * fetched state must match pattern:
             *  {
             *      content: {ops: [...]},
             *      timestamp: Number
             *  }
             */
            val insertObject = JSONObject().apply {
                put("insert", "fetched document\n")
            }
            val opsObject = JSONObject().apply {
                put("ops", JSONArray().put(insertObject))
            }

            val contentObject = JSONObject().apply {
                put("content", opsObject);
                put("timestamp", -1)
            }

            val content = contentObject.toString()
            Log.d(LOG_TAG, "FETCHED CONTENT: $content")
            runOnUiThread {
                binding.webView.evaluateJavascript("window.fetchDocOnReconnectHookResponse($content);", null)
            }    
        }
    }
}