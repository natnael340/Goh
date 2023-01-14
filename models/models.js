const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const db = {
  init: () => {
    const user = sequelize.define("User", {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^[0-9a-z]{3,32}$/g,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g,
        },
      },
      profile: {
        type: DataTypes.STRING,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g,
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          is: /^[0-9\+]{10,20}$/g,
        },
      },
      role: {
        type: DataTypes.ENUM("tenant", "landlord", "admin"),
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
    const verficationCode = sequelize.define("VerficationCode", {
      code: {
        type: DataTypes.STRING,
      },
      issuedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
      type: {
        type: DataTypes.ENUM("email", "password", "mfa"),
      },
    });
    const documents = sequelize.define("Documents", {
      idCard: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      message: {
        type: DataTypes.STRING,
      },
    });
    const address = sequelize.define("Address", {
      title: {
        type: DataTypes.ENUM("Home", "Work"),
      },
      country: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      streetAddress: {
        type: DataTypes.STRING,
      },
      gpsLoc: {
        type: DataTypes.STRING,
      },
    });
    const houses = sequelize.define("Houses", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9\ ]{0,64}$/g,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9\ ]{0,255}$/g,
        },
      },
      location: {
        type: DataTypes.STRING,
      },
      locationType: {
        type: DataTypes.ENUM("map", "raw"),
      },
      size: {
        type: DataTypes.STRING,
      },
      rooms: {
        type: DataTypes.INTEGER,
      },
      bedRooms: {
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.ENUM(
          "Apartment",
          "Condominium",
          "Shared Area",
          "Standalone"
        ),
      },
      contactName: {
        type: DataTypes.STRING,
      },
      contactEmail: {
        type: DataTypes.STRING,
      },
      contactPhoneNumber: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("available", "occupied", "pending"),
      },
      rent: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });
    const blockedUser = sequelize.define("BlockedUser", {
      blockedFrom: {
        type: DataTypes.DATE,
      },
      blockedTo: {
        type: DataTypes.DATE,
      },
    });
    const userLogin = sequelize.define("UserLogin", {
      email: {
        type: DataTypes.STRING,
        validate: {
          is: /^[<>]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      logintrial: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      loginBlockedTime: {
        type: DataTypes.DATE,
      },
    });
    const favHouse = sequelize.define("FavouriteHouse");
    const housePhotos = sequelize.define("HousePhotos", {
      order: {
        type: DataTypes.INTEGER,
      },
      fileName: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM("main", "default"),
        defaultValue: "default",
      },
    });
    const comments = sequelize.define("Comments", {
      comments: {
        type: DataTypes.STRING,
        validate: {
          is: /^((?![<>]).)*$/gm,
        },
      },
    });

    const tour = sequelize.define("Tour", {
      tourDate: {
        type: DataTypes.DATE,
      },
      comment: {
        type: DataTypes.STRING,
        validate: {
          is: /^((?![<>]).)*$/gm,
        },
      },
    });
    const checkout = sequelize.define("Checkout");
    const booking = sequelize.define("Booking");

    user.hasOne(documents);
    documents.belongsTo(user);

    user.hasMany(address);
    address.belongsTo(user);

    user.hasMany(favHouse);
    favHouse.belongsTo(user);
    houses.hasMany(favHouse);
    favHouse.belongsTo(houses);

    user.hasOne(blockedUser);
    blockedUser.belongsTo(user);

    user.hasOne(userLogin);
    userLogin.belongsTo(user);

    user.hasOne(verficationCode);
    verficationCode.belongsTo(user);

    user.hasMany(houses);
    houses.belongsTo(user);

    houses.hasMany(housePhotos);
    housePhotos.belongsTo(houses);

    user.hasMany(comments);
    comments.belongsTo(user);
    houses.hasMany(comments);
    comments.belongsTo(houses);

    user.hasMany(tour);
    tour.belongsTo(user);
    houses.hasMany(tour);
    tour.belongsTo(houses);

    user.hasMany(checkout);
    checkout.belongsTo(user);
    houses.hasMany(checkout);
    checkout.belongsTo(houses);

    user.hasMany(booking);
    booking.belongsTo(user);
    houses.hasMany(booking);
    booking.belongsTo(houses);

    sequelize.sync();

    return { user, houses, userLogin, blockedUser, favHouse, verficationCode };
  },
};

module.exports = db;
