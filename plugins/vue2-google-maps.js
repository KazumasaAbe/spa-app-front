import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCbW0a3RKnLwEXIdm4MFoXeHCfmiZc6Qj8',
    libraries: 'places'
  }
})
