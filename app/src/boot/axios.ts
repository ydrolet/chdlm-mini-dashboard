import { client } from 'src/clients/chdlm/services.gen'

client.setConfig({
  baseURL: process.env.API,
});
