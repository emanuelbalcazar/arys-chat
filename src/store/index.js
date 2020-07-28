import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    modules: {

    },
    state: {
        loading: false,
        error: null,
        user: null,
        isAuthenticated: false
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
        },
        setAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        }
    },
    actions: {
        async signUserUp({ commit }, payload) {
            commit('clearError');
            commit('setLoading', true);

            await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).catch(error => {
                commit('setLoading', false);
                commit('setError', error);
                return;
            });

            //await firebase.database().ref('users').child(auth.user.uuid).set({ username: payload.username, email: payload.email, password: payload.password });
            commit('setLoading', false);
            commit('setUser', { email: payload.email });
        },
        async signUserIn({ commit }, payload) {
            commit('setLoading', true);
            commit('clearError');

            let auth = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).catch(error => {
                commit('setLoading', false);
                commit('setError', error);
                return;
            });

            if (auth != null) {
                commit('setLoading', false);
                commit('setUser', { id: auth.user.uid, email: auth.user.email });
            }
        },
        async userAuthenticated({ commit }, payload) {
            commit('clearError');
            commit('setAuthenticated', payload);
            commit('setLoading', false);
        },
        async signUserOut({ commit }) {
            commit('setUser', null);
            commit('setAuthenticated', false);
            commit('setLoading', false);
        },
        async clearError({ commit }) {
            commit('clearError')
        },
        async setLoading({commit}, payload) {
            commit('setLoading', payload);
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
        user(state) {
            return state.user;
        }
    }
})