import API from '@/utils/request-api'
import settings from '@/settings'

function getUsersData() {
  const apiPath = '/users'

  return API.getRequest(apiPath)
}

function getTweetsData(user, page) {
  const username = user === '@all' ? '' : user
  const apiPath = `/tweets?page=${page - 1}&pageSize=${
    settings.pageSize
  }&username=${username}`

  return API.getRequest(apiPath)
}

function getUpdateInfo() {
  const apiPath = '/updateInfo'

  return API.getRequest(apiPath)
}

export default {
  getUsersData,
  getTweetsData,
  getUpdateInfo,
}
