<template>
  <div>
    <tinymce
      id="editorId"
      v-model="editorContent"
      @editorInit="quillInitialized($event)"
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
      setTimeout(() => {
        this.codox.init({
          app: "tinymce",
          username: this.username,
          docId: this.docId,
          apiKey: this.apiKey,
          editor: this.editor,
        });
      }, 100);
    },
    quillInitialized(editor) {
      this.editor = editor;
      this.startCollaboration();
    },
  },
};
</script>

<style scoped>
</style>
