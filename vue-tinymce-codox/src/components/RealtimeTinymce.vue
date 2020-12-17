<template>
  <div>
    <tinymce
      :id="docId"
      v-model="editorContent"
      @editorInit="tinymceInitialized($event)"
    ></tinymce>
  </div>
</template>

<script>
export default {
  name: "RealtimeTinymce",
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
      this.editor.setContent(this.model);
      // reinitialize codox if doc is changed
      if (newVal !== oldVal) {
        this.startCollaboration();
        this.editorId = newVal;
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
      editor: null,
      editorContent: self.model,
      editorId: self.docId,
    };
  },
  beforeDestroy() {
    if (this.codox) {
      this.codox.stop();
    }
  },
  methods: {
    startCollaboration() {
      // initialization of codox and passing editor object
      this.codox.init({
        app: "tinymce",
        username: this.username,
        docId: this.docId,
        apiKey: this.apiKey,
        editor: this.editor,
        hooks: {
          // invoked whenever the document has been updated
          contentChanged: () => {
            const content = this.editor.getContent();
            this.updateContent(this.docId, content);
          },
        },
      });
    },
    tinymceInitialized(editor) {
      this.editor = editor;
      this.startCollaboration();
    },
  },
};
</script>

<style scoped>
</style>
