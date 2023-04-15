<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Todo later</ion-title>
        <ion-buttons slot="end">
          <ion-icon class="ion-margin-end" :icon="settingsOutline"  @touchstart="mouseDown" @touchend="mouseUp"></ion-icon>
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
      settingsTimer: null,
      logs: null,
    }
  },

  components: {
    IonContent, IonHeader, IonPage, IonToolbar, IonTextarea, IonFooter, IonIcon, IonButtons, IonTitle
  },

  created() {
    this.logs = JSON.parse(localStorage.getItem('logs'))
    const data =
      {
        date: moment().format('DD.MM. HH:mm:ss.SSS'),
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
    CapacitorVolumeButtons.addListener('volumeButtonPressed', this.onVolumeButtonPressed)
  },

  methods: {
    saveText() {
      localStorage.setItem('textArea', this.textArea)
    },

    removeLastRow() {
      if(this.textArea.lastIndexOf("\n")>0) {
        this.textArea = this.textArea.substring(0, this.textArea.lastIndexOf("\n"))
      }
    },

    async mouseDown() {
      console.log('DOWN')
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$router.push('/logs')
        this.timestamps = []
      }, 2000)

      if (this.timestamps.length < 3) {
        return this.timestamps.push(new Date())
      }

      this.timestamps.push(new Date())
      this.timestamps.shift()

      const difference = this.timestamps[this.timestamps.length-1].getTime() - this.timestamps[0].getTime()

      if (difference < 2000) {
        this._log('Browser opened')
        clearTimeout(this.timer)
        await Browser.open({ url: 'https://dev.iwesys.com/b_todo/' })
      }
    },

    mouseUp() {
      console.log('up')
      clearTimeout(this.timer)
      clearTimeout(this.settingsTimer)

      if (this.timestamps.length == 1) {
        this.settingsTimer = setTimeout(() => {
          this.timestamps = []
          this.$router.push('/settings')
        }, 500)
        return
      }

      const difference = this.timestamps[this.timestamps.length-1].getTime() - this.timestamps[this.timestamps.length-2].getTime()
      console.log(difference)
      if (difference > 500) {
        this.timestamps = []
        this.$router.push('/settings')
      }
    },

    async  onVolumeButtonPressed({direction} ) {
      const startTime = moment()
      const simulate = localStorage.getItem('simulate') || false
      if (direction === 'up') {
        try {
          this._log('UP')
          let data = null
          if (simulate) {
            data = await axios.post(`https://dev.iwesys.com/b_todo/?type=1&timestamp=${moment().valueOf()}&simulate=1`, {timeout: 5000})
          } else {
            data = await axios.post(`https://dev.iwesys.com/b_todo/?type=1&timestamp=${moment().valueOf()}`, {timeout: 5000})
          }
          const endTime = moment()
          const diffInMiliseconds = endTime.diff(startTime)
          this._log(`UP (${diffInMiliseconds}ms) - ${data.statusText}`, true)
        } catch (e) {
          const endTime = moment()
          let diffInMiliseconds = endTime.diff(startTime)

          if (diffInMiliseconds > 5000)  {
            diffInMiliseconds = 5000
            this._log(`UP (${diffInMiliseconds}ms) - Timeout `, true)
            return
          }

          this._log(`UP (${diffInMiliseconds}ms) - ${e.message} `, true)
        }
      } else {
          try {
            this._log('DOWN')

            let data = null
            if (simulate) {
              data = await axios.post(`https://dev.iwesys.com/b_todo/?type=2&timestamp=${moment().valueOf()}&simulate=1`, {timeout: 5000})
            } else {
              data = await axios.post(`https://dev.iwesys.com/b_todo/?type=2&timestamp=${moment().valueOf()}`, {timeout: 5000})
            }

            const endTime = moment()
            const diffInMiliseconds = endTime.diff(startTime)
            this._log(`DOWN (${diffInMiliseconds}ms) - ${data.statusText}`, true)
          } catch (e) {
            const endTime = moment()
            let diffInMiliseconds = endTime.diff(startTime)

            if (diffInMiliseconds > 5000)  {
              diffInMiliseconds = 5000
              this._log(`DOWN (${diffInMiliseconds}ms) - Timeout `, true)
              return
            }

            this._log(`DOWN (${diffInMiliseconds}ms) - ${e.message} `, true)
          }
        }
      },

      _log(event, toTextarea = false) {
        this.logs.unshift({ date: moment().format('DD.MM. HH:mm:ss.SSS'), event: event, status: '-' })
        localStorage.setItem('logs', JSON.stringify(this.logs))
        this.eventBus.emit('refresh', {logs: this.logs})
        if(toTextarea && localStorage.getItem('simulate')) {
          this.textArea += `\r\n${event}`
          setTimeout(() => {
            this.removeLastRow()
          }, 2000)
        }
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
  font-size: 30px;
}
</style>
