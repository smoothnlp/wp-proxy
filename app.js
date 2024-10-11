const express = require('express');
const toml = require('toml');

const fs = require('fs');
const config = toml.parse(fs.readFileSync('./config.toml', 'utf8'));

const port = config.port;
const host = config.host;
const router_prefix = config.router_prefix;
const mounted_host = config.mounted_host;
const target_host = config.target_host;
const wp_resource_routes = config.wp_resource_routes;
const wp_sitemap_route = config.wp_sitemap_route;
const custom_routes = config.custom_routes;
const replace_host_routes = config.replace_host_routes;

const replace_host_routes_regex = replace_host_routes.map(route => new RegExp(route));
const need_replace_host = (route) => {
  return replace_host_routes_regex.some(regex => regex.test(route));
}

const request = require("request-promise");
const wp_routes_proxy = async (req, res) => {
  const target_url = `${target_host}${req.originalUrl.replace(router_prefix === '/' ? '' : router_prefix, '')}`;
  console.log(`>>> fetch target url: ${target_url}, from ${req.originalUrl}`);

  try {
    let pageContent = await request(target_url);
    
    // 使用正则表达式替换链接，但排除 CSS 和 JS 文件
    const linkRegex = new RegExp(`(href|src)=["'](${target_host}[^"']*?)["']`, 'g');
    pageContent = pageContent.replace(linkRegex, (match, attr, url) => {
      if (url.includes('.css') || url.includes('.js')) {
        return match; // 不替换 CSS 和 JS 文件的链接
      }
      return `${attr}="${url.replace(target_host, `${mounted_host}${router_prefix === '/' ? '' : router_prefix}`)}"`;
    });

    res.send(pageContent);
  } catch (error) {
    console.error(`Error fetching target url: ${error.message}`);
    res.status(404).send('Not Found');
  }
};

const wp_sitemap_proxy = async (req, res) => {
    // if not sitemap xml, then proxy to wp_routes
    if (!req.originalUrl.endsWith('xml')) return wp_routes_proxy(req, res);

    if (req.originalUrl.endsWith(`${wp_sitemap_route}/index.xml`)) {
      // list sitemap files
    const target_url = `${target_host}/sitemap_index.xml`;
    console.log(`>>> list sitemap files: ${target_url}`);
    try {
      const sitemapContent = await request(target_url);
      const updatedSitemapContent = sitemapContent.replaceAll(target_host, `${mounted_host}${router_prefix === '/' ? '' : router_prefix}${wp_sitemap_route}`);
      res.send(updatedSitemapContent);
    } catch (error) {
      console.error(`Error fetching sitemap: ${error.message}`);
      res.status(500).send('Error fetching sitemap');
    }

    return;
  }

  // fetch sitemap
  const target_url = `${target_host}${req.originalUrl.replace(router_prefix === '/' ? '' : router_prefix, '').replace(wp_sitemap_route, '')}`;
  console.log(`>>> fetch sitemap: ${target_url}`);
  try {
    const sitemapContent = await request(target_url);
    const updatedSitemapContent = sitemapContent.replaceAll(target_host, `${mounted_host}${router_prefix === '/' ? '' : router_prefix}`);
    res.send(updatedSitemapContent);
  } catch (error) {
    console.error(`Error fetching sitemap: ${error.message}`);
    res.status(500).send('Error fetching sitemap');
  }
  return;
};

const router = express.Router();
router.get('/heartbeat', (req, res) => {
  res.send('ok');
});


// add wp_routes
router.use(wp_resource_routes, wp_routes_proxy);

// add wp_sitemap_route
router.use(wp_sitemap_route, wp_sitemap_proxy);

// add custom_routes
router.use(custom_routes, wp_routes_proxy);

const app = express();
app.use(router_prefix, router);
app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});