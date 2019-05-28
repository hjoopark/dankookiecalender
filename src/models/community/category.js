import { store } from '@/store/index.js'

export default {
  list: [
    {
      name: '공지사항',
      class: 'notice',
      enableAnonymous: false,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'ADMIN',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/40/8D8D8D/advertising.png',
      color: '#aaaaaa',
      sub: [
        {
          name: '단쿠키',
          class: 'dankookie',
          color: '#cc8e40'
        },
        {
          name: '단국대',
          class: 'dku',
          color: '#3292f9'
        }
      ]
    },
    {
      name: '19학번',
      class: 'freshman',
      enableAnonymous: false,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'LOGIN',
      requiredAuthToCommentPost: 'LOGIN',
      color: '#75C392'
    },
    {
      name: '자유',
      class: 'free',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/40/8D8D8D/weixing.png',
      color: '#FDA913',
      sub: [
        {
          name: '죽전',
          class: 'jukjeon',
          color: '#a783ec'
        },
        {
          name: '천안',
          class: 'cheonan',
          color: '#9e4545'
        },
        {
          name: '정보',
          class: 'information',
          color: 'rgb(78, 192, 212)'
        },
        {
          name: '유머',
          class: 'humor',
          color: 'cadetblue'
        }
      ]
    },
    {
      name: '리뷰/인증',
      class: 'review',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/dusk/40/8D8D8D/good-quality.png',
      color: '#00b5ad',
      sub: [
        {
          name: '음식리뷰',
          class: 'food',
          color: '#8385f8'
        },
        {
          name: '인증',
          class: 'attestation',
          color: '#800080'
        }
      ]
    },
    {
      name: '연애상담',
      class: 'love',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/40/8D8D8D/novel.png',
      color: '#f279ae',
      sub: [
        {
          name: '늑대에게',
          class: 'wolf',
          color: 'black'
        },
        {
          name: '여우에게',
          class: 'fox',
          color: 'pink'
        },
        {
          name: '19금',
          class: 'adult',
          color: 'red'
        }
      ]
    },
    {
      name: '취업/알바',
      class: 'job',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/40/8D8D8D/resume.png',
      color: '#4183c4',
      sub: [
        {
          name: '채용공고',
          class: 'recruit',
          color: '#525252'
        },
        {
          name: '알바',
          class: 'parttime',
          color: '#00b318'
        },
        {
          name: '대외활동',
          class: 'activities',
          color: 'rgb(116, 191, 247)'
        },
        {
          name: '스터디 모집',
          class: 'study',
          color: 'rgb(55, 205, 224)'
        },
        {
          name: '취업수기',
          class: 'job-story',
          color: 'rgb(219, 129, 255)'
        },
        {
          name: '합격수기',
          class: 'pass-story',
          color: 'rgb(191, 162, 50)'
        }
      ]
    },
    {
      name: '홍보/대자보',
      class: 'ad',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/dusk/40/8D8D8D/billboard.png',
      color: '#f2711c',
      sub: [
        {
          name: '홍보',
          class: 'advertisement',
          color: '#606E0D'
        },
        {
          name: '대자보',
          class: 'post',
          color: '#0000FF'
        }
      ]
    },
    {
      name: '중고장터',
      class: 'market',
      enableAnonymous: true,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/80/8D8D8D/sell-stock.png',
      color: '#ae79f2',
      sub: [
        {
          name: '팝니다',
          class: 'sell',
          color: '#00E1FF'
        },
        {
          name: '삽니다',
          class: 'buy',
          color: '#815C5C'
        }
      ]
    },
    {
      name: '정치/사회',
      class: 'politics',
      enableAnonymous: false,
      requiredAuthToList: 'NONE',
      requiredAuthToPost: 'USER',
      requiredAuthToCommentPost: 'USER',
      img: 'https://png.icons8.com/office/40/8D8D8D/elections.png',
      color: '#3f4346',
      sub: [
        {
          name: '사회이슈',
          class: 'society',
          color: '#FFA500'
        },
        {
          name: '토론',
          class: 'debate',
          color: '#00FFFF'
        },
        {
          name: '정치',
          class: 'politics',
          color: 'red'
        }
      ]
    },
    {
      name: '졸업생라운지',
      class: 'graduate',
      enableAnonymous: true,
      requiredAuthToList: 'GRADUATE',
      requiredAuthToPost: 'GRADUATE',
      requiredAuthToCommentPost: 'GRADUATE',
      color: '#CEC117'
    }
  ],

  getCategory (name) {
    return this.list.find(e => e.name === name)
  },

  getSubCategory (name, subName) {
    const category = this.getCategory(name)
    if (!category) return ''

    const subCategory = category.sub.find(e => e.name === subName)
    if (!subCategory) return ''

    return subCategory
  },

  isAbleAnonymous (name) {
    const category = this.getCategory(name)
    if (!category) return false
    return category.enableAnonymous
  },

  authToCommentPost (name) {
    const category = this.getCategory(name)
    if (!category) return false
    return category.requiredAuthToCommentPost
  },

  colorOfCategory (name) {
    const category = this.getCategory(name)
    if (!category) return ''
    return category.color
  },

  colorOfSubCategory (name, subName) {
    const subCategory = this.getSubCategory(name, subName)
    if (!subCategory) return
    return subCategory.color
  },

  postCategoryEnum () {
    return this.list
      .filter(e => store.getters.hasAuth(e.requiredAuthToPost))
      .map(e => {
        return {
          label: e.name,
          value: e.name
        }
      })
  },

  postSubCategoryEnum (categoryName) {
    if (!categoryName) return []
    const category = this.getCategory(categoryName)
    if (!category.sub) return []

    return category.sub
      .filter(e => {
        var auth = e.requiredAuthToPost || category.requiredAuthToPost
        return store.getters.hasAuth(auth)
      })
      .map(e => {
        return {
          label: e.name,
          value: e.name
        }
      })
  }
}
