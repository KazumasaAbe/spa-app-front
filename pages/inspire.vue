/* eslint-disable */
<template>
  <div>
    <h2>
      受入店一覧
    </h2>
    <table v-if="hostDetails.length">
      <thead>
        <tr>
          <th>受入店名</th>
          <th>緯度</th>
          <th>経度</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(hostDetail, i) in hostDetails"
          :key="`host_detail-${i}`"
        >
          <td>{{ hostDetail.name }}</td>
          <td>{{ hostDetail.latitude }}</td>
          <td>{{ hostDetail.longitude }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      受入店情報が取得できませんでした
    </div>
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
