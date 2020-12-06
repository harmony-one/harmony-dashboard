<template>
  <span>
    <span v-for="(p, i) in processedString" :key="i">
      <span v-if="isAddress(p)"><Address :bech32="p" :show-raw="true"/></span>
      <span v-if="!isAddress(p)">{{ p }}</span>
    </span>
  </span>
</template>

<script>
import Address from '@/components/Address'

export default {
  name: 'ParseAddress',
  components: {
    Address,
  },
  props: ['parseString'],
  data() {
    return {
      processedString: [],
    }
  },
  mounted() {
    this.parse()
  },
  methods: {
    isAddress(s) {
      return s.indexOf('one1') !== -1 && s.length === 42
    },
    parse() {
      let pointer = 0
      let i = 0
      let s = this.parseString
      const addresses = []

      while (true) {
        pointer = s.indexOf('one1')
        if ((pointer === -1 && i === 0) || (s === '' && i === 0)) {
          this.processedString.push(s)
          return
        }
        if (pointer === -1 && addresses.length > 0) {
          break
        }

        const sub = s.substring(pointer, pointer + 42)
        addresses.push(sub)

        s = s.substring(pointer + 42)

        // todo beware inf loop
        i++
        if (i > 10) {
          this.processedString.push(this.parseString)
          return
        }
      }

      let stringRemainder = this.parseString
      addresses.forEach((a, i) => {
        const parts = stringRemainder.split(a)
        this.processedString.push(parts[0], a)
        if (addresses.length - 1 === i) {
          this.processedString.push(parts[1])
        } else {
          stringRemainder = parts[1]
        }
      })
    },
  },
}
</script>
