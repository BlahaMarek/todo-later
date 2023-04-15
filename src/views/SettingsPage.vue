<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true" class="ion-padding">
      <ion-checkbox v-model="simulate" labelPlacement="end">Simulate</ion-checkbox>
    </ion-content>
    <ion-footer>
      <div class="footer-button" @click="goBack" >Return back</div>
      <br><br>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonFooter, IonTitle, IonCheckbox } from '@ionic/vue'

export default {
  data() {
    return {
      simulate: false
    }
  },

  watch: {
    simulate(val) {
      localStorage.setItem('simulate', val)
    }
  },

  components: {
    IonContent, IonHeader, IonPage, IonToolbar, IonFooter, IonTitle, IonCheckbox
  },

  mounted() {
    this.simulate = localStorage.getItem('simulate') || false
  },

  methods: {
    goBack() {
      this.$router.push('/home')
    }
  }
}

</script>

<style scoped>
ion-footer {
  background: #3880ff;
  text-align: center;
}
.footer-button {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
tbody {
  font-size: 0.8em;
}
td {
  padding: 3px 6px;
}
</style>
