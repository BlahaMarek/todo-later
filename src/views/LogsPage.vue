<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Logs</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true" class="ion-padding">
      <table v-if="logs && logs.length">
        <thead>
          <tr>
            <td>Date</td>
            <td>Event</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log">
            <td>{{log.date}}</td>
            <td>{{log.event}}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="ion-text-center ion-padding">
        No logs in storage
      </div>

      <ion-button v-if="logs && logs.length" color="danger" fill="outline" expand="block" @click="clearStorage" >Remove logs</ion-button>

    </ion-content>
    <ion-footer>
      <div class="footer-button" @click="goBack" >Return back</div>
      <br><br>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonButton, IonFooter, IonTitle } from '@ionic/vue'
import { settingsOutline } from 'ionicons/icons'

export default {
  data() {
    return {
      logs: []
    }
  },

  components: {
    IonContent, IonHeader, IonPage, IonToolbar, IonFooter, IonTitle, IonButton
  },

  created() {
    this.logs = JSON.parse(localStorage.getItem('logs'))
  },

  ionViewWillEnter() {
    this.logs = JSON.parse(localStorage.getItem('logs'))
  },


  methods: {
    goBack() {
      this.$router.push('/home')
    },

    clearStorage() {
      this.logs = []
      localStorage.removeItem('logs')
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
