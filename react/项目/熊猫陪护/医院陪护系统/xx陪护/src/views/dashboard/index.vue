<template>
  <div class="dashboard-container">
   <!-- <component :is="currentRole"/> -->
   <template v-if="currentRole=='ADM'">
      <component :is="adminDash"/>
   </template>
   <template v-else>
      <component :is="cooperateDash"/>
   </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import cooperatorDashboard from './cooperator'
import store from '../../store'

export default {
  name: 'Dashboard',
  components: { adminDashboard, cooperatorDashboard },
  data() {
    return {
      adminDash: 'adminDashboard',
      cooperateDash: 'cooperatorDashboard',
      currentRole: store.getters.roles[0]
    }
  },
  created() {
    this.currentRole=store.getters.roles[0]
  }
}
</script>
