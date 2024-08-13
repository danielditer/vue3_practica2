import {createStore} from 'vuex'
import axios from "axios";

export default createStore({
    state: {
        count: 0,
        baseUrl: process.env.VUE_APP_API_URL,
        productos: [],
        categorias: [],
        itemList: [],
        searchResults: []
    },
    mutations: {
        increment(state) {
            state.count++
        },
        ADD_PRODUCT(state, product) {
            state.productos.push(product);
        },
        SET_CATEGORIES(state, categories) {
            state.categorias = categories;
        },
        SET_PRODUCTS(state, products) {
            state.productos = products;
        },
        UPDATE_PRODUCT(state, updatedProduct) {
            const index = state.productos.findIndex(product => product.id === updatedProduct.id);
            if (index !== -1) {
                state.productos.splice(index, 1, updatedProduct);
            }
        },
        UPDATE_PRODUCT_CATEGORIES(state, updatedProducts) {
            state.productos = updatedProducts;
        },
        REMOVE_PRODUCT(state, productId) {
            state.productos = state.productos.filter(product => product.id !== productId);
        },
        ADD_CATEGORY(state, category) {
            state.categorias.push(category);
        },
        UPDATE_CATEGORY(state, updatedCategory) {
            const index = state.categorias.findIndex(category => category.id === updatedCategory.id);
            if (index !== -1) {
                state.categorias.splice(index, 1, updatedCategory);
            }
        },
        REMOVE_CATEGORY(state, categoryId) {
            state.categorias = state.categorias.filter(category => category.id !== categoryId);
        },
        UPDATE_PRODUCT_CATEGORY_IDS(state, updatedProducts) {
            state.productos = updatedProducts;
        },
        SET_SEARCH_RESULTS(state, products) {
            state.itemList = products;
        },
    },
    actions: {
        increment({commit}) {
            commit('increment')
        },
        fetchCategories({commit}) {
            return axios.get(this.state.baseUrl + "/categorias")
                .then(response => {
                    commit('SET_CATEGORIES', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    throw error;
                });
        },
        fetchProducts({commit}) {
            return axios.get(this.state.baseUrl + "/productos",)
                .then(response => {
                    commit('SET_PRODUCTS', response.data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        },
        searchProductsByName({commit, state}, textToSearch) {
            return axios.get(`${this.state.baseUrl}/productos?name_like=${textToSearch}`)
                .then(response => {
                    const products = response.data.map(product => {
                        product.categorias = product.categoryIds.map(id =>
                            this.state.categorias.find(category => category.id === id)
                        );
                        return product;
                    });
                    commit('SET_SEARCH_RESULTS', products);
                    return products;
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                    throw error;
                });
        },
        filterProductsByPrice({commit}, price) {
            axios.get(`${this.state.baseUrl}/productos?price_gte=${price}`)
                .then(response => {
                    const products = response.data.map(product => {
                        product.categorias = product.categoryIds.map(id =>
                            this.state.categorias.find(category => category.id === id)
                        );
                        return product;
                    });
                    commit('SET_PRODUCTS', response.data);
                    return products;
                });
        },
        async saveProduct({commit}, productData) {
            try {
                const transformedProduct = {
                    ...productData,
                    categoryIds: productData.categories.map(category => category.id)
                };
                delete transformedProduct.categories;

                const response = await axios.post(this.state.baseUrl + "/productos", transformedProduct);

                commit('ADD_PRODUCT', response.data);

                return response.data;
            } catch (error) {
                console.error('Error saving product:', error);
                throw error;
            }
        },
        updateProduct({commit}, updatedProduct) {
            return axios.put(`${this.state.baseUrl}/productos/${updatedProduct.id}`, updatedProduct)
                .then(response => {
                    commit('UPDATE_PRODUCT', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    throw error;
                });
        },
        deleteProduct({commit}, productId) {
            return axios.delete(`${this.state.baseUrl}/productos/${productId}`)
                .then(() => {
                    commit('REMOVE_PRODUCT', productId);
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    throw error;
                });
        },
        updateProductCategories({commit, state}, categorias) {
            const updatedProducts = state.productos.map(product => {
                const categoryIds = Array.isArray(product.categoryIds) ? product.categoryIds : [];

                return {
                    ...product,
                    categorias: categoryIds.map(id => categorias.find(category => category.id === id))
                };
            });

            commit('UPDATE_PRODUCT_CATEGORIES', updatedProducts);
        },
        saveCategory({commit}, categoryData) {
            return axios.post(this.state.baseUrl + "/categorias", categoryData)
                .then(response => {
                    commit('ADD_CATEGORY', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error saving category:', error);
                    throw error;
                });
        },
        updateCategory({commit}, updatedCategory) {
            return axios.put(`${this.state.baseUrl}/categorias/${updatedCategory.id}`, updatedCategory)
                .then(response => {
                    commit('UPDATE_CATEGORY', response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error('Error updating category:', error);
                    throw error;
                });
        },
        deleteCategory({commit, state, dispatch}, categoryId) {
            return axios.delete(`${this.state.baseUrl}/categorias/${categoryId}`)
                .then(() => {
                    commit('REMOVE_CATEGORY', categoryId);

                    const updatedProducts = state.productos.map(product => {
                        return {
                            ...product,
                            categoryIds: product.categoryIds.filter(id => id !== categoryId)
                        };
                    });

                    commit('UPDATE_PRODUCT_CATEGORY_IDS', updatedProducts);

                    updatedProducts.forEach(product => {
                        dispatch('updateProduct', product);
                    });
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                    throw error;
                });
        }
    },
    getters: {
        doubleCount(state) {
            return state.count * 2
        },
        getBaseUrl(state) {
            return state.baseUrl
        },
        productos: state => state.itemList.length ? state.itemList : state.productos,
        categorias: state => state.categorias,
        filteredProducts: state => {
            return state.searchResults.length ? state.searchResults : state.productos;
        },
        loged() {
            return localStorage.getItem('user') !== null;
        },
        user() {
            return JSON.parse(localStorage.getItem('user'));
        },
        rol() {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('rol()', user);
            if (user && user.role) {
                return user.role;
            }
            return 'juani';
        },
    }
})
