<template>
    <div class="modal">
        <h2>Registrar Categoria</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Nombre:</label>
                <input type="text" v-model="form.name"/>
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <button type="submit" class="btn btn-primary">Registrar</button>
        </form>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'RegisterCategoryView',
    data() {
        return {
            form: {
                name: ''
            },
            errors: {}
        };
    },
    methods: {
        ...mapActions(['saveCategory']),
        validateForm() {
            this.errors = {};
            if (!this.form.name) {
                this.errors.name = 'Name is required.';
            }
            return Object.keys(this.errors).length === 0;
        },
        submitForm() {
            if (this.validateForm()) {
                this.saveCategory(this.form).then(category => {
                    this.$emit('on-register', category);
                    this.form.name = '';
                }).catch(error => {
                    console.error('Error saving category:', error);
                });
            }
        }
    }
};
</script>

<style scoped>

</style>
