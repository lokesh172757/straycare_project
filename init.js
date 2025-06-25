//connect with database
const mongoose = require("mongoose");
main().then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/straycare");
}
// requiring models
const collections = require("./schemas");

const sample = new collections.User({
    name: "lokesh",
    phone: "9548172757",
    email: "lokeshthakur8954@gmail.com",
    password: "Lokesh@2588",
    role: "admin",
    preferredLang: "english",
    phoneOtp: "000",
    bio: "hi",
    address: "aligarh",
    location: {
        type: "Point",
        coordinates: [77.1025, 28.7041] // Delhi [lng, lat]
    }
});

// sample.save().then((data) => {
//     console.log(data);
// });

const sampleReport = new collections.Report({
    user: '685a93c8981621d5ce365f16',
    description: "cat is injured",
    photoUrl: "abc",
    location: { type: "Point", coordinates: [77.1025, 28.7041] },// Delhi [lng, lat]
    status: "pending"

});
// sampleReport.save().then((data) => {
//     console.log(data);
// });
const sampleVolunteer = new collections.Volunteer({
    user: '685a93c8981621d5ce365f16', // reference to an existing user _id
    availability: "Weekends",
    areaOfService: "Delhi NCR",
    skills: ["Animal Care", "First Aid"],
    approved: true,
    type: "individual",
    active: true,
    rescuedAnimalsCount: 3,
    lastActive: new Date()
});

sampleVolunteer.save().then(console.log).catch(console.error);

const sampleAnimal = new collections.RescuedAnimal({
    name: "Tommy",
    age: 2,
    breed: "Indian Pariah",
    gender: "male",
    healthStatus: "Injured - recovering",
    vaccinated: false,
    rescueReport: '685a93c8981621d5ce365f18', // replace with a real report _id
    ngo: '685a93c8981621d5ce365f19', // replace with a real NGO _id
    media: ["https://example.com/image.jpg"]
});

sampleAnimal.save().then(console.log).catch(console.error);


const sampleAdoption = new collections.Adoption({
    rescuedAnimal: '685a93c8981621d5ce365f1a', // replace with a real rescued animal _id
    animalName: "Tommy",
    species: "dog",
    age: "2 years",
    healthStatus: "Healthy",
    description: "Friendly and active dog",
    imageUrl: "https://example.com/image.jpg",
    ngo: '685a93c8981621d5ce365f19', // replace with a real NGO _id
    adopted: true,
    adoptedBy: '685a93c8981621d5ce365f16' // replace with a real user _id
});

sampleAdoption.save().then(console.log).catch(console.error);


const sampleDonation = new collections.Donation({
    donorId: '685a93c8981621d5ce365f16',
    ngoId: '685a93c8981621d5ce365f19',
    amount: 1500,
    message: "Keep up the good work!",
    donationDate: new Date(),
    receiptUrl: "https://example.com/receipt.pdf"
});

sampleDonation.save().then(console.log).catch(console.error);


const sampleStore = new collections.PetStore({
    storeName: "Happy Paws",
    ownerName: "Rohit Sharma",
    contactNumber: "9876543210",
    email: "happypaws@example.com",
    address: {
        street: "MG Road",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001"
    },
    category: "pet food",
    website: "https://happypaws.com",
    location: {
        type: "Point",
        coordinates: [77.2090, 28.6139]
    },
    imageUrl: "https://example.com/store.jpg",
    isSponsor: true,
    verified: true
});

sampleStore.save().then(console.log).catch(console.error);


const sampleNgo = new collections.NGO({
    ngoName: "Paw Protectors",
    registrationNumber: "REG123456",
    registrationDocUrl: "https://example.com/doc.pdf",
    contactPerson: "Priya Singh",
    contactEmail: "pawprotectors@example.com",
    contactPhone: "9123456789",
    address: {
        street: "Sector 22",
        city: "Noida",
        state: "UP",
        pincode: "201301"
    },
    serviceAreas: ["Delhi", "Noida", "Ghaziabad"],
    facilities: {
        shelterCapacity: 50,
        inHouseVets: 2,
        ambulances: 3
    },
    website: "https://pawprotectors.org",
    logoUrl: "https://example.com/logo.png",
    verified: true,
    joinedAt: new Date(),
    lastActive: new Date()
});

sampleNgo.save().then(console.log).catch(console.error);
