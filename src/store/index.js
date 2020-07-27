import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {

    },
    state: {
        loading: false,
        error: null,
        user: null
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        clearError(state) {
            state.error = null
        },
        setUser(state, payload) {
            state.user = payload;
        }
    },
    actions: {
        async signUserUp({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);

            let auth = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).catch(error => {
                commit('setLoading', false);
                commit('setError', error);
                return;
            });
            
            await firebase.database().ref('users').child(auth.user.uuid).set({ username: payload.username, email: payload.email, password: payload.password });
            commit('setLoading', false);
            commit('setUser', { id: auth.user.uuid, username: payload.username, email: payload.email });
        },
        async signUserIn({ commit }, payload) {
            commit('setLoading', true);
            commit('clearError');

            let auth = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).catch(error => {
                commit('setLoading', false);
                commit('setError', error);
                return;
            });

            commit('setLoading', false);
            commit('setUser', { id: auth.user.uid, username: auth.user.username, email: auth.user.email });
        },
        async signUserOut({ commit }) {
            commit('setUser', null);
        },
        async clearError({ commit }) {
            commit('clearError')
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
            return (state.user != null && state.user.email != null);
        },
        user(state) {
            return state.user;
        }
    }
})