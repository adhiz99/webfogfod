require("dotenv").config({ path: '.env.local' });

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet")
const cors = require("cors")
const config = require("config")

const errorHandler = require("./utils/errorHandler");
const handler = require("./utils/handler");

const routers = require("./routers");
const cluster = require("cluster")
const os = require("os");

const app = express();
const port = process.env.PORT;

require("./utils/logger");

if (process.env.NODE_ENV === "production") {
	app.set('trust proxy', 1)
}

app.use(cors({
	credentials: true,
	origin: []
}))

app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, _, next) => {
	req.tz = req.headers["x-timezone"] || config.get("defaultTimezone")
	next()
})

app.use("/api", routers)

app.disable('x-powered-by');
app.disable('server');

app.get("/", handler((_) => {
	return {
		message: "Health Check Success",
		code: 200,
		data: {
			uptime: process.uptime(),
			date: new Date().toString()
		}
	}
}));

app.use(errorHandler)

const CPUS = os.cpus().length

process.env.UV_THREADPOOL_SIZE = CPUS * 2; // set thread worker

if (cluster.isPrimary && !process.env.LOCAL) { //for production only
	for (let i = 0; i < CPUS; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker) => {
		console.log(`Worker pid: ${worker.process.pid} died`);
		cluster.fork();
	});
} else {
	app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
}


process.on('SIGINT', function() { process.exit(0) }); // close node js on proccess