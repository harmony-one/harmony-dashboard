import Vue from 'vue'
import FontAwesomeBrands from '@fortawesome/fontawesome-free-brands'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faSearch,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'
import { faClock, faCopy } from '@fortawesome/free-regular-svg-icons';

library.add(
  FontAwesomeBrands,
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faSearch,
  faUserFriends,
  faClock,
  faCopy
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
