<template>
  <div class="home-page page">
    <header class="navbar-fixed-top" :class="{ opaque: navbarOpaque }">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/">Harmony</router-link>
          <button class="btn navbar-toggle" @click="toggleMenu">
            <div class="icon-container">
              <div class="icon-burger" :class="{ active: !menuOpen }">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </div>
              <div class="icon-cross" :class="{ active: menuOpen }">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </div>
            </div>
          </button>
          <div class="navbar-collapse collapse" :class="{ show: menuOpen }">
            <div class="navbar-nav" @click="onMenuSelected">
              <a href="#" v-scroll-to="'#whitepaper'">Whitepaper</a>
              <a href="#" v-scroll-to="'#roadmap'">Roadmap</a>
              <a href="#" v-scroll-to="'#team'">Team</a>
              <a href="#" v-scroll-to="'#partners'">Partners</a>
              <a href="#" v-scroll-to="'#contact-us'">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="home-hero-container">
      <div class="home-hero">
        <div class="container">
          <h1 class="animated fadeInUp">Join Harmony</h1>
          <h2 class="animated fadeInUp">Open consensus for 10B</h2>
          <router-link to="/dashboard">
            <a class="animated fadeInUp btn btn-primary btn-wide">Dashboard</a>
          </router-link>
        </div>
      </div>
    </div>

    <section class="whitepaper" id="whitepaper">
      <div class="container">
        <div class="features flex-horizontal">
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Eternal</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Transparent</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Accessible</div>
            <div class="description">bla bla bla bla</div>
          </div>
        </div>
        <button class="btn btn-primary btn-wide">Whitepaper</button>
      </div>
    </section>

    <section class="whitepaper" id="roadmap">
      <div class="container">
        <div class="features flex-horizontal">
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Eternal</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Transparent</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Accessible</div>
            <div class="description">bla bla bla bla</div>
          </div>
        </div>
        <button class="btn btn-primary btn-wide">Whitepaper</button>
      </div>
    </section>

    <section class="whitepaper" id="team">
      <div class="container">
        <div class="features flex-horizontal">
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Eternal</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Transparent</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Accessible</div>
            <div class="description">bla bla bla bla</div>
          </div>
        </div>
        <button class="btn btn-primary btn-wide">Whitepaper</button>
      </div>
    </section>

    <section class="whitepaper" id="partners">
      <div class="container">
        <div class="features flex-horizontal">
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Eternal</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Transparent</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Accessible</div>
            <div class="description">bla bla bla bla</div>
          </div>
        </div>
        <button class="btn btn-primary btn-wide">Whitepaper</button>
      </div>
    </section>

    <section class="whitepaper" id="contact-us">
      <div class="container">
        <div class="features flex-horizontal">
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Eternal</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Transparent</div>
            <div class="description">bla bla bla bla</div>
          </div>
          <div class="item flex-grow">
            <div class="icon"></div>
            <div class="title">Accessible</div>
            <div class="description">bla bla bla bla</div>
          </div>
        </div>
        <button class="btn btn-primary btn-wide">Whitepaper</button>
      </div>
    </section>

    <footer>

      <div class="community container">
        <a href="#">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'twitter']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'telegram']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
      </div>
      <div class="links container">
        <a href="">Terms of Use</a>
        |
        <a href="">Privacy Policy</a>
      </div>
      <div class="copyright container">
        Copyright © 2018 harmony | All rights reserved
      </div>
    </footer>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import VueScrollTo from "vue-scrollto";
export default {
  name: "HomePage",
  data() {
    return {
      navbarOpaque: false,
      menuOpen: false
    };
  },
  mounted() {
    document.addEventListener("scroll", this.onScroll, true);
  },
  methods: {
    onScroll(e) {
      let scrollTop = Math.max(
        document.documentElement.scrollTop, // For chrome
        document.body.scrollTop // For ios
      );
      this.navbarOpaque = scrollTop > 10;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    onMenuSelected() {
      this.menuOpen = !this.menuOpen;
    }
  },
  components: {
    FontAwesomeIcon
  }
};
</script>

<style scoped lang="less">
@import "../less/common.less";

.home-hero {
  width: 100%;
  height: 500px;
  background-image: url("../assets/home-bg-new.jpg");
  background-size: cover;
  background-position: bottom center;

  color: var(--bright-text-color);

  > .container {
    padding-top: 10em;
    padding-left: @space-xl;
    padding-right: @space-xl;
    h1,
    h2 {
      font-weight: normal;
    }
    h1 {
      font-size: 3em;
      margin-bottom: @space-sm;
    }

    h2 {
      font-size: 1.5em;
      margin-bottom: @space-md;
    }
  }
}

footer {
  padding-bottom: @space-lg;
  background: linear-gradient(0deg, #262627 0, #525254 100%);
  color: #a09ea7;
  .container {
    text-align: center;
    padding: @space-md 0;
  }
  .community {
    .svg-inline--fa {
      font-size: 1.5em;
      margin: 0.5em;
      cursor: pointer;
    }
  }

  a {
    transition: color @anim-duration @anim-easing;

    &:hover {
      color: var(--bright-text-color);
    }
  }

  .links {
    font-size: 0.8em;
  }

  .copyright {
    font-size: 0.6em;
    color: #868390;
  }
}

section.whitepaper {
  color: var(--primary-text-color);
  padding: 5em 0;
  text-align: center;
  .features {
    .item {
      .icon {
        margin: 0 auto 1em;
        width: 5em;
        height: 5em;
        background: url("../assets/logo.png");
        background-size: contain;
      }
      .title {
        font-size: 1.3em;
      }

      .description {
        margin-top: @space-md;
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
    }
  }

  .btn {
    margin-top: 2em;
  }
}

section:nth-child(even) {
  background-color: #f4f6f7;
}

.flex-horizontal {
  display: flex;
  flex-direction: row;
}

.flex-grow {
  flex: 1;
}
</style>
