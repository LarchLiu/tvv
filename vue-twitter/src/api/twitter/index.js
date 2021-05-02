import API from '@/utils/request-api'

function getUsersData () {
  const apiPath = '/users'

  return API.getRequest(apiPath)
}

function getTweetsData (user, page) {
  const apiPath = `/tweets?page=${page - 1}&pageNum=20&username=${user}`

  return API.getRequest(apiPath)
}

function getUpdateInfo () {
  const apiPath = '/updates'

  return API.getRequest(apiPath)
}

export default {
  getUsersData,
  getTweetsData,
  getUpdateInfo
}
