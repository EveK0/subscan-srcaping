import axios from "axios";
import fs from "fs";
const ADDRESS_URL = "https://crab.api.subscan.io/api/scan/evm/contract/list";
const CONTRACT_URL = "https://crab.api.subscan.io/api/scan/evm/contract";
let total_pages = [];
let count = 0;

const scraper = async () => {
  const headers = {
    "upgrade-insecure-requests": "1",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-ch-ua":
      '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-site": "none",
    "sec-fetch-mod": "",
    "sec-fetch-user": "?1",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "bg-BG,bg;q=0.9,en-US;q=0.8,en;q=0.7",
  };
  while (true) {
    let payload = {
      row: 25,
      page: count,
      order: "",
      order_field: "",
      verified: true,
      search: "",
    };
    let contract_payload = {};
    let res = await axios.post(ADDRESS_URL, payload, { headers: headers });
    let data = res.data.data.list;
    for (const addr in data) {
      contract_payload = { address: data[addr].address };
    }
    let res_contract = axios.post(CONTRACT_URL, contract_payload, {
      headers: headers,
    });
    let abi_data = JSON.stringify((await res_contract).data.data.abi);
    total_pages = total_pages.concat(res.data.data.list);
    if (res.data.data.count - total_pages.length > 0) {
      count++;
    } else {
      try {
        fs.writeFileSync("data.json", abi_data, {
          flag: "a+",
        });
        break;
      } catch (error) {
        console.log(error);
      }
    }
  }
};

Promise.resolve(scraper());
