<template>
  <div ref="notifications">Notifications</div>
</template>

<script>
  import { renderWidget } from '@magicbell/embeddable/dist/magicbell.esm.js';

  export default {
    name: 'Notifications',
    mounted: function () {
      const options = {
        apiKey: 'MAGICBELL_API_KEY',
        userEmail: 'mary@example.com',
      };
      renderWidget(this.$refs.notifications, options);
    },
  };
</script>