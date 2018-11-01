import page from 'page';

const route = function route(path) {
  page(path);
};

const router = {
  initialize: app => {
    page('/', () => {
      app.getSequence('gotoHome')();
    });
    page('/login', () => {
      app.getSequence('gotoLogIn')();
    });
    page('/file-a-petition', () => {
      app.getSequence('gotoFilePetition')();
    });
    page('/style-guide', () => {
      app.getSequence('gotoStyleGuide')();
    });
    page.start();
  },
};

export { route, router };
