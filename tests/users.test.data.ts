export const createdUser = {
  username: 'Alice',
  age: 33,
  hobbies: ['Golf', 'Swimming'],
};

export const updatedUser = {
  username: 'Lora',
  age: 34,
  hobbies: ['Golf'],
};

export const invalidUsersCase = [
  {
    should: 'with empty body',
    body: {},
  },
  {
    should: 'without property name',
    body: {
      age: 33,
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'without property age',
    body: {
      name: 'Sarah',
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'without property hobbies',
    body: {
      name: 'Sarah',
      age: 33,
    },
  },
  {
    should: 'with invalid property name',
    body: {
      name: 123,
      age: 33,
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'with invalid property age',
    body: {
      name: 'Sarah',
      age: 'Sarah',
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'with invalid property hobbies',
    body: {
      name: 'Sarah',
      age: 33,
      hobbies: 'Golf',
    },
  },
  {
    should: 'with empty property name',
    body: {
      name: '',
      age: 33,
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'with empty property age',
    body: {
      name: 'Sarah',
      age: null,
      hobbies: ['Golf', 'Swimming'],
    },
  },
  {
    should: 'with empty property hobbies',
    body: {
      name: 'Sarah',
      age: '',
      hobbies: null,
    },
  },
  {
    should: 'with property hobbies not strings in massive',
    body: {
      name: 'Sarah',
      age: '',
      hobbies: ['Golf', 'Swimming', undefined, 1],
    },
  },
];
