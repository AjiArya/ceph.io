const fs = require('fs');

// Plugins
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const i18n = require('eleventy-plugin-i18n');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  console.log(process.env.NODE_ENV);

  // Hot-reload site on CSS changes
  eleventyConfig.addWatchTarget('src/css');

  // Collections
  const collectionsDir = `./src/_11ty/collections`;
  eleventyConfig.addCollection('primary', require(`${collectionsDir}/primary.js`));

  // Filters
  const filtersDir = `./src/_11ty/filters`;
  eleventyConfig.addFilter('articleType', require(`${filtersDir}/articleType.js`));
  eleventyConfig.addFilter('collectionIncludesTag', require(`${filtersDir}/collectionIncludesTag.js`));
  eleventyConfig.addFilter('collectionTags', require(`${filtersDir}/collectionTags.js`));
  eleventyConfig.addFilter('formatDate', require(`${filtersDir}/formatDate.js`));
  eleventyConfig.addFilter('formatDateRange', require(`${filtersDir}/formatDateRange.js`));
  eleventyConfig.addFilter('futureDate', require(`${filtersDir}/futureDate.js`));
  eleventyConfig.addFilter('limitItems', require(`${filtersDir}/limitItems.js`));
  eleventyConfig.addFilter('localeSelector', require(`${filtersDir}/localeSelector.js`));
  eleventyConfig.addFilter('pastDate', require(`${filtersDir}/pastDate.js`));
  eleventyConfig.addFilter('randomOrder', require(`${filtersDir}/randomOrder.js`));
  eleventyConfig.addFilter('removeHtml', require(`${filtersDir}/removeHtml.js`));
  eleventyConfig.addFilter('removeTagsFromArray', require(`${filtersDir}/removeTagsFromArray.js`));
  eleventyConfig.addFilter('squash', require(`${filtersDir}/squash.js`));
  eleventyConfig.addFilter('startsWith', require(`${filtersDir}/startsWith.js`));
  eleventyConfig.addFilter('techTalkDate', require(`${filtersDir}/techTalkDate.js`));
  eleventyConfig.addFilter('truncate', require(`${filtersDir}/truncate.js`));

  // Layout aliases — TBC if this is bringing enough benefit
  eleventyConfig.addLayoutAlias('base', 'layouts/_base.njk');
  eleventyConfig.addLayoutAlias('article', 'layouts/article.njk');
  eleventyConfig.addLayoutAlias('blog-post', 'layouts/blog-post.njk');
  eleventyConfig.addLayoutAlias('case-study', 'layouts/case-study.njk');
  eleventyConfig.addLayoutAlias('content', 'layouts/content.njk');
  eleventyConfig.addLayoutAlias('event', 'layouts/event.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('press-release', 'layouts/press-release.njk');
  eleventyConfig.addLayoutAlias('hub-community', 'layouts/hub-community.njk');
  eleventyConfig.addLayoutAlias('hub-developers', 'layouts/hub-developers.njk');
  eleventyConfig.addLayoutAlias('hub-discover', 'layouts/hub-discover.njk');
  eleventyConfig.addLayoutAlias('hub-foundation', 'layouts/hub-foundation.njk');
  eleventyConfig.addLayoutAlias('hub-news', 'layouts/hub-news.njk');
  eleventyConfig.addLayoutAlias('hub-solutions', 'layouts/hub-solutions.njk');
  eleventyConfig.addLayoutAlias('listing-blog-posts', 'layouts/listing-blog-posts.njk');
  eleventyConfig.addLayoutAlias('listing-blog-post-categories', 'layouts/listing-blog-post-categories.njk');
  eleventyConfig.addLayoutAlias('listing-blog-search', 'layouts/listing-blog-search.njk');
  eleventyConfig.addLayoutAlias('listing-case-studies', 'layouts/listing-case-studies.njk');
  eleventyConfig.addLayoutAlias('listing-case-study-categories', 'layouts/listing-case-study-categories.njk');
  eleventyConfig.addLayoutAlias('listing-events', 'layouts/listing-events.njk');
  eleventyConfig.addLayoutAlias('listing-event-categories', 'layouts/listing-event-categories.njk');
  eleventyConfig.addLayoutAlias('listing-planet-ceph-articles', 'layouts/listing-planet-ceph-articles.njk');
  eleventyConfig.addLayoutAlias('listing-press-releases', 'layouts/listing-press-releases.njk');
  eleventyConfig.addLayoutAlias('listing-press-release-categories', 'layouts/listing-press-release-categories.njk');

  // Shortcodes
  const shortcodesDir = `./src/_11ty/shortcodes`;

  // Transforms

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/js');

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en-GB',
    },
  });

  // Browsersync
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          // Dev mode redirect for root path to default language
          if (req.url === '/') {
            res.writeHead(302, {
              location: '/en-GB/',
            });
            res.end();
          }

          // 404 on --serve
          // https://www.11ty.dev/docs/quicktips/not-found/#with-serve
          const content_404 = fs.readFileSync('dist/404.html');
          res.write(content_404);
          res.writeHead(404);
          res.end();
        });
      },
    },
  });

  // Configuration
  eleventyConfig.setDataDeepMerge(true);
  // TBC if this is a bit heavy-handed
  // See https://www.11ty.dev/docs/data-deep-merge/

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
