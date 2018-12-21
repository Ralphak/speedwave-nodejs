/*
Instruções: 
https://developers.getnet.com.br/checkout#section/Checkout-Iframe/Como-implementar
https://www.npmjs.com/package/client-oauth2
*/

var ClientOAuth2 = require('client-oauth2')
 
var getnetAuth = new ClientOAuth2({
  clientId: '954abe35-111a-469a-81b2-e240d95783de',
  clientSecret: '1af61261-8b21-499a-aed2-4a81b55e2be6',
  accessTokenUri: 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token',
  scopes: ['oob']
})

module.exports = getnetAuth;