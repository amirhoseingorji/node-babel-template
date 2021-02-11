//********************************************************************************************************* configs
import config from './config.js';
//frameworks
import express from 'express';
import http from 'http';
import socket_io from 'socket.io';
//usages
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
//middlewares
import Api_Loader from './middleware/Api_loader.js';
import Model_loader from './middleware/Model_loader.js';
import Logger from './middleware/logger.mjs';
//orm
import Sequelize from 'sequelize';
import redis from 'redis';
//********************************************************************************************************* constants
var { fn, Op, DataTypes } = Sequelize,
	{
		base_path,
		model_path,
		uploadOptions,
		corsOptions,
		ormOptions,
		authOptions,
		socketOptions,
		port,
		connection,
		api_variables,
		api_info,
		api_auth,
		login_auth,
	} = config,
	{ user, password, database } = connection,
	app = express(),
	server = http.createServer(app),
	redisclient = redis.createClient(),
	io = socket_io(server, socketOptions),
	logger = new Logger({
		console: false,
		all: '../../logs/all.log',
		error: '../../logs/error.log',
	}),
	sequelize = new Sequelize(database, user, password, {
		...ormOptions,
		logging: (msg) => logger.debug(msg),
	});

//********************************************************************************************************* initialize
server.listen(port, async () => {
	console.log('server  start normally');
	app.use(
		cookieParser(),
		bodyParser.urlencoded({ extended: true }),
		bodyParser.json(),
		cors(corsOptions),
		fileUpload(uploadOptions),
	);
	global.db = await new Model_loader().init({
		model_path,
		sequelize,
		DataTypes,
		fn,
		sync: false,
	});
	//to do manage shared
	await new Api_Loader().init({
		base_path,
		app,
		io,
		shared: {
			Op,
			fn,
			redisclient,
			...authOptions,
			api_variables,
			api_info,
			api_auth,
			login_auth,
		},
	});
});
