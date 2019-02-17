const Koa = require('koa');
const KoaMount = require('koa-mount');
const KoaStatic = require('koa-static');
const pug = require('pug');
const path = require('path');

const viewsBaseDir = path.resolve(__dirname, 'views');
const publicBaseDir = path.resolve(__dirname, '..', 'public');
const assetsPublicUrl = '/assets';
const pugCompileOpts = {
  basedir: viewsBaseDir
};
const pathRoutes = {
  '/': {
    view: 'home',
    script: 'home',
    style: 'home',
  },
  '/about': {
    view: 'about',
    script: 'about',
    style: 'about',
  }
};

const app = new Koa();
app.use(KoaMount(assetsPublicUrl, KoaStatic(publicBaseDir)));

app.use(async (ctx) => {
  const pathRoute = pathRoutes[ctx.request.path];
  if (!pathRoute) {
    return;
  }

  const compileFn = pug.compileFile(
    path.join(viewsBaseDir, `${pathRoute.view}.pug`),
    pugCompileOpts,
  );

  ctx.body = compileFn({
    srcs: {
      scripts: [
        `${assetsPublicUrl}/entries/_root.js`,
        `${assetsPublicUrl}/entries/${pathRoute.script}.js`,
      ],
      styles: [
        `${assetsPublicUrl}/styles/_root.css`,
        `${assetsPublicUrl}/styles/${pathRoute.style}.css`,
      ],
    },
  });
});

app.listen(3000, () => {
  console.log('Server started on 3000 port');
});
