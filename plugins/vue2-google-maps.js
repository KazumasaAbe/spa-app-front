import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDfjwPFOqQj5j3L8eIEnjfP2DZzdrQnKC8',
    libraries: 'places'
  }
})
