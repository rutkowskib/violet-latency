require('dotenv').config();
import axios from 'axios';
import {setTimeout} from 'timers/promises';
import {faker} from '@faker-js/faker';

let token: string;
const skuId = [38611, 38612, 38610];

const axiosInstance = axios.create({
  baseURL: 'https://sandbox-api.violet.io/v1',
  headers: {
    'X-Violet-App-Secret': process.env.VIOLET_SECRET!,
    'X-Violet-App-Id': process.env.VIOLET_APP_ID!,
    'Content-Type': 'application/json',
  },
});

const times: number[] = [];

const run = async () => {
  await getToken();
  console.log('acquired token');
  for (let i = 0; i < 100; i++) {
    try {
      const beginTime = Date.now();
      await createCart();
      const endTime = Date.now();
      const time = endTime - beginTime;
      console.log(time);
      times.push(time);
    } catch (e) {
      console.log(e);
    }
    await setTimeout(10000);
  }
  console.log(`Average: ${times.reduce((a, b) => a + b, 0) / times.length}`);
}

const getToken = async () => {
  const loginRes = await axiosInstance
    .post('/login',
      {
        username: process.env.VIOLET_USERNAME,
        password: process.env.VIOLET_PASSWORD,
      },
    );
  token = loginRes.data.token;
}

const createCart = async () => {
  const cartRes = await axiosInstance
    .post('/checkout/cart', {
      "skus": [
        {
          "sku_id": faker.helpers.arrayElement(skuId),
          "quantity": 1
        }
      ],
      "customer": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "j.doe@email.com",
        "billing_address": {
          "city": "London",
          "state": "ENG",
          "country": "GB",
          "postal_code": "e32xf",
          "first_name": "Stefano",
          "last_name": "C",
          "address_1": "41 Tilt Ave",
          "name": "aa"
        },
        "shipping_address": {
          "city": "London",
          "state": "ENG",
          "country": "GB",
          "postal_code": "e32xf",
          "first_name": "Stefano",
          "last_name": "C",
          "address_1": "41 Tilt Ave",
          "name": "aa"
        }
      }
    }, {
      headers: {
        'X-Violet-Token': token,
      }
    });
}

run()
  .then(() => console.log('finished'))
  .catch((e) => console.log(e))
