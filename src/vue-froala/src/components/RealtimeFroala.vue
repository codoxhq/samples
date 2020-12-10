<template>
  <div>
    <froala :tag="'textarea'" :config="config" v-model="editorContent"></froala>
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
        events: {
          initialized: function () {
            // handle Froala initialization
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
      this.codox.stop();
    }
  },
  methods: {
    startCollaboration() {
      // initialization of codox and passing editor object
      setTimeout(() => {
        this.codox.init({
          app: "froala",
          username: this.username,
          docId: this.docId,
          apiKey: this.apiKey,
          editor: this.editor,
        });
      }, 100);
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
