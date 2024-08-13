<template>
    <div class="toasts-container">
        <Toast
            v-for="(toast, index) in toasts"
            :key="index"
            :type="toast.type"
            :duration="toast.duration"
            @click="removeToast(index)"
        >
            {{ toast.message }}
        </Toast>
    </div>
</template>

<script>
import Toast from './Toast.vue';

export default {
    components: {Toast},
    data() {
        return {
            toasts: []
        };
    },
    methods: {
        addToast(message, type = 'info', duration = 3000) {
            this.toasts.push({message, type, duration});
        },
        removeToast(index) {
            this.toasts.splice(index, 1);
        }
    }
};
</script>

<style scoped>
.toasts-container {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
</style>