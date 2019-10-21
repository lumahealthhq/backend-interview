from faker import Faker
import random

fake = Faker()

# generate a fake patient for unit testing
def gen_fake_patient():
    patient = {
        "id": fake.uuid4(),
        "name": fake.name(),
        "location": {
            "latitude": float(fake.latitude()),
            "longitude": float(fake.longitude()),
        },
        "age": random.randint(21, 90),
        "acceptedOffers": random.randint(0, 100),
        "canceledOffers": random.randint(0, 100),
        "averageReplyTime": random.randint(1, 3600),
    }
    return patient


# generate fake location for unit testing and sample requests
def gen_fake_location():
    return {"latitude": float(fake.latitude()), "longitude": float(fake.longitude())}
