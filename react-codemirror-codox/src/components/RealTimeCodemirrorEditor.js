import { useEffect, useState } from 'react'
import CodeMirror from 'codemirror';

const RealTimeCodemirrorEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    const [editor, setEditor] = useState(null)

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
            lineNumbers: true
        });
        setEditor(editor);
    }, []);

    useEffect(() => {
        startCollaboration()
        //leave the session
        return () => codox && codox.stop();
    }, [editor, docId, codox]) // eslint-disable-line

    const startCollaboration = () => {
        editor && codox && codox.start({
            app: 'codemirror',
            username,
            user: { name: username }, //unique user name
            docId,
            apiKey,
            editor,
        });
    }

    return (
         <textarea id="editor" rows="50" cols="50"></textarea>
    )
}

export default RealTimeCodemirrorEditor
