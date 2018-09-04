import jwt from 'jsonwebtoken';
import db from '../models';

const secretKey = process.env.SECRET;
const { User } = db;


/**
 * @class SocialAuthController
 */
class SocialAuthController {
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user
   * @param {function} done
   * @returns {object} createOrFindUser
   * @memberof SocialAuthController
   */
  static modelQuery(user, done) {
    /* eslint-disable no-console */
    console.log('user', user);
    User.findOrCreate({
      where: {
        email: user.email
      },
      defaults: user,
    }).spread((foundOrCreated, created) => {
      const {
        id, email, username, firstName, lastName, image
      } = foundOrCreated.dataValues;
      done(null, {
        email, id, username, firstName, lastName, image, created,
      });
    });
  }

  /**
    * @description response function
    * @static
    * @param {object} req
    * @param {object} res
    * @returns {json} json
    * @memberof SocialAuthController
  */
  static response(req, res) {
    const user = {
      email: req.user.email,
      username: req.user.username,
      lastName: req.user.lastName,
      firstName: req.user.firstName,
      image: req.user.image
    };
    if (req.user.created) {
      return res.status(201).send({ user });
    }
    return res.status(200).send({ user });
  }

  /**
   * @description - callback function for strategy
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   *
   * @returns {json} json
   *
   * @memberof SocialAuthController
   */
  static passportCallback(accessToken, refreshToken, profile, done) {
    console.log('\nprofile', profile);
    const userProfile = {
      firstname: profile.name.familyName,
      lastname: profile.name.givenName,
      username: profile.displayName,
      email: profile.emails[0].value,
      image: profile.photos[0].value
    };
    userProfile.token = jwt.sign({ userId: profile.id }, secretKey, { expiresIn: '24h' });
    SocialAuthController.modelQuery(userProfile, done);
  }
}
export default SocialAuthController;