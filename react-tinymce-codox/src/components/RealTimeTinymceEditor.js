
import { useEffect, useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';

const RealTimeTinymceEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    const tinymceRef = useRef(null);
    const [editor, setEditor] = useState(null)

    useEffect(() => {
        // initialization of codox and passing editor object
        if (editor) {
            codox && codox.init({
                app: 'tinymce',
                username: username,
                docId: docId,
                apiKey: apiKey,
                editor: editor,
                hooks: {
                    // invoked whenever the document has been updated
                    contentChanged: () => {
                        const content = editor.getContent();
                        updateContent(docId, content);
                    },
                },
            });
        };

        //leave the session
        return () => codox && codox.stop();
    }, [editor, docId, codox])

    return (
        <>
            <Editor
                id={docId}
                key={docId}
                ref={tinymceRef}
                init={{ height: 500, width: 800 }}
                initialValue={model}
                onInit={(e) => setEditor(e.target)}
            />
        </>

    )
}

export default RealTimeTinymceEditor