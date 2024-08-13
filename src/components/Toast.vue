<template>
    <div v-if="visible" :class="['toast', type]" @click="hide">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'info'
        },
        duration: {
            type: Number,
            default: 3000
        }
    },
    data() {
        return {
            visible: false,
            timeout: null
        };
    },
    mounted() {
        this.show();
    },
    methods: {
        show() {
            this.visible = true;
            if (this.duration > 0) {
                this.timeout = setTimeout(() => {
                    this.hide();
                }, this.duration);
            }
        },
        hide() {
            this.visible = false;
            clearTimeout(this.timeout);
        }
    }
};
</script>

<style scoped>
.toast {
    padding: 10px 20px;
    border-radius: 5px;
    margin: 10px 0;
    display: inline-block;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.5s;
}

.toast.info {
    background-color: #2196F3;
    color: #fff;
}

.toast.success {
    background-color: #4CAF50;
    color: #fff;
}

.toast.warning {
    background-color: #FF9800;
    color: #fff;
}

.toast.danger {
    background-color: #F44336;
    color: #fff;
}</style>