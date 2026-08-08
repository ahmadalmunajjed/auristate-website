import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 's055z044',
    dataset: 'production'
  },
  /**
   * Where `sanity deploy` publishes to: https://auristate.sanity.studio
   *
   * Pinned here rather than answered at the prompt so deploys are repeatable
   * and non-interactive (CI, or an agent without a TTY). The name is claimed
   * globally across all of Sanity, first-come — if the first deploy fails with
   * a name conflict, change it here rather than passing a one-off flag, or the
   * next deploy will disagree with this file.
   */
  studioHost: 'auristate',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    // Pinned for the same reason as studioHost above — avoids an application-id
    // prompt on a future non-interactive deploy.
    appId: 'uiahyaw0cbern59v0nwtphnk',
  },
})
