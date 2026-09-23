import { faker } from '@faker-js/faker';

export interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
  houseNumber: string;
  phone: string;
}

export function createTestUser(): TestUser {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'xTest@1234',
    dob: '1995-01-01',
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: 'United States',
    countryCode: 'US',
    houseNumber: faker.location.buildingNumber(),
    phone: faker.string.numeric(10),
  };
}