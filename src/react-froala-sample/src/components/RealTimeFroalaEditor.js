
import { useEffect } from 'react'
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import "froala-editor/js/plugins.pkgd.min.js";

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';


const RealTimeFroalaEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    useEffect(() => {
        //leave the session
        return () => codox && codox.stop();
    }, [codox])

    const startCollaboration = (editor) => {

        codox && codox.init({
            app      : 'froala',
            username :  username,
            docId    :  docId,
            apiKey   : apiKey,
            editor   : editor,
            hooks: {
                // invoked whenever the document has been updated
                contentChanged: () => {
                    const content = editor.html.get();
                    updateContent(docId, content);
                },
            },
        });
        
      }

    const config={
        events : {
          'initialized':  function() {
            startCollaboration(this) 
          }
        }
      }

    return (
        <>
            <FroalaEditor
                tag='textarea'
                config={config}
                model={model}
            // onModelChange={this.handleModelChange}
            />
        </>

    )
}

export default RealTimeFroalaEditor