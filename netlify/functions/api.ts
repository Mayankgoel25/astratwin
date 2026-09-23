import serverless from 'serverless-http';
import { app } from '../../server/app';

// Export serverless handler for Netlify Functions
export const handler = serverless(app);
