<template>
  <div v-if="$parent.value === name">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabPane',
  props: ['name'],
};
</script>
