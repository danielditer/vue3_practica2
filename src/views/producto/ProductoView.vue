<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <RegisterProductoView @on-register="onRegister($event)"/>
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditProductoView @on-update="onUpdate($event)" :item="itemToEdit"/>
        </Modal>
        <h1>Lista de Productos</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary" style="margin-right: 15px;">Nuevo Producto
        </button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input
            type="search"
            style="float:right; margin-right: 15px;"
            v-model="searchQuery"
            @input="debouncedSearch"
            placeholder="Buscar"
        />
        <input
            type="number"
            v-model.number="priceFilter"
            placeholder="Filtrar por precio mayor a"
            style="margin-right: 15px;"
        />
        <button @click="filterByPrice" class="btn btn-lith">Filtrar</button>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categorias</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in productos" :key="product.id">
                <td>{{ 1 + index }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>
                    {{
                        (product.categorias || []).filter(category => category).map(category => category.name).join(', ')
                    }}
                </td>
                <td>
                    <button @click="editProduct(product)" class="btn btn-dark" style="margin-right: 15px;">Editar
                    </button>
                    <button @click="handleDeleteProduct(product.id)" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import Modal from '../../components/Modal.vue'
import RegisterProductoView from './RegisterProductoView.vue'
import EditProductoView from './EditProductoView.vue'
import {debounce} from 'lodash'

export default {
    name: 'Producto',
    components: {
        Modal,
        RegisterProductoView,
        EditProductoView
    },
    data() {
        return {
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            searchQuery: '',
            priceFilter: 100
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapState({
            productos: state => state.itemList.length ? state.itemList : state.productos,
            categorias: state => state.categorias
        }),
        ...mapGetters(['getBaseUrl'])
    },
    methods: {
        ...mapActions([
            'fetchCategories',
            'fetchProducts',
            'updateProductCategories',
            'deleteProduct',
            'searchProductsByName'
        ]),

        editProduct(product) {
            this.fetchCategories().then(() => {
                this.itemToEdit = Object.assign({}, product);
                this.showModalEdit = true;
            });
        },
        handleDeleteProduct(id) {
            if (confirm("¿Está seguro de eliminar el registro?")) {
                this.deleteProduct(id)
                    .then(() => {
                        this.$toast.show("Registro eliminado.", "danger");
                        this.getProducts();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        },
        buscar() {
            this.searchProductsByName(this.searchQuery).then(() => {
                this.updateProductCategories(this.categorias);
            });
        },
        onRegister(event) {
            console.log("on register");
            this.getProducts();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            console.log("on update");
            this.getProducts();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edición exitosa', 'info');
        },
        getProducts() {
            this.fetchProducts().then(() => {
                this.updateProductCategories(this.categorias);
            });
        },
        getCategories() {
            this.fetchCategories().then(() => {
                this.updateProductCategories(this.categorias);
            });
        },

        debouncedSearch: debounce(function () {
            this.buscar();
        }, 300),

        filterByPrice() {
            this.$store.dispatch('filterProductsByPrice', this.priceFilter);
        }
    },
    mounted() {
        this.getCategories();
        this.getProducts();
    }
}
</script>

<style scoped>

</style>
