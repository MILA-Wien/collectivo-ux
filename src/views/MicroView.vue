<template>
  <div id="single-spa-application:app2"></div>
</template>

<script lang="ts">
// For new versions of webpack
import { registerApplication, start } from 'single-spa';
import 'systemjs'
export default {
  components: {
  },
  data() {
    return {
    }
  },

  mounted() {
    // const originalResolve = System.constructor.prototype.resolve;
    // System.constructor.prototype.resolve = function (id:any) {
    //   try {
    //     return originalResolve.apply(this, arguments);
    //   } catch (err) {
    //     return otherResolution(id);
    //   }
    // };
    System.addImportMap({
      imports: {
        'app2': 'https://coexisting-vue-microfrontends.surge.sh/app2/js/app.js',
      },
    });
    System.register('app2', [], function (e, t) {
      return {
        execute: function () {
          t({
            bootstrap: function () {
              return Promise.resolve();
            },
            mount: function () {
              return Promise.resolve();
            },
            unmount: function () {
              return Promise.resolve();
            }
          });
        }
      };
    });

    registerApplication(
      'app2',
      () => System.import('app2'),
      location => location.pathname.startsWith('/micro'),
    );
    start({
      urlRerouteOnly: true,
    });

  },
}
</script>