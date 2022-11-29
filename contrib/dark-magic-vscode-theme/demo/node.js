const http = require("https");

const options = {
  "method": "POST",
  "hostname": "api.magicbell.com",
  "port": null,
  "path": "/users",
  "headers": {
    "X-MAGICBELL-API-KEY": "[MAGICBELL_API_KEY]",
    "X-MAGICBELL-API-SECRET": "[MAGICBELL_API_SECRET]"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({
  user: {
    external_id: '56780',
    email: 'hana@supportbee.com',
    first_name: 'Hana',
    last_name: 'Mohan',
    custom_attributes: {plan: 'enterprise', pricing_version: 'v10', preferred_pronoun: 'She'},
    phone_numbers: ['+15005550001']
  }
}));
req.end();
