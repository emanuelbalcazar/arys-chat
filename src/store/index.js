import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {

    },
    state: {
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        isAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        }
    },
    actions: {
        signUserIn({ commit }) {
            commit('isAuthenticated', true)
        },
        signUserOut({ commit }) {
            commit('isAuthenticated', false);
        }
    },
    getters: {
        loading(state) {
            return state.loading
        },
        error(state) {
            return state.error
        },
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        user (state) {
            return state.user;
        }

    }
})