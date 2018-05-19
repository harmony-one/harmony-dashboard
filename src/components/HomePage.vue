<template>
  <div class="home-page page" v-on:scroll="onScroll">
    <header class="navbar-fixed-top" :class="{ opaque: navbarOpaque }">
      <div class="container clearfix">
        <a class="navbar-brand" href="/">Engrave.ly</a>
        <div class="navbar-nav">
          <a href="#" v-scroll-to="'#whitepaper'">Whitepaper</a>
          <a href="#" v-scroll-to="'#roadmap'">Roadmap</a>
          <a href="#" v-scroll-to="'#team'">Team</a>
          <a href="#" v-scroll-to="'#partners'">Partners</a>
          <a href="#" v-scroll-to="'#contact-us'">Contact Us</a>
        </div>
      </div>
    </header>
    <div class="home-hero-container">
      <div class="home-hero">
        <div class="container">
          <h1 class="animated fadeInUp">Join Engrave.ly</h1>
          <h2 class="animated fadeInUp">Engrave everything on blockchain, eternally</h2>
          <a class="animated fadeInUp btn btn-primary btn-wide">Demo</a>
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
        <button class="btn btn-primary">Whitepaper</button>
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
        <button class="btn btn-primary">Whitepaper</button>
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
        <button class="btn btn-primary">Whitepaper</button>
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
        <button class="btn btn-primary">Whitepaper</button>
      </div>
    </section>

    <footer>

    </footer>
  </div>
</template>

<script>
import VueScrollTo from "vue-scrollto";
import "animate.css/animate.css";
export default {
  name: "HomePage",
  data() {
    return {
      navbarOpaque: false
    };
  },
  methods: {
    onScroll(e) {
      this.navbarOpaque = e.target.scrollTop > 10;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../less/common.less";

.navbar-fixed-top {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;
  top: 0;
  color: var(--bright-text-color);
  transition: background-color @anim-duration @anim-function,
    color @anim-duration @anim-function;

  &.opaque {
    background-color: #fff;
    color: var(--opaque-navbar-text-color);
    border-bottom: 1px solid #0a93eb;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .navbar-brand {
    padding: @space-lg @space-md;
    float: left;
  }

  .navbar-nav {
    float: right;

    a {
      display: inline-block;
      padding: @space-lg @space-md;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.home-hero {
  width: 100%;
  height: 500px;
  background-image: url("../assets/home-bg-new.webp");
  background-size: cover;
  background-position: bottom center;

  color: var(--bright-text-color);

  > .container {
    padding-top: 10em;
    h1,
    h2 {
      font-weight: normal;
    }
    h1 {
      font-size: 4em;
      margin-bottom: 0.5em;
    }
    h2 {
      font-size: 1.5em;
    }

    .btn {
      margin-top: @space-md;
    }
  }
}

footer {
  height: 10em;
  background: linear-gradient(0deg, #262627 0, #525254 100%);
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
