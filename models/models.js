const { Sequelize, Op, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize("sqlite::memory:")

const db = {
  init: () => {
    const user = sequelize.define("User", {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^[0-9a-z]{3,32}$/g
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g
        }
      },
      profile: {
        type: DataTypes.STRING
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g
        }
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          is: /^[a-zA-Z]{4,32}$/g
        }
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      role: {
        type: DataTypes.ENUM("tenant", "landlord", "admin"),
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
    const documents = sequelize.define("Documents",{
      idCard: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      message: {
        type: DataTypes.STRING,
      }
    })
    const address = sequelize.define("Address", {
      title: {
        type: DataTypes.ENUM("Home", "Work")
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
      }
    })
    const houses = sequelize.define("Houses", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9\ ]{0,64}$/g
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z0-9\ ]{0,255}$/g
        }
      },
      location: {
        type: DataTypes.STRING,
      },
      locationType: {
        type: DataTypes.ENUM("map", "raw")
      },
      size: {
        type: DataTypes.STRING
      },
      rooms: {
        type: DataTypes.INTEGER,
      },
      bedRooms: {
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.ENUM("Apartment", "Condominium", "Shared Area", "Full Area"),
      },
      contactName: {
        type: DataTypes.STRING
      },
      contactEmail: {
        type: DataTypes.STRING
      },
      contactPhoneNumber: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM("available", "occupied", "pending")
      }
    });
    const blockedUser = sequelize.define("BlockedUser", {
      blockedFrom: {
        type: DataTypes.DATE,
      },
      blockedTo: {
        type: DataTypes.DATE,
      }
    })
    const userLogin = sequelize.define("UserLogin", {
      email: {
        type: DataTypes.STRING,
        validate: {
          is: /^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g
        }
      },
      password: {
        type: DataTypes.STRING,
      },
      logintrial: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      loginBlockedTime: {
        type: DataTypes.DATE
      } 
    })
    const favHouse = sequelize.define("FavouriteHouse");
    const housePhotos = sequelize.define("HousePhotos", {
      order: {
        type: DataTypes.INTEGER
      },
      fileName: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.ENUM("main", "default"),
        defaultValue: "default"
      }
    });

    
    user.hasOne(documents);
    documents.belongsTo(user);
    
    user.hasMany(address);
    address.belongsTo(user);
    
    user.hasMany(favHouse);
    favHouse.belongsTo(user);
    houses.hasMany(favHouse);
    favHouse.belongsTo(houses)
    
    user.hasOne(blockedUser);
    blockedUser.belongsTo(user);
    
    user.hasOne(userLogin);
    userLogin.belongsTo(user);
    
    user.hasMany(houses);
    houses.belongsTo(user);
    
    houses.hasMany(housePhotos);
    housePhotos.belongsTo(houses);
    
    sequelize.sync();

    return { user, houses, userLogin, blockedUser, favHouse }
  }
}


module.exports = db