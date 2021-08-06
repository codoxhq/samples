import { useEffect, useState } from 'react'

const RealTimeCodemirrorEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    const [editor, setEditor] = useState(null)

    useEffect(() => {
        const editor = window.CodeMirror.fromTextArea(document.getElementById('editor'), {
            lineNumbers: true
        });
        setEditor(editor);
    }, []);

    useEffect(() => {
        if (codox && editor) {
            startCollaboration()
        }
        //leave the session
        return () => codox && codox.stop();
    }, [editor, docId, codox]) // eslint-disable-line

    const startCollaboration = () => {
        const config = {
            app: 'codemirror',
            username,
            user: { name: username }, //unique user name
            docId,
            apiKey,
            editor,
            'autoStart': true,
            debug: true,
            permission: { token: 'token', url: 'http://', interval: 5000 },
            hooks: {
                contentChanged: (data) => {
                    console.log('content changed hook, content: ' + data)
                },
                usersUpdate: (data) => {
                    console.log('users update hook, content: ')
                    console.log(data);
                },
                fetchDocOnNetworkReconnect: () => {
                    return { content: 'hello world', timestamp: Date.now() }
                }
            },
        };

        window.editor = editor;
        window.config = config;
        const codox = new window.Codox();
        window.codox = codox;

        codox.on('users_update', (data) => {console.debug('[codemirror] event on user_update', data)});
        codox.on('content_changed', (data) => {console.debug('[codemirror] event on content_changed', data)});
        codox.init(config);

    }

    return (
        <textarea id="editor" rows="50" cols="50"></textarea>
    )
}

export default RealTimeCodemirrorEditor
