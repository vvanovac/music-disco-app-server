export const users = (excludePassword = true) =>
  [
    {
      username: 'test-user0',
      password: 'password1',
      hash:
        'eb4a2cffdcdf0ef1572f89f0c8241015cfcb2c6cf5df673c947859f93649e295affd3ea110c5adf1e40110a5020cb728945c42705a225a374d537b9c4eb7318b',
      salt:
        '5NtAo18bswVbQFnur5dMYTQERTsqv01YjmCmoeaZ3DtK02yQh0qkpkd4gbf8t8loxQvcajSwPftPtInoTwquIfhMLmDlBfMObsetJ8vr51iccWHKpP5MwCLh/zsegPIv6gJ4hs97WApHLSFX2YTEMJ3aduLFTocXWiR1d1TMeuM=',
      email: 'test-user0@some.thing',
      isAdmin: false,
    },
    {
      username: 'admin0',
      password: 'admin123',
      hash:
        'f0eb905d24c3fe547ee64db1c80f39f767bc76829474451ddbe27ab46eb271bd0e49a154aee4dcae1b1cc77d907324e5a27f14007e970a67f6db92c9394c39db',
      salt:
        'wlqechrijgUk9e4A30ePhEG4gpBKHrAFp/tuhFA45HO8AON4S/DitaJw81Y/H6yB+vZl/BwBBhnraU7gPNOG9qK/Pqj34yJfnBGVsrQekyiYBKNnj8oCiM7+OwGQZpuVFdqMwkEZfxxrr5IMGP2bRio4bnQHWCW6RrDe8mXDew0=',
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
    imageURL: 'image-url.test',
  },
  {
    title: 'test 2',
    subtitle: 'test 2',
    description: 'test 2',
    imageURL: 'image-url.test',
  },
];
