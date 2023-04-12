<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Todo later</ion-title>
        <ion-buttons slot="end">
          <ion-icon class="ion-margin-end" :icon="settingsOutline" @click="openBrowser"  @touchstart="mouseDown" @touchend="mouseUp"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true" class="ion-padding">

      <div>
        <ion-textarea
            v-model="textArea"
            auto-grow
            placeholder="Type something here"></ion-textarea>
      </div>

    </ion-content>
    <ion-footer>
      <div class="footer-button" @click="saveText" >Save</div>
      <br><br>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar, IonTextarea, IonFooter, IonIcon, IonButtons, IonTitle } from '@ionic/vue'
import { Browser } from '@capacitor/browser'
import { settingsOutline } from 'ionicons/icons'
import { CapacitorVolumeButtons } from 'capacitor-volume-buttons'
import axios from 'axios'
import moment from 'moment'

export default {
  data() {
    return {
      textArea: '',
      settingsOutline,
      timestamps: [],
      timer: null,
      logs: null
    }
  },

  components: {
    IonContent, IonHeader, IonPage, IonToolbar, IonTextarea, IonFooter, IonIcon, IonButtons, IonTitle
  },

  created() {
    this.logs = JSON.parse(localStorage.getItem('logs'))
    const data =
      {
        date: moment().format('DD.MM.YYYY, h:mm:ss.SSSS'),
        event: 'App opened',
        status: '-'
      }

    if (!this.logs) {
      return localStorage.setItem('logs', JSON.stringify([data]))
    }

    this._log('App opened')
  },

  mounted() {
    this.textArea = localStorage.getItem('textArea')
    this._log('Text saved')
    CapacitorVolumeButtons.addListener('volumeButtonPressed', this.onVolumeButtonPressed)
  },

  methods: {
    saveText() {
      localStorage.setItem('textArea', this.textArea)
    },

    mouseDown() {
      console.log('DOWN')
      this.timer = setTimeout(() => {
        this.$router.push('/logs')
      }, 2000)
    },

    mouseUp() {
      console.log('up')
      clearTimeout(this.timer)
    },

    async openBrowser() {
      if (this.timestamps.length < 4) {
        return this.timestamps.push(new Date())
      }

      this.timestamps.push(new Date())
      this.timestamps.shift()

      const difference = this.timestamps[3].getTime() - this.timestamps[0].getTime()

      if (difference < 2000) {
        this._log('Browser opened')
        await Browser.open({ url: 'https://dev.iwesys.com/b_todo/' })
      }
    },

    async  onVolumeButtonPressed({direction} ) {
      try {
        if (direction === 'up') {
          this._log('UP pressed')
          const data = await axios.post('https://dev.iwesys.com/b_todo/?type=1')
          this._log('UP pressed response', data.statusText)

        } else {
          this._log('DOWN pressed')
          const data = await axios.post('https://dev.iwesys.com/b_todo/?type=2')
          this._log('UP pressed response', data.statusText)

        }
      } catch (e) {
        console.error(e)
      }
    },

    _log(event, status = '-') {
      this.logs.unshift(
          {
            date: moment().format('DD.MM.YYYY, h:mm:ss.SSSS'),
            event: event,
            status: '-'
          })
      localStorage.setItem('logs', JSON.stringify(this.logs))
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
ion-icon {
  font-size: 25px;
}
</style>
