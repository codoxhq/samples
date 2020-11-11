<template>
  <div id="app">
    <div class="header">
      <a href="https://www.codox.io" target="_blank">
        <img id="logo" src="https://www.codox.io/assets/img/wave.svg" alt="">
      </a>
      <div>
        Create your own Google Docs with Wave + Froala on Vue
      </div>
    </div>

    <ul class="document-list">
      <li v-for="doc in docs" :key="doc.id" @click="onDocClick(doc)">
        <a>{{ doc.id }}</a>
      </li>
    </ul>

    <div class="editors">
      <RealtimeFroala
          v-if="currentDoc.id"
          class="editor"
          :apiKey="apiKey"
          :username="username"
          :docId="currentDoc.id"
          :codox="codox"
          :model="currentDoc.content"
      ></RealtimeFroala>
    </div>
  </div>
</template>

<script
  src="https://smd.stage.codox.io/plugins/wave.client.js?apiKey=58e429b0-be4a-4cd8-8c8d-9a37fb0adec0&app=froala"
  type="text/javascript"
></script>

<script>
import RealtimeFroala from './components/RealtimeFroala.vue'

export default {
  name: 'App',
  components: {
    RealtimeFroala
  },
  data() {
    return {
      docId: "",
      docs: [
        { "id": "doc1", "content": "Hello World" },
        { "id": "doc2", "content": "One two three" },
      ],
      apiKey: "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0",
      username: "Chris",
      currentDoc: {},
      codox: null,
    }
  },
  mounted() {
    this.docId = this.guid();
    this.currentDoc = {
      id: null,
      content: null,
    };
  },
  methods: {
    guid() {
      const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      return (
        s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4()
      );
    },
    onDocClick({id, content}) {
      if (id !== this.currentDoc.id) {
        if (this.codox) {
          this.codox.stop();
        }
        this.codox = new Codox();
        this.currentDoc = {
          id,
          content,
        };
      }
    }
  }
}
</script>

<style lang="scss">
/*@import 'https://cdn1.stage.codox.io/lib/css/wave.client.css';*/

.header {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 25px;

  a {
    width: 100px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    height:70px;
  }

  #logo {
    height: 65px;
    text-align: center;
    display:block;
  }

  span {
    display:block
  }
}

.document-list {
  width: fit-content;
  padding-right: 69px;
  margin-left: auto;
  margin-right: auto;
}

.editors {
  display: flex;
  justify-content: space-evenly;
  margin-left: 100px;
  margin-right: 100px;
}

.editor {
  flex: 1 1 auto;
  max-width: 80%;
  height: 700px;
  margin-right:10px;
}
</style>
