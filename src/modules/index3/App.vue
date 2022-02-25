<template>
  <div id="app"><router-view /></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';

// const settingModule = namespace('system');

@Component({})
export default class App extends Vue {
  // @settingModule.State('setting') setting!: SystemSettingItem;
}
</script>

<style lang="scss">
.router-view {
  min-height: calc(100vh - 140px);
}
</style>
