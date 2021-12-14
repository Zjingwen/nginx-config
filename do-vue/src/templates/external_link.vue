<template>
  <span>
    <a
      :href="this.$props.link"
      target="_blank"
      rel="noreferrer"
      v-text="this.$props.text"
    ></a>
    <i class="fas fa-external-link-alt"></i>
  </span>
</template>

<script>
export default {
  name: "ExternalLink",
  props: {
    link: String,
    text: String,
  },
};
</script>
