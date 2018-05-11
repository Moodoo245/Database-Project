const envs = process.env

module.exports = {
	user: envs.PGUSER || 'postgres',
	host: envs.PGHOST || 'localhost',
	database: envs.PGDATABASE || 'clipsdb',
	password: envs.PGPASSWORD || 'donccnod',
	port: envs.PGPORT || 5432
};
