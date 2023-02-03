// const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = (connection, Sequelize) => {
    const schema = {
        name: {
            type: Sequelize.STRING,
            allowNull: [false, 'Please tell us your name!']
        },
        email: {
            type: Sequelize.STRING,
            allowNull: [false, 'Please provide your email'],
            unique: {
                args: [true],
                msg: "Email is already exists"
            },
            validate: { isEmail: true }
        },
        photo: Sequelize.STRING,
        role: {
            type: Sequelize.STRING,
            enum: ['user', 'creator'],
            defaultValue: 'user'
        },
        password: {
            type: Sequelize.STRING,
            allowNull: [false, 'Please provide a password'],
            validate: {
                len: {
                    args: [8, 700],
                    msg: "Password must have minimum of 8 characters"
                },
            },
            select: false
        },
        passwordConfirm: {
            type: Sequelize.STRING,
            allowNull: [false, 'Please confirm your password'],
            validate: {
                // This only works on CREATE and SAVE!!!
                validator(el) {
                    if (el !== this.password) {
                        throw new Error('Passwords are not the same!');
                    }
                },
            },
            select: false
        },
        passwordChangedAt: Sequelize.DATE,
        passwordResetToken: Sequelize.STRING,
        passwordResetExpires: Sequelize.DATE,
    };

    const UserModel = connection.define("User", schema);

    UserModel.prototype.correctPassword = async function (candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };
    UserModel.prototype.prePasswordReset = function (next) {
        if (!this.isModified('password') || this.isNew) return next();

        this.passwordChangedAt = Date.now() - 1000;
        next();
    };
    UserModel.prototype.changedPasswordAfter = function (JWTTimestamp) {
        // console.log('ChangePassword', this.passwordChangedAt);
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt(
                this.passwordChangedAt.getTime() / 1000,
                10
            );

            return JWTTimestamp < changedTimestamp;
        }

        // False means NOT changed
        return false;
    };
    // UserModel.prototype.createPasswordResetToken = function () {
    //     const resetToken = crypto.randomBytes(32).toString('hex');

    //     this.passwordResetToken = crypto
    //         .createHash('sha256')
    //         .update(resetToken)
    //         .digest('hex');

    //     console.log({ resetToken }, this.passwordResetToken);

    //     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    //     return resetToken;
    // },
    return UserModel;
};


