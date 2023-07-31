import mongoose from 'mongoose';
import Train from './model/train.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seats = [];
let number = 1;
for (let row = 1; row <= 12; row++) {
  let numSeatsInRow = row === 12 ? 3 : 7;
  for (let seat = 1; seat <= numSeatsInRow; seat++) {
    seats.push({
      number,
      row,
      isBooked: false,
    });
    number++;
  }
}


const numBookedSeats = Math.floor(Math.random() * 3) + 6;


for (let i = 0; i < numBookedSeats; i++) {
  const randomIndex = Math.floor(Math.random() * seats.length);
  seats[randomIndex].isBooked = true;
}

const coach = {
  seats,
};

const train = new Train({
  coach,
});


const deleteData = async () => {
  try {
    await Train.deleteMany({});
    console.log('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data', err);
  }
};


deleteData().then(async () => {
  try {
    await train.save();
    console.log('Train data seeded successfully');
  } catch (err) {
    console.error('Error seeding train data', err);
  } finally {
    mongoose.disconnect();
  }
});
