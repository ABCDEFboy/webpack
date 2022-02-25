import Vue from 'vue';
import Vuex from 'vuex';
/**
 * @example
 * import { SystemState } from './modules/system';
 */

Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  /**
   * @example
   * SystemState
   */
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({});
