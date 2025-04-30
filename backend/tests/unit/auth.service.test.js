const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const { createAccount, login } = require('../../services/auth.service');

const expect = chai.expect;

describe('Auth Service - Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createAccount', () => {
    it('should throw an error if user already exists', async () => {
      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com' });

      try {
        await createAccount({ fullName: 'Test', email: 'test@example.com', password: '123456' });
      } catch (err) {
        expect(err.message).to.equal('User already exists');
      }
    });

    it('should create a user and return token', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'hash').resolves('hashedpass');
      const fakeUser = { _id: '123', fullName: 'Test', email: 'test@example.com' };
      sinon.stub(User, 'create').resolves(fakeUser);
      sinon.stub(jwt, 'sign').returns('fake-jwt-token');

      const result = await createAccount({ fullName: 'Test', email: 'test@example.com', password: '123456' });

      expect(result).to.have.property('user');
      expect(result).to.have.property('token', 'fake-jwt-token');
      expect(result.user.email).to.equal('test@example.com');
    });
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await login({ email: 'test@example.com', password: '123456' });
      } catch (err) {
        expect(err.message).to.equal('User not found');
      }
    });

    it('should throw an error if password does not match', async () => {
      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com', password: 'hashedpass' });
      sinon.stub(bcrypt, 'compare').resolves(false);

      try {
        await login({ email: 'test@example.com', password: 'wrongpass' });
      } catch (err) {
        expect(err.message).to.equal('Invalid credentials');
      }
    });

    it('should return user and token on successful login', async () => {
      const fakeUser = { _id: '123', email: 'test@example.com', password: 'hashedpass' };
      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('valid-jwt-token');

      const result = await login({ email: 'test@example.com', password: '123456' });

      expect(result).to.have.property('user');
      expect(result).to.have.property('token', 'valid-jwt-token');
      expect(result.user.email).to.equal('test@example.com');
    });
  });
});
