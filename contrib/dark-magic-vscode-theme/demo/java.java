OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\"user\":{\"external_id\":\"56780\",\"email\":\"hana@supportbee.com\",\"first_name\":\"Hana\",\"last_name\":\"Mohan\",\"custom_attributes\":{\"plan\":\"enterprise\",\"pricing_version\":\"v10\",\"preferred_pronoun\":\"She\"},\"phone_numbers\":[\"+15005550001\"]}}");
Request request = new Request.Builder()
  .url("https://api.magicbell.com/users")
  .post(body)
  .addHeader("X-MAGICBELL-API-KEY", "[MAGICBELL_API_KEY]")
  .addHeader("X-MAGICBELL-API-SECRET", "[MAGICBELL_API_SECRET]")
  .build();

Response response = client.newCall(request).execute();
