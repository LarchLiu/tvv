const GithubToken = 'gh-token'
const UserTokens = 'user-tokens'
const User = 'user'

export function getGHToken() {
  return window.localStorage.getItem(GithubToken)
}

export function setGHToken(token) {
  return window.localStorage.setItem(GithubToken, token)
}

export function getUserTokens() {
  return window.localStorage.getItem(UserTokens)
}

export function setUserTokens(tokens) {
  return window.localStorage.setItem(UserTokens, tokens)
}

export function getUser() {
  return window.localStorage.getItem(User)
}

export function setUser(user) {
  return window.localStorage.setItem(User, user)
}
