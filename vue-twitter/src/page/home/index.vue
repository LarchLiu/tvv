<template>
  <div class="container">
    <image-preview
      v-if="imgPreview"
      @clickit="disablePreview"
      :imgSrc="imgSrc"
    />
    <div :class="isMobile ? '' : 'w820'">
      <div class="bd">
        <div class="aside-wrap" v-if="!isMobile">
          <aside-box :title="title" :need-fixed="true" id-name="header">
            <template v-slot:btn>
              <span style="float: right">
                <MinusOutlined
                  v-if="userInfo && userInfo.role !== 'guest'"
                  style="margin-right: 4px"
                  @click="handleDelUsers"
                />
                <PlusOutlined
                  v-if="userInfo && userInfo.role !== 'guest'"
                  style="margin-right: 4px"
                  @click="handleAddUsers"
                />
                <SyncOutlined
                  v-if="userInfo && userInfo.role === 'admin'"
                  style="margin-right: 4px"
                  @click="actionScraper"
                />
              </span>
            </template>
            <template v-slot:default v-if="usersList.length > 0">
              <div
                v-for="(user, i) in usersList"
                :key="i"
                @click="changeUser(i)"
              >
                <a-badge
                  :dot="
                    needUpdate &&
                    updateUser.findIndex((e) => e === user.userinfo.username) >=
                      0
                  "
                >
                  <a
                    :class="
                      user.userinfo.username === currentUser
                        ? 'current'
                        : 'normal'
                    "
                    >{{
                      user.userinfo.name
                        ? user.userinfo.name
                        : user.userinfo.username
                    }}</a
                  >
                </a-badge>
              </div>
            </template>
          </aside-box>
        </div>
        <div v-else>
          <a-drawer
            :title="title"
            placement="left"
            :closable="false"
            :visible="sidebarOpen"
            :get-container="false"
            @close="sidebarOpen = false"
          >
            <p style="font-size: 12px; color: #aba8b1; text-align: center">
              {{ '更新时间: ' + getTime(updateTime) }}
            </p>
            <div v-for="(user, i) in usersList" :key="i" @click="changeUser(i)">
              <a-badge
                :dot="
                  needUpdate &&
                  updateUser.findIndex((e) => e === user.userinfo.username) >= 0
                "
              >
                <a
                  :class="
                    user.userinfo.username === currentUser
                      ? 'current'
                      : 'normal'
                  "
                  >{{
                    user.userinfo.name
                      ? user.userinfo.name
                      : user.userinfo.username
                  }}</a
                >
              </a-badge>
            </div>
          </a-drawer>
        </div>
        <div
          v-if="usersList.length > 0 && usersListObj[currentUser]"
          :class="isMobile ? 'tweets-mobile' : 'tweets'"
        >
          <fixed-header
            id-name="twitter"
            :style-class-name="
              isMobile ? 'fixed-header-mobile' : 'fixed-header'
            "
          >
            <div class="header">
              <span v-if="isMobile" style="margin-right: 10px">
                <a-badge :dot="needUpdate">
                  <MenuFoldOutlined
                    v-if="sidebarOpen"
                    class="menu"
                    @click="sidebarOpen = !sidebarOpen"
                  />
                  <MenuUnfoldOutlined
                    v-else
                    class="menu"
                    @click="sidebarOpen = !sidebarOpen"
                  />
                </a-badge>
              </span>
              <span
                v-if="currentUser === usersList[0].userinfo.username"
                class="name"
                >全部</span
              >
              <span v-else class="name">{{
                usersListObj[currentUser].profile.name
              }}</span>
              <span v-if="isMobile" class="floating">
                <a-dropdown :trigger="['click']">
                  <span @click.prevent
                    ><SettingFilled style="font-size: 20px"
                  /></span>
                  <template #overlay>
                    <a-menu v-if="userInfo">
                      <a-menu-item v-if="userInfo.role === 'admin'">
                        <a @click="actionScraper">更新数据</a>
                      </a-menu-item>
                      <a-menu-item v-if="userInfo.role !== 'guest'">
                        <a @click="handleAddUsers">添加用户</a>
                      </a-menu-item>
                      <a-menu-item v-if="userInfo.role !== 'guest'">
                        <a @click="handleDelUsers">删除用户</a>
                      </a-menu-item>
                      <a-menu-divider v-if="userInfo.role !== 'guest'" />
                      <a-menu-item>
                        <a @click="onExit">退出</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </span>
              <div v-else class="floating">
                <p style="color: rgb(91, 112, 131)">
                  {{ '更新时间: ' + getTime(updateTime) }}
                </p>
              </div>
            </div>
          </fixed-header>
          <twitter
            v-if="currentUser === usersList[0].userinfo.username"
            :isAll="true"
            :detail="usersListObj[currentUser]"
            :usersObj="usersListObj"
            :isMobile="isMobile"
            :endPage="isEndPage"
            :loadingMore="loadingMore"
            @loadMore="getNextPage"
            @imgClick="imageClick"
          />
          <twitter
            v-else
            :detail="usersListObj[currentUser]"
            :isMobile="isMobile"
            :endPage="isEndPage"
            :loadingMore="loadingMore"
            @loadMore="getNextPage"
            @imgClick="imageClick"
          />
        </div>
        <div v-else :class="isMobile ? 'tweets-mobile' : 'tweets'">
          <div class="header">
            <span class="name">推文</span>
          </div>
        </div>
      </div>
      <a-modal
        v-if="userInfo"
        :visible="addUserVisible"
        title="添加用户"
        ok-text="确认"
        cancel-text="取消"
        @cancel="cancelUserInput"
        @ok="addUsersAction"
      >
        <div
          v-if="
            userInfo.maxTweeps < 0 ||
            (userInfo.maxTweeps > 0 && userInfo.maxTweeps > delUserData.length)
          "
        >
          <p>请输入用户名，添加多个用户以空格分割</p>
          <a-input v-model:value="inputUsers" placeholder="@username" />
        </div>
        <div v-else>
          {{ `当前权限仅可添加 ${userInfo.maxTweeps.toString()} 人` }}
        </div>
      </a-modal>
      <a-modal
        :visible="delUserVisible"
        title="删除用户"
        ok-text="确认"
        cancel-text="取消"
        @cancel="cancelUserSelect"
        @ok="delUsersAction"
      >
        <a-checkbox-group
          v-model:value="delUserSelect"
          :options="delUserData"
        />
      </a-modal>
    </div>
  </div>
</template>
<script>
import { ref, getCurrentInstance, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import twitterApi from '@/api/twitter/index'
import AsideBox from '@/components/AsideBox/index.vue'
import Twitter from '@/components/Twitter/index.vue'
import ImagePreview from '@/components/ImagePreview/index'
import FixedHeader from '@/components/FixedHeader/index.vue'
import { arrToObj, uniqueArr, parseTime } from '@/utils/index'
import settings from '@/settings'
import {
  MinusOutlined,
  PlusOutlined,
  SettingFilled,
  SyncOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue'

export default {
  components: {
    AsideBox,
    PlusOutlined,
    SettingFilled,
    SyncOutlined,
    Twitter,
    ImagePreview,
    FixedHeader,
    MinusOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const {
      VUE_APP_PUSHER_KEY: pusherKey,
      VUE_APP_PUSHER_CLUSTER: cluster,
    } = process.env
    // eslint-disable-next-line no-undef
    const pusher = new Pusher(pusherKey, {
      cluster,
    })
    const router = useRouter()
    const title = settings.title
    const updateUser = ref([])
    const usersList = ref([])
    const delUserSelect = ref([])
    const usersListObj = ref({})
    const currentUser = ref('')
    const inputToken = ref('')
    const inputUsers = ref('')
    const curPage = ref(1)
    const updateTime = ref(0)
    const needUpdate = ref(false)
    const triggerUpdate = ref(false)
    const triggerChangeUsers = ref(false)
    const tokenVisible = ref(false)
    const addUserVisible = ref(false)
    const delUserVisible = ref(false)
    const sidebarOpen = ref(false)
    const imgPreview = ref(false)
    const loadingMore = ref(false)
    const imgSrc = ref('')
    const store = useStore()
    const userInfo = computed(() => store.getters.user)
    const isMobile = computed(() => store.getters.isMobile)
    const delUserData = computed(() => {
      if (usersList.value.length > 0) {
        return usersList.value.slice(1).map((item) => {
          return item.userinfo.username
        })
      } else {
        return []
      }
    })
    const isEndPage = computed(() => {
      if (currentUser.value && usersListObj.value[currentUser.value]) {
        const pages = Math.ceil(
          parseInt(
            usersListObj.value[currentUser.value].userinfo.tweetscount,
            10
          ) / settings.pageSize
        )
        return curPage.value === pages
      } else {
        return true
      }
    })

    const onExit = () => {
      store.dispatch('setUser', '')
      store.dispatch('setUserTokens', '')
      router.push({
        path: '/login',
      })
    }

    const disablePreview = () => {
      imgPreview.value = false
    }

    const imageClick = (src) => {
      imgSrc.value = src
      imgPreview.value = true
    }

    const actionScraper = () => {
      if (triggerUpdate.value) {
        proxy.$message.warning({
          content: '更新请求未完毕，请耐心等待',
          duration: 3,
        })
      } else if (triggerChangeUsers.value) {
        proxy.$message.warning({
          content: '更改用户请求未完毕，请耐心等待',
          duration: 3,
        })
      } else {
        twitterApi
          .refresh({
            event_type: 'refresh',
          })
          .then(() => {
            triggerUpdate.value = true
            proxy.$message.success({
              content: '更新请求已发出，请等待响应',
              duration: 3,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }

    const addUsers = (type, users) => {
      twitterApi
        .addTweeps({
          event_type: type,
          client_payload: {
            users: users,
          },
        })
        .then((res) => {
          if (res === 'wait') {
            triggerChangeUsers.value = true
            const content = type === 'addusers' ? '添加' : '删除'
            proxy.$message.success({
              content: content + '用户请求已发出，请等待响应',
              duration: 3,
            })
          } else {
            getUserList()
            proxy.$message.success({
              content: '添加成功',
              duration: 3,
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const delUsers = (type, users) => {
      twitterApi
        .delTweeps({
          event_type: type,
          client_payload: {
            users: users,
          },
        })
        .then(() => {
          getUserList()
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const setGHToken = () => {
      tokenVisible.value = false
      store.dispatch('setGHToken', inputToken.value)
      inputToken.value = ''
    }

    const cancelTokenInput = () => {
      tokenVisible.value = false
      inputToken.value = ''
    }

    const handleAddUsers = () => {
      if (triggerUpdate.value) {
        proxy.$message.warning({
          content: '更新请求未完毕，请耐心等待',
          duration: 3,
        })
      } else if (triggerChangeUsers.value) {
        proxy.$message.warning({
          content: '更改用户请求未完毕，请耐心等待',
          duration: 3,
        })
      } else {
        addUserVisible.value = true
      }
    }

    const handleDelUsers = () => {
      if (triggerUpdate.value) {
        proxy.$message.warning({
          content: '更新请求未完毕，请耐心等待',
          duration: 3,
        })
      } else if (triggerChangeUsers.value) {
        proxy.$message.warning({
          content: '更改用户请求未完毕，请耐心等待',
          duration: 3,
        })
      } else {
        delUserVisible.value = true
      }
    }

    const addUsersAction = () => {
      addUserVisible.value = false
      if (
        userInfo.value.maxTweeps < 0 ||
        (userInfo.value.maxTweeps > 0 &&
          userInfo.value.maxTweeps > delUserData.value.length)
      ) {
        const users = inputUsers.value
          .replace(/@/g, '')
          .replace(/\s+/g, ',')
          .replace(/^,*|,*$/g, '')
        if (users) {
          addUsers('addusers', users)
        } else {
          proxy.$message.warning({
            content: '用户名为空',
            duration: 3,
          })
        }
      }
      inputUsers.value = ''
    }

    const delUsersAction = () => {
      delUserVisible.value = false
      const users = delUserSelect.value.join(',')
      if (users) {
        delUsers('delusers', users)
      } else {
        proxy.$message.warning({
          content: '未选择用户',
          duration: 3,
        })
      }
      delUserSelect.value = []
    }

    const cancelUserInput = () => {
      addUserVisible.value = false
      inputUsers.value = ''
    }

    const cancelUserSelect = () => {
      delUserVisible.value = false
      delUserSelect.value = []
    }

    const unshiftUserData = (res) => {
      let list = []
      if (res && res.length) {
        const len = res.length
        list = list.concat(res)
        let lasttweettime = 0
        let lastupdatetime = 0
        let tweetscount = 0
        for (let i = 0; i < len; i++) {
          const ltt = list[i].userinfo.lasttweettime
          const lut = list[i].userinfo.lastupdatetime
          const tct = parseInt(list[i].userinfo.tweetscount, 10)
          if (ltt > lasttweettime) {
            lasttweettime = ltt
          }
          if (lut > lastupdatetime) {
            lastupdatetime = lut
          }
          tweetscount += tct
        }
        const all = {
          userinfo: {
            username: '@all',
            name: 'All',
            lasttweettime,
            lastupdatetime,
            tweetscount,
          },
          profile: {},
        }
        list.unshift(all)
      }
      return list
    }

    const dataInit = () => {
      twitterApi
        .getUsersData()
        .then((res) => {
          const list = unshiftUserData(res)
          usersList.value = list
          if (!list.length) {
            return
          }
          usersListObj.value = arrToObj(list, 'userinfo.username')
          currentUser.value = list[0].userinfo.username
          updateUser.value.push(currentUser.value)
          twitterApi
            .getUpdateInfo()
            .then((info) => {
              updateTime.value = info.updatetime
            })
            .catch((e) => {
              console.log(e)
            })
          for (let i = 0; i < updateUser.value.length; i++) {
            getUserTweets(updateUser.value[i], 1)
          }
        })
        .catch((e) => {
          console.log(e)
          usersList.value = []
        })
    }

    const checkUpdateUsers = (updateInfo) => {
      if (updateTime.value < updateInfo.updatetime) {
        updateTime.value = updateInfo.updatetime
        if (updateInfo.isupdate) {
          needUpdate.value = updateInfo.isupdate
          updateUser.value = updateUser.value.concat(updateInfo.users)
          updateUser.value.push('@all')
          updateUser.value = uniqueArr(updateUser.value)
        }
      }
    }

    const getUpdateInfo = () => {
      twitterApi
        .getUpdateInfo()
        .then((res) => {
          checkUpdateUsers(res)
        })
        .catch((e) => {
          console.log(e)
          // usersList.value = []
        })
    }

    const getUserList = () => {
      twitterApi
        .getUsersData()
        .then((res) => {
          const list = unshiftUserData(res)
          usersList.value = list
          if (!list.length) {
            return
          }
          const oldObj = Object.assign({}, usersListObj.value)
          usersListObj.value = arrToObj(list, 'userinfo.username')
          const users = Object.keys(usersListObj.value)
          for (let i = 0; i < users.length; i++) {
            const user = users[i]
            if (oldObj[user] && oldObj[user].Tweets) {
              usersListObj.value[user].Tweets = oldObj[user].Tweets
            } else {
              usersListObj.value[user].Tweets = []
            }
          }
        })
        .catch((e) => {
          console.log(e)
          // usersList.value = []
        })
    }

    const getUserTweets = (user, page) => {
      let users = ''
      if (user === '@all') {
        const keys = Object.keys(usersListObj.value)
        keys.shift()
        users = keys.join(',')
      } else {
        users = user
      }
      twitterApi
        .getTweetsData(users, page)
        .then((data) => {
          if (curPage.value === 1) {
            usersListObj.value[user].Tweets = data.results
          } else {
            usersListObj.value[user].Tweets = usersListObj.value[
              user
            ].Tweets.concat(data.results)
          }
          const idx = updateUser.value.findIndex((e) => e === user)
          if (idx >= 0) {
            updateUser.value.splice(idx, 1)
          }
          if (updateUser.value.length === 0) {
            needUpdate.value = false
          }
          if (loadingMore.value) {
            loadingMore.value = false
          }
          // nextTick(() => {
          //   checkFixed.value++
          // })
        })
        .catch((err) => {
          loadingMore.value = false
          if (page > 1) {
            curPage.value--
          } else {
            usersListObj.value[user].Tweets = []
          }
          console.log(err)
        })
    }

    const changeUser = (i) => {
      currentUser.value = usersList.value[i].userinfo.username
      curPage.value = 1
      document.body.scrollTop = document.documentElement.scrollTop = 0
      if (sidebarOpen.value) {
        sidebarOpen.value = false
      }
      getUserTweets(currentUser.value, curPage.value)
    }

    const getNextPage = () => {
      loadingMore.value = true
      curPage.value++
      getUserTweets(currentUser.value, curPage.value)
    }

    const margeDetail = (tweet, profile) => {
      return { avatar: profile.avatar, name: profile.name, ...tweet }
    }

    const getTime = (unix) => {
      return parseTime(unix)
    }

    const preD = function (e) {
      e.preventDefault()
    }

    const handleUpdateInfo = (data) => {
      if (data) {
        const updateInfo = data
        const keys = Object.keys(updateInfo)
        keys.forEach((key) => {
          updateInfo[key.toLowerCase()] = updateInfo[key]
        })
        checkUpdateUsers(updateInfo)
        if (triggerUpdate.value) {
          triggerUpdate.value = false
          proxy.$message.success({
            content: '更新请求已完毕',
            duration: 3,
          })
        }
        if (triggerChangeUsers.value) {
          triggerChangeUsers.value = false
          proxy.$message.success({
            content: '更改用户请求已完毕',
            duration: 3,
          })
        }
        if (updateInfo.type === 'addusers' || updateInfo.type === 'delusers') {
          getUserList()
        }
      }
    }

    onMounted(() => {
      dataInit()
      const channel = pusher.subscribe('update-info')
      channel.bind('scraper-post', function (data) {
        console.log(data)
        handleUpdateInfo(data)
      })
    })

    watch(imgPreview, (val) => {
      if (val) {
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', preD, { passive: false }) // 禁止页面滑动
      } else {
        document.body.style.overflow = '' // 出现滚动条
        document.removeEventListener('touchmove', preD, { passive: false })
      }
    })

    return {
      title,
      isEndPage,
      disablePreview,
      imageClick,
      imgPreview,
      imgSrc,
      currentUser,
      curPage,
      usersList,
      getUserTweets,
      getUserList,
      getUpdateInfo,
      changeUser,
      onExit,
      actionScraper,
      addUsers,
      delUsers,
      margeDetail,
      usersListObj,
      updateUser,
      needUpdate,
      triggerUpdate,
      triggerChangeUsers,
      updateTime,
      setGHToken,
      tokenVisible,
      inputToken,
      cancelTokenInput,
      addUserVisible,
      delUserVisible,
      delUserData,
      delUserSelect,
      inputUsers,
      addUsersAction,
      cancelUserInput,
      handleAddUsers,
      handleDelUsers,
      delUsersAction,
      cancelUserSelect,
      isMobile,
      getTime,
      sidebarOpen,
      getNextPage,
      loadingMore,
      checkUpdateUsers,
      handleUpdateInfo,
      userInfo,
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  font-size: 12px;
  color: #666;

  .w820 {
    width: 820px;
    margin: 0 auto;
  }

  .bd {
    overflow: hidden;
    .aside-wrap {
      float: left;
      width: 210px;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .tweets-body() {
      .header {
        padding: 10px;
        background-color: #f7f7f7;
        border: 1px solid #eee;

        .menu {
          font-size: 20px;
        }
        .name {
          font-size: 15px;
          font-weight: 800;
          border: 0 solid black;
          margin-right: 10px;
        }
        .floating {
          display: table;
          float: right;
          height: 23px;
        }
        .floating p {
          display: table-cell;
          vertical-align: middle;
          text-align: center;
        }
      }

      .pagination {
        text-align: center;
        padding: 4px 0;
      }
    }

    .tweets {
      float: right;
      width: 600px;
      min-height: 220px;

      .tweets-body();
    }

    .tweets-mobile {
      width: 100%;
      min-height: 220px;

      .tweets-body();
    }

    :deep(.current) {
      color: rgb(29, 161, 242);
    }
    :deep(.normal) {
      color: black;
    }
    :deep(.fixed-header) {
      position: fixed;
      top: 0;
      width: 600px;
      z-index: 999;
    }
    :deep(.fixed-header-mobile) {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 999;
    }
    :deep(.fixed-footer) {
      position: fixed;
      bottom: 0;
      z-index: 999;
      border: 1px solid #eee;
      background-color: #f7f7f7ee;
    }
    :deep(.ant-drawer-header) {
      padding: 11px 10px;
    }
    :deep(.ant-drawer-body) {
      padding: 10px;
    }
    :deep(.ant-divider-horizontal.ant-divider-with-text-center) {
      margin: 5px 0;
    }
  }
}
</style>
