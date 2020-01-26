const source = `
<body>
  <ons-splitter>
    <!-- The side menu -->
    <ons-splitter-side id="menu" collapse width="220px">
      <ons-page>
        <ons-list-title><!--@{title}-->Available</ons-list-title>
        <ons-list>
          <!--@!each schedule in schedules-->
          <ons-list-header><!--@{dateTime}-->Jan 20, 2020</ons-list-header>
          <!--@!case schedule.playables and schedule.playbales.length > 0-->
          <!--@!each playable, index in schedule.playables-->
          <!--@!bind onclick=loadPage("playable.page")-->
          <ons-list-item onclick="loadPage('playables.html')">
            <div class="left">
              <img class="list-item__thumbnail" src="https://placekitten.com/g/40/40">
            </div>
            <div class="center">
              <span class="list-item__title">Gladiator</span><span class="list-item__subtitle">Championship</span>
            </div>
          </ons-list-item>
          <!--/@!each-->
          <!--@!case else expression-->

          <!--@!case else-->
          <!--@!slot fallback -->
          <!--/@!case-->
          <!--@!dump-->
          <ons-list-item onclick="loadPage('summary.html')">
            <div class="left">
              <img class="list-item__thumbnail" src="https://placekitten.com/g/40/40">
            </div>
            <div class="center">
              <span class="list-item__title">Manual Push</span><span class="list-item__subtitle">Training Ground </span>
            </div>
          </ons-list-item>
          <!--/@!dump-->
          <!--/@!each-->
        </ons-list>
      </ons-page>
      <!--/@!playables-->
    </ons-splitter-side>

    <!-- Everything not in the side menu -->
    <ons-splitter-content>
      <ons-navigator id="navigator" page="login.html"></ons-navigator>
    </ons-splitter-content>
  </ons-splitter>

  <script>
    const loadPage = (page) => {
      document.querySelector('#menu').close();
      document.querySelector('#navigator').bringPageTop(page, { animation: 'fade' });
    };
  </script>
</body>
`;

const simple = `<ons-list-header><!--@{dateTime}-->Jan 20, 2020</ons-list-header>
<!--@!case schedule.playables and schedule.playbales.length > 0-->
<!--@!each playable, index in schedule.playables-->
<!--@!bind onclick=loadPage(playable.page)-->`

module.exports = {source, simple}