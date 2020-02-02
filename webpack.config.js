const path = require('path');
const PACKAGE_INFO = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const fs = require('fs');
const HWPTemplateMain = `./src/app/html/pages`;

module.exports = [
    (_env, argv) => {
        const pagesFiles = fs.readdirSync('./src/app/html/pages').filter((filename) => !/\.gitkeep/g.test(filename));
        let directoryList = pagesFiles.filter((file) => !file.includes('.html'));
        let generalPageList = pagesFiles.filter((file) => file.includes('.html'));
        let nestedHtmlPages = [];
        let oneLevelHtmlPages = [];

        directoryList.map((dirName) => {

            let dirObj = {
                name: dirName,
                url: '',
                children: []
            };

            let dirHtmlPages = fs.readdirSync(`./src/app/html/pages/${dirName}`);

            dirHtmlPages.map((htmlPage) => {
                let page = {
                    name: htmlPage.substring(0, htmlPage.lastIndexOf('.')),
                    url: dirName + '/' + htmlPage,
                    template: HWPTemplateMain + '/' + dirName + '/' + htmlPage
                };

                oneLevelHtmlPages.push(page);

                dirObj.children.push(page);
            });

            nestedHtmlPages.push(dirObj);

        });

        generalPageList.map((generalHtmlPage) => {
            let page = {
                name: generalHtmlPage.substring(0, generalHtmlPage.lastIndexOf('.')),
                url: generalHtmlPage,
                children: [],
                template: HWPTemplateMain + '/' + generalHtmlPage
            };

            oneLevelHtmlPages.push(page);

            nestedHtmlPages.push(page);

        });

        return {
            entry: {
                app: './src/app/app.js',
                bundle: './src/app/bundle.js'
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'assets/js/[name].js'
            },
            module: {
                rules: [
                    {
                        test: /\.(html)$/,
                        loader: 'html-loader',
                        options: {
                            interpolate: true
                        }
                    },
                    {
                        test: /\.(ttf|otf|eot|woff|woff2)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '../font/[name].[ext]',
                                }
                            }
                        ]
                    },
                    {
                        test: /^ic-.+\.svg$/,
                        use: [
                            {
                                loader: 'svg-sprite-loader',
                                options: {
                                    extract: true,
                                    spriteFilename: 'icons.svg'
                                }
                            },
                            "svgo-loader",
                        ]
                    },
                    {
                        test: /\.(gif|png|jpe?g|svg)$/i,
                        exclude: /(\/icons)/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '../assets/image/[name].[ext]'
                                }
                            }
                        ],
                    },
                    {
                        test: /\.(mov|mp4)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '../assets/video/[name].[ext]',
                                }
                            }
                        ],
                    },
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {presets: ['@babel/preset-env']}
                        }
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader
                            },
                            {
                                loader: 'css-loader'
                            },
                            {
                                loader: 'sass-loader'
                            },
                        ]
                    }
                ]
            },
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            output: {
                                comments: false,
                            },
                        }
                    }),
                    new OptimizeCSSAssetsPlugin()
                ]
            },
            plugins: [
                new CleanWebpackPlugin('dist', {verbose: true}),
                new MiniCssExtractPlugin({
                    filename: "./assets/css/style.css",
                }),
                new CopyWebpackPlugin([
                    {from: './src/app/font/**/*', to: './assets/font', ignore: ['.gitkeep'], flatten: true},
                    {from: './src/app/image/**/*', to: './assets/image', ignore: ['.gitkeep'], flatten: true},
                    {from: './src/app/temp/**/*', to: './assets/temp', ignore: ['.gitkeep'], flatten: true}
                ]),
                new HtmlWebpackPlugin({
                    year: new Date().getFullYear(),
                    mode: argv.mode,
                    inject: false,
                    version: PACKAGE_INFO.version,
                    projectName: PACKAGE_INFO.project,
                    filename: 'index.html',
                    files: nestedHtmlPages,
                    template: `./src/app/html/index.ejs`,
                }),

                ...oneLevelHtmlPages.map(file => {
                    return new HtmlWebpackPlugin({
                        filename: file.url,
                        inject: 'head',
                        template: file.template
                    })
                }),

                new SVGSpritemapPlugin(path.join(__dirname, 'src/app/image/icons/**/*.svg'), {
                    output: {
                        svgo: true,
                        filename: 'assets/image/icons.svg',
                    },
                    sprite: {
                        prefix: 'ic-'
                    }
                })
            ],
            devServer: {
                contentBase: path.join(__dirname, 'dist'),
                compress: true,
                port: 3000,
                hot: true
            }
        }
    }
]