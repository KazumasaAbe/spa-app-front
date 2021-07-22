/* eslint-disable */

<template>
  <div>
    <h2>
      受入店詳細
    </h2>
    <table>
      <thead>
        <tr>
          <th>受入店名</th>
          <th>緯度</th>
          <th>経度</th>
          <th>受入可能日時</th>
          <th>必要通貨数</th>
          <th>説明</th>
          <th>受入店リンク</th>
          <th>住所</th>
          <th>受入可否切替</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ hostDetail.name }}</td>
          <td>{{ hostDetail.latitude }}</td>
          <td>{{ hostDetail.longitude }}</td>
          <td>{{ hostDetail.acceptable_date }}</td>
          <td>{{ hostDetail.rate }}</td>
          <td>{{ hostDetail.description }}</td>
          <td>{{ hostDetail.link }}</td>
          <td>{{ hostDetail.address }}</td>
          <td>{{ hostDetail.acceptable }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    let hostDetail = []
    await $axios.$get('/api/v1/host_details/:id')
      .then(res => (hostDetail = res))
    return { hostDetail }
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
