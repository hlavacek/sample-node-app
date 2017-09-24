import { version } from '../../package.json';
import { Router } from 'express';
import books from './books';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/books', books({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
