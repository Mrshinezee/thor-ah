
export default {

  facebookAuth: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
  },

  googleAuth: {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  }
};
