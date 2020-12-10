<template>
  <div>
    <quill-editor
      ref="myQuillEditor"
      v-model="editorContent"
      style="min-height: 300px"
      @change="onEditorChange($event)"
      @ready="quillInitialized($event)"
    />
  </div>
</template>

<script>
export default {
  name: "RealtimeQuill",
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
          app: "quilljs",
          username: this.username,
          docId: this.docId,
          apiKey: this.apiKey,
          editor: this.editor,
        });
      }, 100);
    },
    onEditorChange(event) {
      console.log(event);
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
