<template>
    <div class="modal">
        <h2>Registrar Producto</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Nombre:</label>
                <input type="text" v-model="form.name"/>
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

            <button type="submit" class="btn btn-primary">Registrar</button>
        </form>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
    name: 'RegisterProducto',
    components: {Multiselect},
    data() {
        return {
            form: {
                name: '',
                categories: [],
                price: 0.10
            },
            errors: {},
        };
    },
    methods: {
        ...mapActions(['fetchCategories', 'saveProduct']),
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
                this.saveProduct(this.form).then(product => {
                    this.$emit('on-register', product);
                    this.form = {name: '', categories: [], price: ''};
                });
            }
        }
    },
    mounted() {
        this.fetchCategories();
    },
    computed: {
        ...mapState({
            categories: state => state.categorias,
        })
    },
};
</script>

<style scoped>

</style>
