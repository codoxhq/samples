<template>
  <div>
    <quill-editor
      v-bind:key="docId"
      ref="myQuillEditor"
      v-model="editorContent"
      style="min-height: 700px"
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
      this.codox &&
        this.codox.init({
          app: "quilljs",
          username: this.username,
          docId: this.docId,
          apiKey: this.apiKey,
          editor: this.editor,
          hooks: {
            // invoked whenever the document has been updated
            contentChanged: () => {
              const content = this.editor.root.innerHTML;
              this.updateContent(this.docId, content);
            },
          },
        });
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
