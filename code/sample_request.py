import requests
import factory

# this file demonstrates a sample request to the server when its running.
# the factory will generate data with the format: {"latitude":14.7157, "longitude":95.2437}
r = requests.post("http://127.0.0.1:5002/patients", data=factory.gen_fake_location())
print(r.text)
print(r)
