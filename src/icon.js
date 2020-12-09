import Vue from 'vue'
import FontAwesomeBrands from '@fortawesome/fontawesome-free-brands'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faSearch,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  FontAwesomeBrands,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faSearch,
  faUserFriends
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
