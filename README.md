# Backend Interview

## **Introduction**
I'm San Mônico (san@monico.com.br), yet another ECMAScript and Bash developer, a lover of ArchLinux and hater of Microsoft,
a crazy ignorant and a dropZ-dj0nt headbanger.


## **Summary**
-   [Purpose](#purpose)
-   [Requirements](#requirements)
-   [Environment Variables](#environent-variables)
-   [Project Quirks and Tips](#project-quirks-and-tips)
-   [Assessment](#assessment)


## **Purpose**
This project is the API server and DB manager for a generic service provider for Game Developers. It provides backend services
like storage, leaderboard and achievements for games that can be configured in a panel (another project that depends on this)
by the game developers.  
This project provides these services so game developers can focus in the game work while delegating their backend part to this
out-of-shelf service.


## **Requirements**
-   GNU/Linux v5.6.13 environment (this is not supposed to run on Windows platforms at all)
-   Bash v5.0.16
-   NodeJS v14.2.0 (it will not run on lower than 13.2.0)
-   NPM v6.14.5


## **ENVIRONMENT VARIABLES**
Below is a list environment variables this project loads. You can set it in multiple ways. In local development
it's suggested to use `export`, but in production environment one should add these variables in a file that is
loaded by Systemd service manager
-   **DATABASE**:
    -   **DB_PATH**: JSON database file path to load the patients data. Defaults to `sample-data/patients.json`. _the project also contains another DB for testing purposes in `sample-data/patients_2.json`_
-   **API SERVICE**:
    -   **SERVER_API_PORT**: Server API port to listen. Defaults to `21000`
    -   **DEFAULT_LIMIT**: Default value for `limit` when requesting lists of items. Defaults to `10`
    -   **DEFAULT_MAX_LIMIT**: Default maximum value for `limit` when requesting lists of items. Defaults to `1000`
    -   **API_HEADER_NAME**: Server API header name for identifying the Server API version. Defaults to `X-Luma-Assessment-Version`
    -   **API_HEADER_VALUE**: Server API header value for identifying the Server API version. This value should follow SemVer. Defaults to `0.0.1`
-   **PROCESS**:
    -   **PROCESS_WORKERS_COUNT**: Number of worker processes to use in cluster, not including the master process which is only a worker manager. Setting this to a non-zero integer number `n` will force the the master process to create `n` processes independently of the number of CPU threads available. Using the prefix `upto-` will consider the number of CPU threads and will not create more than the number of CPU threads available. Setting this value to `all` will create a number of worker processes to match the number of CPU threads available. Examples: `4`, `8`, `12`, `upto-4`, `upto-12`, `all`. Defaults to `upto-4`
    -   **NODE_ENV**: Conventional environment variable to check if application is running in production environment. Set to `production` so external modules can run with better performance. Unset by default
    -   **NODE_CLUSTER_SCHED_POLICY**: Cluster scheduling policy. Valid values are `rr` (round-robin policy managed by Node) and `none` (let the operating system decide). If it is unset, Node will use the `rr` in Linux operating system. Unset by default
    -   **CLUSTER_LOG**: Will print console logs with _info level_ which worker of the cluster is taking care of the request whether the value is set to `true` or `false`. Defaults to `true`


## **PROJECT QUIRKS AND TIPS**
-   **ESLint**: This project integrates with [ESLint](https://eslint.org/) in order to enforce coding rules and styles
-   **Mocha and Chai**: This project integrates with [Mocha](https://mochajs.org/) for test automation and [Chai](https://www.chaijs.com/) for assertion
-   **Health Routes**: This project contains 2 _health check_ routes
    -   `/health/api` returns HTTP `204` if is online. This is good if you run this project in multiple backends behind a single proxy (like a load balancer) and you need to check if the backend still available
    -   `/health/status` returns server information, like memory usage, number of CPUs, OS etc
-   **Cluster**: This project is recommended to be executed as a cluster by running `server/cluster.js` script. However, for those using tools that can not support multiple threads for clustering, there is the `server/index.js` script. Without the cluster, it creates just one worker process
    -   **Cluster Master process**: The cluster process has a master process and it doesn't listen to connections nor access the database. It only manages the other worker processes
    -   **Cluster Worker processes**: The cluster process must have at least 1 worker process in order to listen to connection and access database as the master process isn't designed for this


## **ASSESSMENT VALIDATION**
Open the server and execute a GET to `/patient/?sort=score&sortDirection=DESC`. This route follows the RESTful standards