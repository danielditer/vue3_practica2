<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <RegisterCategoryView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditCategoryView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Categorias</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nueva Categoria</button>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(category, index) in categories" :key="category.id">
                <td>{{ 1 + index }}</td>
                <td>{{ category.name }}</td>
                <td>
                    <button @click="editCategory(category)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                    <button @click="handleDeleteCategory(category.id)" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Modal from '../../components/Modal.vue';
import RegisterCategoryView from './RegisterCategoryView.vue';
import EditCategoryView from './EditCategoryView.vue';

export default {
    name: 'CategoryView',
    components: {
        Modal,
        RegisterCategoryView,
        EditCategoryView
    },
    data() {
        return {
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null
        };
    },
    computed: {
        ...mapState({
            categories: state => state.categorias
        })
    },
    methods: {
        ...mapActions(['fetchCategories', 'deleteCategory']),
        editCategory(category) {
            this.itemToEdit = category;
            this.showModalEdit = true;
        },
        handleDeleteCategory(categoryId) {
            if (confirm("¿Está seguro de eliminar el registro?")) {
                this.deleteCategory(categoryId).then(() => {
                    this.$toast.show("Registro eliminado.", "danger");
                    this.fetchCategories();
                }).catch(error => {
                    console.error('Error:', error);
                });
            }
        },
        onRegister(category) {
            this.showModalNuevo = false;
            this.fetchCategories();
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(category) {
            this.showModalEdit = false;
            this.fetchCategories();
            this.$toast.show('Edición exitosa', 'info');
        }
    },
    mounted() {
        this.fetchCategories();
    }
};
</script>

<style scoped>

</style>
