import { useState, useEffect } from 'react'
import RealTimeCodemirrorEditor from './components/RealTimeCodemirrorEditor'
import './App.css';

function App() {

  const { Codox } = window;

  const apiKey = '58e429b0-be4a-4cd8-8c8d-9a37fb0adec0';
  const username = 'Chris';
  const [docs, updateDocs] = useState([
    { "id": "abcde", name: "doc1", "content": "Hello World" },
    { "id": "abcdef", name: "doc2", "content": "One two three" }
  ])
  const [activeDoc, setActiveDoc] = useState(docs[0])
  const [codox, setCodoxInstance] = useState(null)

  useEffect(() => {
    const codoxInstance = new Codox()
    setCodoxInstance(codoxInstance)
  }, []) // eslint-disable-line

  const changeActiveDoc = (doc) => {
    if (doc.id !== activeDoc.id) {
      //leave the session
      codox && codox.stop();

      //create a new codox instance
      const codoxInstance = new Codox()
      setCodoxInstance(codoxInstance)
      setActiveDoc(doc)
    }

  }

  const updateContent = (docId, content) => {
    const updatedDoc = docs.map(doc => {
      if(doc.id === docId){
        return ({...doc, content})
      }
      return doc
    })
    updateDocs(updatedDoc)
  }

  return (
    <div className="App">
      <div id="app">
        <div className="header">
          <a rel="noreferrer" href="https://www.codox.io" className="logo-link" target="_blank">
            <img id="logo" src="https://www.codox.io/assets/img/wave.svg" alt="" />
          </a>
          <div className="logo-title">Create your own Google Docs with Wave + CodeMirror on React</div>
        </div>

        <div className="main-container">
          <div className="document-container">
            <ul className="document-list">
              {docs.map(d =>
                <li key={d.id} onClick={() => changeActiveDoc(d)}>
                  <div className={`document-link ${activeDoc.id === d.id && 'active'}`}>{d.name}</div>
                </li>
              )}
            </ul>
          </div>
          <div className="editors">
            {activeDoc.id && <RealTimeCodemirrorEditor
              username={username}
              apiKey={apiKey}
              codox={codox}
              docId={activeDoc.id}
              model={activeDoc.content}
              updateContent={updateContent}
            />}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
