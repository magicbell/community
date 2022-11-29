package main

import (
	"fmt"
	"strings"
	"net/http"
	"io/ioutil"
)

func main() {

	url := "https://api.magicbell.com/users"

	payload := strings.NewReader("{\"user\":{\"external_id\":\"56780\",\"email\":\"hana@supportbee.com\",\"first_name\":\"Hana\",\"last_name\":\"Mohan\",\"custom_attributes\":{\"plan\":\"enterprise\",\"pricing_version\":\"v10\",\"preferred_pronoun\":\"She\"},\"phone_numbers\":[\"+15005550001\"]}}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("X-MAGICBELL-API-KEY", "[MAGICBELL_API_KEY]")
	req.Header.Add("X-MAGICBELL-API-SECRET", "[MAGICBELL_API_SECRET]")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
