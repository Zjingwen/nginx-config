const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const WebpackRequireFrom = require('webpack-require-from');
const resolve = (dir) => path.join(__dirname, '.', dir);

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    filenameHashing: false, // Don't hash the output, so we can embed on the DigitalOcean Community
    productionSourceMap: false,
    devServer: {
        historyApiFallback: false, // Don't serve index.html for 404s in dev
    },
    configureWebpack: {
        node: false, // Disable Node.js polyfills (Buffer etc.) -- This will be default in Webpack 5
        plugins: [
            // Fix dynamic imports from CDN (inject as first entry point before any imports can happen)
            { apply: compiler => {
                compiler.options.entry.app.import.unshift(
                    path.join(__dirname, 'src', 'nginxconfig', 'build', 'webpack-dynamic-import.js'),
                );
            } },
            new WebpackRequireFrom({ methodName: '__webpackDynamicImportURL' }),
            // Analyze the bundle
            new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
            new DuplicatePackageCheckerPlugin(),
        ],
    },
    chainWebpack: config => {
        // Inject resolve-url-loader into the SCSS loader rules (to allow relative fonts in do-bulma to work)
        for (const rule of ['vue-modules', 'vue', 'normal-modules', 'normal']) {
            config.module.rule('scss')
                .oneOf(rule)
                .use('resolve-url-loader')
                .loader('resolve-url-loader')
                .before('sass-loader')
                .end()
                .use('sass-loader')
                .loader('sass-loader')
                .tap(options => ({ ...options, sourceMap: true }));
        }

        // 倒入html模版
        config.plugin('html').tap(options => {
            options[0].template = path.join(__dirname, 'index.html');
            return options;
        });

        config.resolve.alias
        .set('do-vue', resolve('do-vue')) 

    },
};
