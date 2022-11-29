import Foundation

let headers = [
  "X-MAGICBELL-API-KEY": "[MAGICBELL_API_KEY]",
  "X-MAGICBELL-API-SECRET": "[MAGICBELL_API_SECRET]"
]
let parameters = ["user": [
    "external_id": "56780",
    "email": "hana@supportbee.com",
    "first_name": "Hana",
    "last_name": "Mohan",
    "custom_attributes": [
      "plan": "enterprise",
      "pricing_version": "v10",
      "preferred_pronoun": "She"
    ],
    "phone_numbers": ["+15005550001"]
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.magicbell.com/users")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
