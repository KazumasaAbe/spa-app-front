/* eslint-disable */
<template>
  <div class="container py-5" align="center">
    <h2>受入切替画面</h2>
    <v-container
      fluid
      class="pa-10"
    >
      <v-row align="center">
        <v-col
          cols="12"
        >
          <v-text>受入可</v-text>
          <div class="text-center">
            <div class="my-2">
              <v-btn
                color="success"
                fab
                x-large
                dark
              >
                <v-icon>mdi-map-marker-radius</v-icon>
              </v-btn>
            </div>
          </div>
          <v-text>受入不可</v-text>
          <div class="text-center">
            <div class="my-2">
              <v-btn
                color="error"
                fab
                x-large
                dark
              >
                <v-icon>mdi-map-marker-remove</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
</script>

/* eslint-enable */
