<template>
    <div class="modal">
        <h2>Edit Category</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" v-model="form.name"/>
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar</button>
        </form>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    name: 'EditCategoryView',
    props: {
        item: Object
    },
    data() {
        return {
            form: {
                id: this.item.id,
                name: this.item.name
            },
            errors: {}
        };
    },
    methods: {
        ...mapActions(['updateCategory']),
        validateForm() {
            this.errors = {};
            if (!this.form.name) {
                this.errors.name = 'Name is required.';
            }
            return Object.keys(this.errors).length === 0;
        },
        submitForm() {
            if (this.validateForm()) {
                this.updateCategory(this.form).then(category => {
                    this.$emit('on-update', category);
                }).catch(error => {
                    console.error('Error updating category:', error);
                });
            }
        }
    }
};
</script>

<style scoped>

</style>
