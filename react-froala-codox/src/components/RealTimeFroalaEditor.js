import { useEffect, useState } from 'react'
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import "froala-editor/js/plugins.pkgd.min.js";

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';


const RealTimeFroalaEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    const [editor, setEditor] = useState(null)

    useEffect(() => {
        startCollaboration()
        //leave the session
        return () => codox && codox.stop();
    }, [editor, docId, codox])

    const startCollaboration = () => {
        editor && codox && codox.init({
            app: 'froala',
            username: username,
            docId: docId,
            apiKey: apiKey,
            editor: editor,
            permission: { token: 'token', url: 'http://', interval: 5000 },
            hooks: {
                fetchDocOnNetworkReconnect: () => {
                    return { content: 'Hello world!', timestamp: 45151513513 };
                },
                // invoked whenever the document has been updated
                contentChanged: () => {
                    const content = editor.html.get();
                    updateContent(docId, content);
                },
            },
        });        
      }

    const config={
        height: 500,
        events : {
          'initialized':  function() {
            setEditor(this) 
          }
        }
      }

    return (
        <>
            <FroalaEditor
                tag='textarea'
                config={config}
                model={model}
            />
        </>

    )
}

export default RealTimeFroalaEditor
