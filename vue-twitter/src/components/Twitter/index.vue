<template>
  <div class="twitter">
    <div v-if="Object.keys(detail).length > 0" class="content">
      <div v-if="!isAll" class="profile">
        <div ref="banner" class="banner">
          <img
            class="fit-contain"
            :src="changeToCFImg(detail.profile.banner)"
          />
          <a-avatar
            class="avatar"
            :size="avatarSize"
            :src="changeToBigAvatar(detail.profile.avatar)"
          />
        </div>
        <div class="name">
          <div style="font-size: 19px; font-weight: 800; border: 0 solid black">
            {{ detail.profile.name }}
          </div>
          <div
            style="
              color: rgb(91, 112, 131);
              font-size: 15px;
              font-weight: 400;
              border: 0 solid black;
            "
          >
            {{ '@' + detail.profile.username }}
          </div>
        </div>
        <div class="biography">
          {{ detail.profile.biography }}
        </div>
        <div class="follow">
          <span style="font-weight: 700; color: rgb(15, 20, 25)">
            {{ detail.profile.followingcount }}
          </span>
          <span style="color: rgb(91, 112, 131); margin-right: 20px">
            正在关注</span
          >
          <span style="font-weight: 700; color: rgb(15, 20, 25)">
            {{ detail.profile.followerscount }}
          </span>
          <span style="color: rgb(91, 112, 131); margin-right: 20px">
            关注者</span
          >
        </div>
        <div class="link-top" />
      </div>
      <div class="tweets">
        <div v-for="(tweet, i) in detail.Tweets" :key="i">
          <card
            v-if="isAll && usersObj"
            :tweet="
              margeDetail(tweet, {
                avatar: usersObj[tweet.username].userinfo.avatar,
                name: usersObj[tweet.username].userinfo.name,
              })
            "
            :isMobile="isMobile"
            @imgClick="imageClick"
          />
          <card
            v-else
            :tweet="margeDetail(tweet, detail.profile)"
            :isMobile="isMobile"
            @imgClick="imageClick"
          />
        </div>
      </div>
      <div style="font-size: 12px; text-align: center; padding: 5px">
        <a v-if="!endPage">
          <span v-if="!loadingMore" @click="loadMore"> 点击加载更多 </span>
          <LoadingOutlined v-else />
        </a>
        <span v-else style="color: #aba8b1">已经到底了</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import Card from './card.vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
const imgDomain = process.env.VUE_APP_CF_WORKERS_IMG_DOMAIN

export default {
  name: 'Twitter',
  components: { Card, LoadingOutlined },
  props: {
    idName: {
      type: String,
      default: 'twitter',
    },
    detail: {
      type: Object,
      default() {
        return {}
      },
    },
    isAll: {
      type: Boolean,
      default: false,
    },
    usersObj: {
      type: Object,
      default() {
        return {}
      },
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    endPage: {
      type: Boolean,
      default: false,
    },
    loadingMore: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const banner = ref(null)
    const bannerWidth = ref(0)
    const avatarSize = ref(0)
    watch(banner, () => {
      if (banner.value) {
        bannerWidth.value = banner.value.clientWidth
        avatarSize.value = ((bannerWidth.value / 3) * 0.35 - 4) * 2
      }
    })

    return {
      avatarSize,
      banner,
    }
  },
  methods: {
    changeToCFImg(src) {
      return imgDomain + src
    },
    changeToBigAvatar(src) {
      const reg = new RegExp('_normal.')
      src = src.replace(reg, '_200x200.')
      return imgDomain + src
    },
    margeDetail(tweet, profile) {
      return { avatar: profile.avatar, name: profile.name, ...tweet }
    },
    loadMore() {
      this.$emit('loadMore')
    },
    imageClick(imgSrc) {
      this.$emit('imgClick', imgSrc)
    },
  },
}
</script>

<style lang="less" scoped>
.twitter {
  margin-bottom: 15px;
  color: rgba(0, 0, 0, 1);

  .content {
    border: 1px solid #eee;
    border-top: none;
    overflow: hidden;
    text-align: left;
    font-size: 15px;

    .profile {
      .banner {
        position: relative;
        .fit-contain {
          width: 100%;
          object-fit: cover;
        }
        .avatar {
          position: absolute;
          top: 65%;
          right: 0;
          bottom: 0;
          left: 70%;
          border: 4px solid;
          border-radius: 9999px;
        }
      }
      .name {
        padding: 10px 10px;
      }
      .biography {
        padding: 0 10px;
      }
      .follow {
        padding: 10px 10px;
      }
      .link-top {
        width: 100%;
        height: 1px;
        border-top: solid #eee 1px;
      }
    }
  }
}
</style>
