<template>
  <div v-if="$parent.selected === name">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TabPane',
  props: ['name'],
}
</script>
