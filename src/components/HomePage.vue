<template>
  <div class="home-page">
    <header class="navbar-fixed-top">
      <div class="container">
        <a class="navbar-brand" href="/">Engrave.ly</a>
        <div class="navbar-nav">
          <a href="">Whitepager</a>
          <a href="">Roadmap</a>
          <a href="">Team</a>
          <a href="">Partners/Investors</a>
          <a href="">Contact Us</a>
        </div>
      </div>
    </header>
    <div class="home-hero-container">
      <div class="home-hero">
        <div class="container">
          <h1 class="animated fadeInUp">Join Engrave.ly</h1>
          <h2 class="animated fadeInUp">Engrave everything on blockchain, eternally</h2>
          <a class="btn btn-primary">Demo</a>
        </div>
      </div>
    </div>

    <section class="whitepaper">
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

    <section class="whitepaper">
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

    <section class="whitepaper">
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
import "../../node_modules/animate.css/animate.css";
export default {
  name: "HomePage",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@space-xs: 0.25em;
@space-sm: 0.5em;
@space-md: 1em;
@space-lg: 1.5em;
@space-xl: 2em;
@space-xxl: 2.5em;

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

.navbar-fixed-top {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;
  top: 0;

  color: var(--bright-text-color);

  a {
    color: var(--bright-text-color);
    text-decoration: none;
  }

  .navbar-brand {
    padding: @space-sm @space-md;
    float: left;
  }

  .navbar-nav {
    float: right;

    a {
      display: inline-block;
      padding: @space-sm @space-md;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.btn {
  appearance: none;
  border: none;
  background-color: transparent;
  padding: @space-sm @space-md;

  &.btn-primary {
    background-color: var(--primary-button-background-color);
    color: var(--bright-text-color);
    &:hover {
      background-color: var(--primary-button-hover-background-color);
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
    padding-top: 8em;
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
    padding: @space-md @space-xxl;
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
