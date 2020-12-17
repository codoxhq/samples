<template>
  <div>
    <froala :config="config" :key="docId" v-model="editorContent"></froala>
  </div>
</template>

<script>
export default {
  name: "RealtimeFroala",
  props: {
    apiKey: String,
    docId: String,
    username: String,
    codox: null,
    model: null,
    updateContent: Function,
  },
  watch: {
    docId: function (newVal, oldVal) {
      // reinitialize codox if doc is changed
      if (newVal !== oldVal) {
        this.startCollaboration();
      }
    },
    model: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.editorContent = newVal;
      }
    },
  },
  data() {
    const self = this;
    return {
      config: {
        height: 500,
        events: {
          initialized: function () {
            // handle froala initialization
            self.froalaInitialized(this);
          },
        },
      },
      editor: null,
      editorContent: this.model,
    };
  },
  beforeDestroy() {
    if (this.codox) {
      //leave the session
      this.codox.stop();
    }
  },
  methods: {
    startCollaboration() {
      // initialization of codox and passing editor object
      this.codox.init({
        app: "froala",
        username: this.username,
        docId: this.docId,
        apiKey: this.apiKey,
        editor: this.editor,
        hooks: {
          // invoked whenever the document has been updated
          contentChanged: () => {
            const content = this.editor.html.get();
            this.updateContent(this.docId, content);
          },
        },
      });
    },
    froalaInitialized(editor) {
      this.editor = editor;
      this.startCollaboration();
    },
  },
};
</script>

<style scoped>
</style>
