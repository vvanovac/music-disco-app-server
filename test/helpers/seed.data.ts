import { DIFFICULTIES_ENUM, INSTRUMENT_ENUM, MUSIC_NOTES_ENUM, OCTAVE_ENUM } from '../../src/common/constants';

export const users = (excludePassword = true) =>
  [
    {
      username: 'test-user0',
      password: 'password0',
      hash:
        'b5ce3c4e57bd1fbf40c510a3a27879e9d633348896a6d79f0ea77a3d6325d46cb256e584703066367cafab61f09eae1ba04c58c67ef0193ef4f53ca9a07ec6b7',
      salt:
        '+Rat93rJWatk9pRogYKLpzOXc9oIeA+6XWAmJk8jZyJGkDHehflj3ZMcyybiHxoqdj7gUBR+FAT5Y0YeKwf1hiA2IpwXdN0CSBm4j1JK1WGM52PjX2PKd80qrfNKEMXUk0qPVpgax7nX7JzUPC0ycI0KZKlGHm0ykFvL4vV3ggA=',
      email: 'test-user0@some.thing',
      isAdmin: false,
    },
    {
      username: 'admin0',
      password: 'admin000',
      hash:
        '6878716517ac62fdda21664a06a7445040387e6da0d9e20c8be644c72866f5bdd69a597093455ab2984652a6a6ac492273aedd5251d034e1b4f17ec2cbc6f679',
      salt:
        '+Rat93rJWatk9pRogYKLpzOXc9oIeA+6XWAmJk8jZyJGkDHehflj3ZMcyybiHxoqdj7gUBR+FAT5Y0YeKwf1hiA2IpwXdN0CSBm4j1JK1WGM52PjX2PKd80qrfNKEMXUk0qPVpgax7nX7JzUPC0ycI0KZKlGHm0ykFvL4vV3ggA=',
      email: 'admin0@some.thing',
      isAdmin: true,
    },
  ].map(({ password, hash, salt, ...user }) => {
    if (excludePassword) {
      return { ...user, hash, salt };
    }
    return { ...user, password };
  });

export const tasks = () => [
  {
    title: 'test 1',
    subtitle: 'test 1',
    description: 'test 1',
    musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
    octave: OCTAVE_ENUM.FOUR,
  },
  {
    title: 'test 2',
    subtitle: 'test 2',
    description: 'test 2',
    musicNotes: [MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
    octave: OCTAVE_ENUM.FOUR,
  },
];

export const lessons = () => [
  {
    title: 'test 1',
    description: 'test 1',
    listOfTasks: [1, 2, 3],
    difficulty: DIFFICULTIES_ENUM.BEGINNER,
    courses: 1,
  },
  {
    title: 'test 2',
    description: 'test 2',
    listOfTasks: [4, 5, 6],
    difficulty: DIFFICULTIES_ENUM.AMATEUR,
    courses: 2,
  },
];
export const courses = () => [
  {
    title: 'test 1',
    description: 'test 1',
    instrument: INSTRUMENT_ENUM.PIANO,
  },
  {
    title: 'test 2',
    description: 'test 2',
    instrument: INSTRUMENT_ENUM.PIANO,
  },
];
