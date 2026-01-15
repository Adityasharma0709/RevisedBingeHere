export const seatMock = [
  {
    category: "VIP",
    price: 500,
    rows: [
      {
        row: "J",
        seats: [1,2,3,4,5,6,7,8,9,10,11],
        booked: [6,7]   // already booked
      }
    ]
  },

  {
    category: "PREMIUM",
    price: 240,
    rows: [
      {
        row: "I",
        seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        booked: [9,10]
      },
      {
        row: "H",
        seats: [1,2,3,4,5,6,7,8,9,10],
        booked: [4,5]
      }
    ]
  },

  {
    category: "EXECUTIVE",
    price: 220,
    rows: [
      {
        row: "D",
        seats: [1,2,3,4,5,6,7,8,9,10,11,12],
        booked: [11]
      }
    ]
  }
];
