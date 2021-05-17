import { createStore, createLogger } from 'vuex'
import { Base64 } from 'js-base64'
import {
  getGHToken,
  setGHToken,
  getUserTokens,
  setUserTokens,
  getUser,
  setUser,
} from '@/utils/local-storage'

const state = {
  gh_token: getGHToken(),
  user_tokens: getUserTokens(),
  user: getUser(),
  is_mobile: false,
}

const mutations = {
  SET_GH_TOKEN: (state, token) => {
    state.gh_token = token
  },
  SET_IS_MOBILE: (state, isMobile) => {
    state.is_mobile = isMobile
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_USER_TOKENS: (state, tokens) => {
    state.user_tokens = tokens
  },
}

const actions = {
  setGHToken({ commit }, token) {
    const _token = Base64.encode(token)
    setGHToken(_token)
    commit('SET_GH_TOKEN', _token)
  },
  setUserTokens({ commit }, tokens) {
    let str = tokens
    if (tokens instanceof Object) {
      str = JSON.stringify(tokens)
    }
    setUserTokens(str)
    commit('SET_USER_TOKENS', str)
  },
  setUser({ commit }, user) {
    let str = user
    if (user instanceof Object) {
      str = JSON.stringify(user)
    }
    setUser(str)
    commit('SET_USER', str)
  },
  setIsMobile({ commit }, isMobile) {
    commit('SET_IS_MOBILE', isMobile)
  },
}

const getters = {
  ghToken: (state) => (state.gh_token ? Base64.decode(state.gh_token) : ''),
  isMobile: (state) => state.is_mobile,
  userTokens: (state) =>
    state.user_tokens ? JSON.parse(state.user_tokens) : '',
  user: (state) => (state.user ? JSON.parse(state.user) : ''),
}

const store = createStore({
  actions,
  state,
  mutations,
  getters,
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
})

export default store
