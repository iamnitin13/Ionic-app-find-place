import { PlaceLocation } from './offers/location.model';

export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation
  ) {}
}

// new Place(
//   'p1',
//   'British Residency, Lucknow',
//   'British Residency is a complex of buildings that once served as the residence of the British Resident General. Constructed in the last quarter of the 18th century, the place served home to over 3000 British residents during the Indian Rebellion of 1857. Currently, the Residency is in ruins and is a protected monument under the Archeological survey of India.',
//   'https://www.fabhotels.com/blog/wp-content/uploads/2019/03/1000x650-6.jpg',
//   57.25,
//   new Date('2022-01-01'),
//   new Date('2025-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   'Dilkusha Kothi, Lucknow',
//   'Located on the banks of the River Gomti, Dilkusha Kothi is the remains of a house that was built in the early 19th century. Built in the English baroque style of architecture, the building once served as the hunting lodge and summer resort of the Nawabs. Nothing much is left of the building today, except for the external walls, a few towers, and a beautiful garden. However, due to its historical significance and architectural grandeur, Dilkusha Kothi has earned a place in the list of Lucknow tourist places.',
//   'https://www.fabhotels.com/blog/wp-content/uploads/2019/03/Dilkusha-Kothi.jpg',
//   19,
//   new Date('2022-01-01'),
//   new Date('2025-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Husainabad Clock Tower, Lucknow',
//   'Located adjacent to the Rumi Darwaza, Husainabad Clock Tower is another heritage monument dotting the cityscape of Lucknow. Built in 1881 by the Hussainabad Trust at a cost of 1.75 lakhs, this 221-feet structure is modeled after the Big Ben Clock Tower of London. The clock is designed like a flower with 12 petals and its pendulum is 14 feet long.  Popular as the tallest clock tower in the country, it displays the Gothic and Victorian styles of architecture.',
//   'https://www.fabhotels.com/blog/wp-content/uploads/2019/03/Husainabad-Clock-Tower.jpg',
//   355,
//   new Date('2022-01-01'),
//   new Date('2025-12-31'),
//   'abc'
// )
