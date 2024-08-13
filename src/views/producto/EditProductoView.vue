<template>
    <div class="modal">
        <h2>Editar Producto</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Nombre:</label>
                <input type="text" v-model="form.name" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>

            <div class="form-group">
                <label for="categories">Categorias:</label>
                <multiselect
                    v-model="form.categories"
                    :options="categories"
                    :multiple="true"
                    label="name"
                    track-by="id"
                    class="multiselect"
                />
                <span v-if="errors.categories">{{ errors.categories }}</span>
            </div>

            <div class="form-group">
                <label for="price">Precio:</label>
                <input type="number" v-model="form.price" @input="formatPrice" min="0.1" step="0.1"/>
                <span v-if="errors.price">{{ errors.price }}</span>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
    name: 'EditProducto',
    components: { Multiselect },
    props: {
        item: Object
    },
    data() {
        return {
            form: {
                id: this.item.id,
                name: this.item.name,
                categoryIds: this.item.categoryIds.map((cat) => cat.id),
                price: this.item.price
            },
            errors: {},
            categories: []
        };
    },
    methods: {
        ...mapActions(['fetchCategories', 'updateProduct']),
        formatPrice() {
            this.form.price = parseFloat(this.form.price).toFixed(2);
        },
        validateForm() {
            this.errors = {};
            if (!this.form.name) {
                this.errors.name = 'El nombre es requerido.';
            }
            if (!this.form.categories.length) {
                this.errors.categories = 'Al menos una categoria es requerida.';
            }
            if (!this.form.price) {
                this.errors.price = 'El precio es requerido.';
            }
            return Object.keys(this.errors).length === 0;
        },
        submitForm() {
            if (this.validateForm()) {
                const updatedProduct = {
                    ...this.form,
                    categoryIds: this.form.categories.map(category => category.id),
                };
                delete updatedProduct.categories;

                this.updateProduct(updatedProduct).then(product => {
                    this.$emit('on-update', product);
                }).catch(error => {
                    console.error('Error updating product:', error);
                });
            }
        }
    },
    mounted() {
        this.fetchCategories().then(categories => {
            this.categories = categories;

            this.form.categories = this.item.categoryIds.map(id =>
                this.categories.find(category => category.id === id)
            );
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }

};
</script>

<style scoped>

</style>
