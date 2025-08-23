export const templateCSS = `
* {
  box-sizing: border-box;
  font-family: Helvetica, serif;
}
body {
  margin: 0;
}
.header-banner {
  min-height: 100vh;
  width: 100%;
  padding-top: 35px;
  padding-bottom: 0;
  color: #ffffff;
  font-weight: 100;
  background-image: url("/images/background.png");
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  position: relative;
}
.container-width {
  width: 90%;
  max-width: 1150px;
  margin: 0 auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: auto;
}
.logo-container {
  flex: 0 0 auto;
}
.logo {
  padding: 10px 0;
  min-height: 30px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: #ffffff;
  font-size: 23px;
  font-weight: 600;
  width: auto;
}
.logo-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.logo-text {
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-decoration: none;
}
.menu {
  flex: 0 0 auto;
}
.menu-item {
  float: right;
  font-size: 15px;
  color: #eee;
  width: 130px;
  padding: 10px;
  min-height: 50px;
  text-align: center;
  line-height: 30px;
  font-weight: 400;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  cursor: pointer;
}
.menu-item:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
.menu-toggle {
  display: none;
  float: right;
  flex-direction: column;
  cursor: pointer;
  padding: 15px;
  margin-top: 5px;
}
.hamburger {
  width: 25px;
  height: 3px;
  background-color: #fff;
  margin: 3px 0;
  transition: 0.3s;
}
#menu-checkbox {
  display: none;
}
@media screen and (max-width: 768px) {
  .nav-header {
    flex-direction: row;
  }
  .menu {
    position: relative;
  }
  .menu-toggle {
    display: flex;
  }
  .menu-items {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: rgba(0, 0, 0, 0.9);
    min-width: 200px;
    border-radius: 5px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  .menu-item {
    float: none;
    width: 100%;
    text-align: left;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .menu-item:last-child {
    border-bottom: none;
  }
  #menu-checkbox:checked ~ .menu-items {
    display: block;
  }
  #menu-checkbox:checked ~ .menu-toggle .hamburger:nth-child(1) {
    transform: rotate(-45deg) translate(-6px, 6px);
  }
  #menu-checkbox:checked ~ .menu-toggle .hamburger:nth-child(2) {
    opacity: 0;
  }
  #menu-checkbox:checked ~ .menu-toggle .hamburger:nth-child(3) {
    transform: rotate(45deg) translate(-6px, -6px);
  }
}
@media screen and (max-width: 480px) {
  .lead-title {
    font-size: 28px;
    margin: 0 0 20px 0;
  }
  .sub-lead-title {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 20px;
  }
  .hero-title {
    padding: 30px 0;
  }
}
.hero-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  padding: 50px 0;
}
.lead-title {
  margin: 0 0 30px 0;
  font-size: 50px;
}
.sub-lead-title {
  max-width: 650px;
  line-height: 30px;
  margin-bottom: 30px;
  color: #c6c6c6;
}
.about-sect {
  padding-top: 100px;
  padding-bottom: 100px;
}
.about-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
.about-image {
  width: 500px;
  height: 500px;
}
.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.about-content {
  float: left;
  padding: 7px;
  width: 490px;
  color: #444;
  font-weight: 100;
  margin-top: 50px;
}
.about-pre {
  padding: 7px;
  color: #b1b1b1;
  font-size: 15px;
}
.about-title {
  padding: 7px;
  font-size: 25px;
  font-weight: 400;
}
.about-desc {
  padding: 7px;
  font-size: 17px;
  line-height: 25px;
}
.dvd-sect {
  background-color: #ff9c45;
  color: #fff;
  padding: 200px 0;
}
.dvd-container {
  max-width: 900px;
  text-align: center;
  margin: 0 auto;
}
#dvd-title {
  color: #fff;
  margin-bottom: 20px;
}
.dvd-desc {
  color: #fff;
  font-size: 1em;
  line-height: 30px;
}
.images-sect {
  background-color: #efefef;
  color: #fff;
  padding: 100px 0;
}
.flex-title {
  margin-bottom: 15px;
  font-size: 2em;
  text-align: center;
  font-weight: 700;
  color: #555;
  padding: 5px;
}
.flex-desc {
  margin-bottom: 55px;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 5px;
}
.cards {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.card {
  display: inline-block;
  margin: 10px;
  width: 300px;
  height: 300px;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.images-sect .card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card * {
  transition: all 0.35s ease;
}
.images-sect .card:hover img,
.section-3 .card.hover img {
  transform: scale(1.3) rotate(-3deg);
}
.bdg-sect {
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: #fafafa;
}
.bdg-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 55px;
  color: #555555;
}
.badges {
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.badge {
  width: 250px;
  margin-bottom: 30px;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.badge-avatar {
  width: 100px;
  height: 100px;
  border-radius: 100%;
}
.badge-body {
  margin-top: 5px;
}
.badge-name {
  font-size: 1.2em;
  margin-bottom: 5px;
}
.badge-role {
  color: #777;
  font-size: 0.9em;
}
.tstm-sect {
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: #ffbe17;
}
.tstm-title {
  color: #fff;
  font-size: 2em;
  font-weight: 700;
  margin-top: 30px;
}
.quote-text {
  font-style: italic;
  line-height: 25px;
  font-size: 1.2em;
}
.tstm-container {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 900px;
  text-align: center;
  gap: 50px;
}
.links-sect {
  padding-top: 100px;
  padding-bottom: 100px;
}
.links {
  padding: 20px 0;
  display: flex;
  justify-content: space-around;
  flex-flow: wrap;
}
.link {
  width: 250px;
  margin-bottom: 30px;
  padding: 15px;
}
.link-title {
  font-size: 1.4em;
  margin-bottom: 5px;
  color: #000;
  text-decoration: none;
}
.link-title:hover {
  text-decoration: underline;
}
.link-desc {
  font-size: 0.85rem;
  line-height: 17px;
}
.link-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.link-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  background-color: #eee;
  padding: 10px;
  text-decoration: none;
  border-radius: 5px;
  color: #1e1e1e;
  font-size: 0.8em;
  width: 100px;
  text-align: center;
  transition: all 0.2s ease;
}
.link-btn:hover {
  background-color: #ffbe17;
  color: #fff;
}
.link-btn:active {
  background-color: #ff9c45;
  color: #fff;
}
.copyright {
  background-color: #1e1e1e;
  color: #fff;
  padding: 1em 0;
  width: 100%;
  font-size: 0.75em;
}
.made-with {
  text-align: center;
  width: 100%;
  padding: 5px 0;
}
`;

export const templateHTML = `
  <body>
    <header class="header-banner">
      <div class="container-width">
        <div class="nav-header">
          <div class="logo-container">
            <div class="logo">
              <div class="logo-icon">
                <img src="/" alt="Logo" />
              </div>
              <a href="#" class="logo-text">MICROSITE</a>
            </div>
          </div>
          <nav class="menu">
            <input type="checkbox" id="menu-checkbox" />
            <label for="menu-checkbox" class="menu-toggle">
              <div class="hamburger"></div>
              <div class="hamburger"></div>
              <div class="hamburger"></div>
            </label>
            <div class="menu-items">
              <a href="#" class="menu-item">LINK 3</a>
              <a href="#" class="menu-item">LINK 2</a>
              <a href="#" class="menu-item">LINK 1</a>
            </div>
          </nav>
        </div>
        <div class="hero-title">
          <div class="lead-title">Ready to get started?</div>
          <div class="sub-lead-title">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
      </div>
    </header>

    <section class="about-sect">
      <div class="container-width">
        <div class="about-container">
          <div class="about-image">
            <img src="/" alt="About" />
          </div>
          <div class="about-content">
            <div class="about-pre">WHO ARE WE</div>
            <div class="about-title">About</div>
            <div class="about-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="dvd-sect">
      <div class="container-width">
        <div class="dvd-container">
          <div id="dvd-title" class="flex-title">
            Empowering Future IT Leaders Through Collaboration, Innovation, and
            Community
          </div>
          <div class="dvd-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            dapibus molestie eros. Ut posuere ut sem nec imperdiet. Ut efficitur
            nunc in lectus dignissim porttitor. Aenean sit amet iaculis justo.
            Nam iaculis, quam nec tempor condimentum, dui urna sollicitudin
            lorem, ac facilisis felis nibh eu nibh.
          </div>
        </div>
      </div>
    </section>

    <section class="images-sect">
      <div class="container-width">
        <div class="flex-title">Photo Showcase</div>
        <div class="flex-desc">
          Explore our vibrant moments and unforgettable events.
        </div>
        <div class="cards">
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
          <div class="card">
            <img src="/" alt="photo-showcase" />
          </div>
        </div>
      </div>
    </section>

    <section class="bdg-sect">
      <div class="container-width">
        <h1 class="bdg-title">The team</h1>
        <div class="badges">
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">Alex Galicio</div>
              <div class="badge-role">Developer</div>
            </div>
          </div>
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">Eddhan Tan</div>
              <div class="badge-role">Developer</div>
            </div>
          </div>
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">Ynez Sanchez</div>
              <div class="badge-role">Member</div>
            </div>
          </div>
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">Joshua Alcaraz</div>
              <div class="badge-role">Member</div>
            </div>
          </div>
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">Reyan Concepcion</div>
              <div class="badge-role">Member</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="tstm-sect">
      <div class="container-width">
        <div class="tstm-container">
          <div class="tstm-title">Testimonial</div>
          <div class="quote-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            dapibus molestie eros. Ut posuere ut sem nec imperdiet. Ut efficitur
            nunc in lectus dignissim porttitor.
          </div>
          <div class="badge">
            <img src="/" class="badge-avatar" alt="profile" />
            <div class="badge-body">
              <div class="badge-name">John Doe</div>
              <div>President</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="links-sect">
      <div class="container-width">
        <div class="flex-title">Feature that is amazing</div>
        <div class="flex-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>

        <div class="links">
          <div class="link">
            <a href="#" class="link-title">Link 1</a>
            <div class="link-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
          <div class="link">
            <a href="#" class="link-title">Link 2</a>
            <div class="link-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
          <div class="link">
            <a href="#" class="link-title">Link 3</a>
            <div class="link-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
          <div class="link">
            <a href="#" class="link-title">Link 4</a>
            <div class="link-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
        </div>

        <div class="link-wrapper">
          <a href="https://[yourDomain].alexgalicio.dev/links" class="link-btn">See More</a>
        </div>
      </div>
    </section>

    <footer class="copyright">
      <div class="container-width">
        <div class="made-with">© 2025, Microsite | ALL RIGHTS RESERVED</div>
      </div>
    </footer>
  </body>
`;
