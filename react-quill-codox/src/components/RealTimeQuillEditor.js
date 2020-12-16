
import { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RealTimeQuillEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {
    const quillRef = useRef(null);
    const editor = quillRef.current && quillRef.current.getEditor();

    
    useEffect(() => {

        // initialization of codox and passing editor object
        codox && codox.init({
            app: 'quilljs',
            username: username,
            docId: docId,
            apiKey: apiKey,
            editor: editor,
            hooks: {
                // invoked whenever the document has been updated
                contentChanged: () => {
                    const content = editor.root.innerHTML;
                    updateContent(docId, content);
                },
            },
        });

        //leave the session
        return () => codox && codox.stop();
    }, [editor, docId])

    return (
        <>
            <ReactQuill
                ref={quillRef}
                style={{ maxHeight: 100, width: 800 }}
                value={model}
            />
        </>

    )
}

export default RealTimeQuillEditor