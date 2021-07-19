import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBP4QCmWYSePbOivtt0oxScKmUlq6iA_v8',
    libraries: 'places'
  }
})
