const express = require('express');
const router = express.Router();

const { authenticate } = require('../component/jwtGenerator')

const houseRouter = (houses) => {
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
  return router;
}

module.exports = houseRouter