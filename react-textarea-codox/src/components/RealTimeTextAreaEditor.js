import { useEffect } from 'react'

const RealTimeTextAreaEditor = ({ codox, docId, username, apiKey, model, updateContent }) => {

    useEffect(() => {
        startCollaboration()
        //leave the session
        return () => codox && codox.stop();
    }, [docId, codox]) // eslint-disable-line

    const startCollaboration = () => {
        codox && codox.init({
            app: 'text',
            username,
            user: { name: username }, //unique user name
            docId,
            apiKey,
            editor: document.getElementById('editor'),            
            language: 'ru',
            'autoStart': true,
            debug: true,
            'cursorAlwaysOn': true,
            'showPointer': true,
        });        
    }

    return (
        <textarea id="editor" rows="50" cols="50"></textarea>
    )
}

export default RealTimeTextAreaEditor
