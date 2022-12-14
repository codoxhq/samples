<template>
  <div id="app">
    <div class="header">
      <a href="https://www.codox.io" class="logo-link" target="_blank">
        <img id="logo" src="https://www.codox.io/assets/img/wave.svg" alt="" />
      </a>
      <div class="logo-title">
        Create your own Google Docs with Wave + Quill on Vue
      </div>
    </div>

    <div class="main-container">
      <div class="document-container">
        <ul class="document-list">
          <li
            v-bind:class="{ active: doc.id === currentDoc.id }"
            v-for="doc in docs"
            :key="doc.id"
            @click="onDocClick(doc)"
          >
            <a class="document-link">{{ doc.name }}</a>
          </li>
        </ul>
      </div>

      <div class="editors">
        <RealtimeQuill
          v-if="currentDoc.id"
          class="editor"
          :apiKey="apiKey"
          :username="username"
          :docId="currentDoc.id"
          :codox="codox"
          :model="currentDoc.content"
          :updateContent="updateContent"
        ></RealtimeQuill>
      </div>
    </div>
  </div>
</template>

<script
  src="https://cdn1.codox.io/lib/2.x/api/wave.client.js"
  type="text/javascript"
></script>

<script>
import RealtimeQuill from "./components/RealtimeQuill.vue";

export default {
  name: "App",
  components: {
    RealtimeQuill,
  },
  data() {
    return {
      docs: [
        {
          id: "557be51c-ea77-4d2f-a827-119f8b55ab33",
          name: "doc1",
          content: "Hello World",
        },
        {
          id: "6283eeb9-180d-4d9b-8d2f-1bbb95e91dee",
          name: "doc2",
          content: "One two three",
        },
      ],
      apiKey: "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0",
      username: "Chris",
      currentDoc: {},
      codox: null,
    };
  },
  mounted() {
    this.currentDoc = this.docs[0];
    //create a codox instance
    this.codox = new Codox();
  },
  methods: {
    onDocClick({ id, content }) {
      if (id !== this.currentDoc.id) {
        //leave the session
        if (this.codox) {
          this.codox.stop();
        }
        //create a new codox instance
        this.codox = new Codox();
        this.currentDoc = {
          id,
          content,
        };
      }
    },
    updateContent(docId, content) {
      const index = this.docs.findIndex((v) => v.id === docId);
      this.$set(this.docs, index, { ...this.docs[index], content });
    },
  },
};
</script>

<style lang="scss">
/*@import 'https://cdn1.codox.io/lib/2.x/css/wave.client.css';*/

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: 400;
}

.header {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-size: 16px;
  line-height: 25px;
  box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
  border-bottom: 1px solid #d4dadf;
  background-color: #ffffff;
  text-align: center;

  .logo-link {
    padding-top: 20px;
  }

  .logo-title {
    padding-bottom: 30px;
  }

  a {
    width: 100px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    height: 70px;
  }

  #logo {
    height: 65px;
    text-align: center;
    display: block;
  }

  span {
    display: block;
  }
}

.main-container {
  display: flex;
}

.document-container {
  background-color: #f5f7f9;
  width: 100px;
  border-right: 1px solid #e6ecf1;
  height: calc(100vh - 112px);
}

.document-list {
  width: fit-content;
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  flex-direction: column;
  width: 100%;

  li {
    display: inline-block;
    text-align: center;
  }

  .document-link {
    padding: 10px 14px !important;
    height: 18px;
    font-size: 15px;
    width: 65px;
    color: #626773;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    display: block;
    color: #3b454e;
    float: right;
    text-align: left;
    font-weight: 600;
    font-size: 14px;

    &:hover {
      background: #e6ecf1 !important;
    }
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      bottom: -3px;
      left: 0;
      width: 100%;
    }
  }

  .active {
    a {
      color: rgb(255, 147, 0);
      background: white !important;
      border-width: 1px 0px 1px 1px;
      border-top-style: solid;
      border-bottom-style: solid;
      border-left-style: solid;
      border-color: rgb(230, 236, 241) !important;
    }
  }
}

.ql-editor {
  height: 250px !important;
}

.editors {
  display: flex;
  justify-content: space-evenly;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
}

.editor {
  flex: 1 1 auto;
  max-width: 80%;
  height: 700px;
  margin-right: 10px;
}

.ql-container {
  min-height: 500px !important;
}
.ql-editor {
  min-height: 500px !important;
}
</style>
