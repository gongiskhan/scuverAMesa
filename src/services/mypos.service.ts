import {User} from "@src/models/user";
import {UIDGenerator} from "@src/utils/uid-generator";

export class MyposServiceClass {

  constructor(

  ) { }


  getAuthToken() {
    return new Promise(resolve => {
      const url  = `https://auth-api.mypos.com/oauth/token`;
      fetch(url, {method: 'POST', headers: {
          'Authorization': 'Basic RzBzMHRKNTBTZk83ZGNqNm4xTEgybWR1OmFyM1JYTWdRT1Y3cG5aUWxTZ1J0NktMS3VMWkNJc0Z0TW5wR2EwenZnaFFqeTZtaw==',
          'Content-Type': 'application/x-www-form-urlencoded'
        }, body: 'grant_type=client_credentials'}).then(tokenResponse => {
          tokenResponse.json().then(json => {
            resolve(json.access_token)
          });
      });
    });
  }

  getPaymentLink(token: string, user: User | null, orderId: string, amount: number) {
    return new Promise(resolve => {
      const url  = `https://transactions-api.mypos.com/v1.1/online-payments/link`;
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const body = {
        "item_name":"Carregamento Scuver",
        "item_price": amount,
        "pref_language": "PT",
        "currency": "EUR",
        "account_number": "",
        "custom_name": "Carregamento Scuver",
        "quantity": 1,
        // "website": "http://scuver.pt",
        "send_sms": false,
        "send_email": false,
        "ask_for_customer_name": false,
        "hide_quantity": true,
        "expired_date":`${now.getFullYear()}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
      };
      fetch(url, {method: 'POST', headers: {
          'Content-Type': 'application/json',
          'API-Key': 'G0s0tJ50SfO7dcj6n1LH2mdu',
          'X-Request-ID': UIDGenerator.generate(),
          'Authorization': `Bearer ${token}`
        }, body: JSON.stringify(body)}).then(response => {
          console.log('GET PAYMENT LINK RESPONSE', response);
          response.json().then(json => {
            resolve(json.url);
          });
      });
    });
  }
}

export const MyposService = new MyposServiceClass();
