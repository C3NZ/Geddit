const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    createdAt: {type: Date},
    updatedAt: {type: Date},
    password: {type: String, select:false},
    username: {type: String, required: true}
});

//Pre save hook for updating and creating the user
UserSchema.pre('save', function(next) {
    const user = this; 
    const now = new Date();
     
    //update the updated at and created at if it doesn't exist
    user.updatedAt = now;
    if(!user.createdAt) {
        user.createdAt = now;
    }

    //check if the user has modified their password
    if(!user.isModified('password')) {
        return next(); 
    }

    //if so, hash the new password and store it in the database
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            return next();
        })
    }) 

});

//method for comparing passwords to one already in the database
UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    })
}

module.exports = mongoose.model('User', UserSchema);
