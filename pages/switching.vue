/* eslint-disable */
<template>
  <div>
    <h2>受入切替</h2>
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    let hostDetails = []
    await $axios.$get('/api/v1/host_details')
      .then(res => (hostDetails = res))
    return { hostDetails }
  },
  computed: {
    dateFormat () {
      return (date) => {
        const dateTimeFormat = new Intl.DateTimeFormat(
          'ja', { dateStyle: 'medium', timeStyle: 'short' }
        )
        return dateTimeFormat.format(new Date(date))
      }
    }
  }
}
</script>

/* eslint-enable */
