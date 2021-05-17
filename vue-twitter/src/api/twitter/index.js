import API from '@/utils/request-api'
import settings from '@/settings'

function getUsersData() {
  const apiPath = '/tweeps'

  return API.getRequest(apiPath)
}

function getTweetsData(username, page) {
  const apiPath = `/tweets?page=${page}&limit=${settings.pageSize}&username=${username}&sortBy=timestamp:desc`

  return API.getRequest(apiPath)
}

function getUpdateInfo() {
  const apiPath = '/updates'

  return API.getRequest(apiPath)
}

function addTweeps(paylod) {
  const apiPath = '/tweeps'

  return API.postRequest(apiPath, paylod)
}

function delTweeps(paylod) {
  const apiPath = '/tweeps'

  return API.deleteRequest(apiPath, paylod)
}

function refresh(paylod) {
  const apiPath = '/updates'

  return API.postRequest(apiPath, paylod)
}

export default {
  getUsersData,
  getTweetsData,
  getUpdateInfo,
  addTweeps,
  delTweeps,
  refresh,
}
