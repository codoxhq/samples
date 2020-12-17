import { useState, useEffect } from 'react'
import RealTimeTinymceEditor from './components/RealTimeTinymceEditor'
import './App.css';

function App() {

  const { Codox } = window;

  const apiKey = '58e429b0-be4a-4cd8-8c8d-9a37fb0adec0';
  const username = 'Chris';
  const [docs, updateDocs] = useState([
    { "id": "1d52d64b-f7c5-40de-8137-629376ffbc76", name: "doc1", "content": "Hello World" },
    { "id": "'1d52d64b-f7c5-40de-8137-629376ffbc77", name: "doc2", "content": "One two three" }
  ])
  const [activeDoc, setActiveDoc] = useState(docs[0])
  const [codox, setCodoxInstance] = useState(null)

  useEffect(() => {
    const codoxInstance = new Codox()
    setCodoxInstance(codoxInstance)
  }, [])

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
          <a className="logo-link" href="https://www.codox.io" target="_blank">
            <img id="logo" src="https://www.codox.io/assets/img/wave.svg" alt="" />
          </a>
          <div className="logo-title">Create your own Google Docs with Wave + Tinymce on React</div>
        </div>

        <div className="main-container">
          <div className="document-container">
            <ul className="document-list">
              {docs.map(d =>
                <li key={d.id} onClick={() => changeActiveDoc(d)}>
                  <a className={`document-link ${activeDoc.id === d.id && 'active'}`}>{d.name}</a>
                </li>
              )}

            </ul>
          </div>
          <div className="editors">
            {activeDoc.id ? <RealTimeTinymceEditor
              username={username}
              apiKey={apiKey}
              codox={codox}
              docId={activeDoc.id}
              model={activeDoc.content}
              updateContent={updateContent}
            /> : null}

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
