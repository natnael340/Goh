const express = require('express');
const router = express.Router();

const { authenticate } = require('../component/jwtGenerator')
const {validate} = require('../component/inputValidator')

const houseRouter = (houses, favHouse) => {
  router.post("/", authenticate, async (req, res) => {
    const title = req.body?.title || "";
    const description = req.body?.desc || "";
    const location = req.body?.location || "";
    const locationType = req.body?.location_type || null;
    const size = req.body?.size || "";
    const rooms = parseInt(req.body?.rooms) || null;
    const bedRooms = parseInt(req.body?.bed_rooms) || null;
    const category = req.body?.category || null;
    const contactName = req.body?.contact_name || "";
    const contactEmail = req.body?.contact_email || "";
    const contactPhoneNumber = req.body?.contact_phone_number || "";
    const status = req.body?.status || null;

    const s = validate([
      title, description, location, locationType, size,
      category,status,locationType,contactName,contactEmail
    ]);
    if(!s.status){
      return res.status(400).json({
        message: s.message
      })
    }
    /* 
    if (!/^[0-9a-zA-Z\ ]{3,64}$/g.test(title))
      return res.status(400).json({
        message: "Invalid title"
      })
    else if (!/^[a-zA-Z0-9]{0,255}$/g.test(description))
      return res.status(400).json({
        message: "Invalid first name"
      })
    else if (!/^[a-zA-Z0-9]{0,255}$/g.test(location))
      return res.status(400).json({
        message: "Invalid first name"
      })
    else if (!/^[0-9x]{0,255}$/g.test(size))
      return res.status(400).json({
        message: "Invalid size"
      })
    else if (category && (!/^[a-zA-Z]{9,20}$/g.test(category) || !["Apartment", "Condominium", "Shared Area", "Full Area"].includes(category)))
      return res.status(400).json({
        message: "Invalid category"
      })
    else if (status && (!/^[a-zA-Z]{6,10}$/g.test(status) || !["available", "occupied", "pending"].includes(status)))
      return res.status(400).json({
        message: "Invalid status"
      })
    else if (locationType && (!/^[a-zA-Z]{6,10}$/g.test(locationType) || !["map", "raw"].includes(locationType)))
      return res.status(400).json({
        message: "Invalid location type"
      })
    else if (!/^[a-zA-Z]{0,}$/g.test(contactName))
      return res.status(400).json({
        message: "Invalid contact name"
      })
    else if (contactEmail != "" && !/^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g.test(contactEmail))
      return res.status(400).json({
        message: "Invalid contact email"
      })
      */
    else {
      const newHouse = await houses.create({
        title,
        description,
        location,
        locationType,
        size,
        rooms,
        bedRooms,
        category,
        contactName,
        contactPhoneNumber,
        contactEmail,
        status,
        UserUuid: req.user.uuid
      });
      res.status(201).json({
        message: "house created",
        house: newHouse
      });
    }
  });
  router.get("/", authenticate, async (req, res) => {
    const houseInfo = await houses.findAll();
    return res.status(200).json(houseInfo)
  });
  router.put("/:id", authenticate, async(req, res) => {
    const title = req.body?.title || "";
    const description = req.body?.desc || "";
    const location = req.body?.location || "";
    const locationType = req.body?.location_type || null;
    const size = req.body?.size || "";
    const rooms = parseInt(req.body?.rooms) || null;
    const bedRooms = parseInt(req.body?.bed_rooms) || null;
    const category = req.body?.category || null;
    const contactName = req.body?.contact_name || "";
    const contactEmail = req.body?.contact_email || "";
    const contactPhoneNumber = req.body?.contact_phone_number || "";
    const status = req.body?.status || null;

    const s = validate([
      title, description, location, locationType, size,
      category,status,locationType,contactName,contactEmail
    ]);
    if(!s.status){
      return res.status(400).json({
        message: s.message
      })
    }
    const uHouse = await houses.findOne({
      where: {
        id: req.params.id,
        UserUuid: req.user.uuid
      }
    })
    if(!uHouse){
      return res.status(404).json({message: "House not found!!"})
    }
    uHouse.update({
      title: title || uHouse.title,
      description: description || uHouse.description,
      location: location || uHouse.location,
      locationType: locationType || uHouse.locationType,
      size: size || uHouse.size,
      rooms: rooms || uHouse.rooms,
      bedRooms: bedRooms || uHouse.bedRooms,
      category: category || uHouse.category,
      contactName: contactName || uHouse.contactName,
      contactEmail: contactEmail || uHouse.contactEmail,
      contactPhoneNumber: contactPhoneNumber || uHouse.contactPhoneNumber,
      status: status || uHouse.status
    })
    return res.status(200).json({message: "House Updated succesfully", data: uHouse})
  })
  router.delete("/:id", authenticate, async (req, res) => {
    const uHouse = await houses.findOne({
      where: {
        id: req.params.id,
        UserUuid: req.user.uuid
      }
    })
    if(uHouse){
      await uHouse.destroy()
      return res.status(200).json({message: "House deleted succesfully"})
    }
    return res.status(404).json({message: "House not found!!"})
  });
  router.get("/fav", authenticate, async (req, res) => {
    const favHouses = await houses.findAll({
      include: {
        model: favHouse,
        required: true,
        where: {
          UserUuid: req.user.uuid
        }
      }
    })
    return res.status(200).json(favHouses);
  })
  router.post("/fav", authenticate, async (req, res) => {
    const HousesId = req.body?.id || null;
    if(!HousesId) return res.status(400).json({message: "id parameter is required"})
    const house = await houses.findOne({
      where: {
        id: HousesId
      } 
    });
    if(!house) return res.status(404).json({message: "No such home exists!!"})
    await favHouse.create({
      HousesId,
      UserUuid: req.user.uuid
    });
    return res.status(200).json({message: "House added to favourite list"});
  })
  router.delete("/fav/:id", authenticate, async (req, res) => {
    const HousesId = req.params?.id || null;
    if(!HousesId) return res.status(400).json({message: "id parameter is required"})
    const house = await houses.findOne({
      where: {
        id: HousesId
      } 
    });
    if(!house) return res.status(404).json({message: "No such home exists!!"})
    await favHouse.destroy({
      where: {
        HousesId,
        UserUuid: req.user.uuid
      }
    });
    return res.status(200).json({message: "House removed from favourite list"});
  })
  return router;
}

module.exports = houseRouter