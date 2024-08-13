
      import { createApp } from 'vue';
      import ToastsManager from './components/ToastsManager.vue';

      let instance;

      export default {
        install(app) {
          const container = document.createElement('div');
          document.body.appendChild(container);
          const toastApp = createApp(ToastsManager);
          instance = toastApp.mount(container);

          app.config.globalProperties.$toast = {
            show(message, type = 'info', duration = 3000) {
              instance.addToast(message, type, duration);
            }
          };
        }
      };