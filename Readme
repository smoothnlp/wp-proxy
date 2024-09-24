# wp-proxy

A simple proxy for wordpress, it can help you to redirect the wordpress resources to a different host, and it can also help you to serve the custom resources.

## Usage

1. Install the dependencies

```bash
yarn install
```

2. Config the `config.toml`, for more details, please refer to the [config](./config.example.toml)

3. Run the proxy

```bash
yarn serve
```

## Docker

1. Build the docker image

```bash
docker build -t wp-proxy .
```

2. Run the docker container

```bash
docker run -d -p 8088:8088 -v ./config.toml:/app/config.toml wp-proxy
``` 

## Docker Compose

config the `docker-compose.yml`, mount the config file, and run the docker compose

1. Run the docker compose

```bash
docker compose up -d
```

# Config & Route

## Sitemap Addr

The sitemap address is `{mounted_host}/{router_prefix}/wp_sitemap/index.xml`, you can use the `wp_sitemap_route` to change the sitemap address, the default sitemap address is `/wp_sitemap`.

## Custom Route

The custom route is the route that the proxy will forward requests to the target host, you can use the `custom_routes` to add the custom routes.

support the wildcard, for example:

```toml
custom_routes = [ 
    "/(fr|es|ja|de|pt|zh_hans|zh_hant|ko)?/?tool",
    "/(fr|es|ja|de|pt|zh_hans|zh_hant|ko)?/?blog",
    "/category" 
]
```

## Wp Resource Route

The wp resource route is the route that the proxy will forward requests to the target host, you can use the `wp_resource_routes` to add the wp resource route, the default wp resource route is `/wp-content`, `/wp-includes`.

Use the default wp resource route, and nothing else.

## Router Prefix

The router prefix is the prefix that the proxy will forward requests to the target host, you can use the `router_prefix` to add the router prefix, the default router prefix is `/`, if you want to use the sub path, you can change the router prefix, for example:

```toml
router_prefix = "/wp"
```

## Mounted Host
The mounted host is the host that the proxy will mount to, you can use the `mounted_host` to add the mounted host, the default mounted host is `https://mymap.ai`, if you want to use the sub path, you can change the mounted host, for example:

```toml
mounted_host = "https://mymap.ai/wp"
```

## Target Host
The target host is the host that the proxy will forward requests to the target host, you can use the `target_host` to add the target host, the default target host is `https://library.mymap.ai`, if you want to use the sub path, you can change the target host, for example:

```toml
target_host = "https://library.mymap.ai/wp"
```

